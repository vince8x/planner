import * as _ from 'lodash';
import areapolygon from 'area-polygon';
import { csvDownload } from './browser';
import { GeometryUtils } from './export';
import { pdaData, currentThermalRequirements } from '../data/thermal-regulations/current';
import { futureThermalRequirements } from '../data/thermal-regulations/future';
import { fireResistanceSmall, fireResistanceBig } from '../data/fire-resistance/fire-resistance';
import { THERMAL_REQUIREMENTS, ACOUSTIC_REQUIREMENTS, 
  FIRE_RESISTANCE_REQUIREMENTS, FUTURE_THERMAL_REGULATION, 
  HORIZONTAL_PAIRED_BUILDING, COLLECTIVE_BUILDING 
} from '../constants';


export function exportElementsCsv(scene) {
  const csvResult = [];

  _.map(scene.layers, layer => {
    const layerVertices = layer.vertices;
    const layerLines = layer.lines;
    const layerHoles = layer.holes;

    for (const key in layerLines) {
      if (layerLines.hasOwnProperty(key)) {
        const line = layerLines[key];
        if (_.isNil(line)) continue;
        if (_.isNil(line.vertices[0]) || _.isNil(layerVertices[line.vertices[0]])) continue;
        if (_.isNil(line.vertices[1]) || _.isNil(layerVertices[line.vertices[1]])) continue;

        const row = {
          Id: line.id,
          Sx: _.get(layerVertices[line.vertices[0]], 'x', 0),
          Sy: _.get(layerVertices[line.vertices[0]], 'y', 0),
          Ex: _.get(layerVertices[line.vertices[1]], 'x', 0),
          Ey: _.get(layerVertices[line.vertices[1]], 'y', 0),
          H: line.properties.height && line.properties.height.length ? line.properties.height.length : 300,
          Type: line.type,
          Wall_Type: 'Perimeter',
          Wall_Face_A: line.properties.textureA,
          Wall_Face_B: line.properties.textureB,
          Associated_Wall: ''
        };
        csvResult.push(row);
      }
    }

    for (const key in layerHoles) {
      if (layerHoles.hasOwnProperty(key)) {
        const hole = layerHoles[key];
        const line = _.get(layerLines, hole.line, undefined);

        if (_.isNil(hole) || _.isNil(line)) continue;

        const { x: x0, y: y0 } = _.get(layer.vertices, line.vertices[0]);
        const { x: x1, y: y1 } = _.get(layer.vertices, line.vertices[1]);

        const lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
        const linePassing = GeometryUtils.linePassingThroughTwoPoints(x0, y0, x1, y1);


        const startAt = lineLength * hole.offset - _.get(hole.properties, 'width.length') / 2;
        const endAt = startAt + _.get(hole.properties, 'width.length');

        let startAtX;
        let startAtY;
        let endAtX;
        let endAtY;
        if (linePassing.a === 0) {
          // horizontal line
          startAtX = x0 + startAt;
          startAtY = y0;
          endAtX = x0 + endAt;
          endAtY = y0;
        } else if (linePassing.b === 0) {
          // vertical line
          startAtX = x0;
          startAtY = y0 + startAt;
          endAtX = x0;
          endAtY = y0 + endAt;
        } else {
          // normal line
          startAtX = x0 - ((startAt * (x0 - x1)) / lineLength);
          startAtY = (linePassing.c - linePassing.a * startAtX) / linePassing.b;
          endAtX = x0 - ((endAt * (x0 - x1)) / lineLength);
          endAtY = (linePassing.c - linePassing.a * endAtX) / linePassing.b;
        }

        const row = {
          Id: hole.id,
          Sx: startAtX,
          Sy: startAtY,
          Ex: endAtX,
          Ey: endAtY,
          H: hole.properties.height && line.properties.height.length ? line.properties.height.length : 300,
          Type: hole.type,
          Wall_Type: '',
          Wall_Face_A: line.properties.textureA,
          Wall_Face_B: line.properties.textureB,
          Associated_Wall: line.id
        };
        csvResult.push(row);
      }
    }
  });

  csvDownload(csvResult);
}

export function exportRequirement(scene, type, translateType) {

  const { thermalRegulation, layers,
    commune, thermalZone, typeOfGrouping, numberOfFloor } = scene;

  const csvResult = [];

  let thermalRequirementItem;
    // Check override with pda data
    if (_.find(pdaData, { commune })) {
      thermalRequirementItem = _.find(pdaData, { commune });
    } else {
      thermalRequirementItem = _.find(currentThermalRequirements, { thermalZone });
      if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
        thermalRequirementItem = _.find(futureThermalRequirements, { thermalZone });
      }
    }

    if (type === THERMAL_REQUIREMENTS && !_.isNil(thermalRequirementItem)) {
      const row = {
        'TYPE': translateType,
        'TECHUMBRE': thermalRequirementItem.ceiling,
        'MURO PERÍMETRAL': thermalRequirementItem.wall,
        'PISO VENTILADO': thermalRequirementItem.floor
      };
      csvResult.push(row);
    } else if (type === FIRE_RESISTANCE_REQUIREMENTS) {

      let totalAreaSize = 0;

      layers.map(layer => {
        layer.areas.map(area => {

          const polygon = area.vertices.toArray().map(vertexID => {
            const { x, y } = layer.vertices.get(vertexID);
            return [x, y];
          });

          let polygonWithHoles = polygon;

          area.holes.forEach(holeID => {

            const polygonHole = layer.areas.get(holeID).vertices.toArray().map(vertexID => {
              const { x, y } = layer.vertices.get(vertexID);
              return [x, y];
            });

            polygonWithHoles = polygonWithHoles.concat(polygonHole.reverse());
          });

          let areaSize = areapolygon(polygon, false);

          // subtract holes area
          area.holes.forEach(areaID => {
            const hole = layer.areas.get(areaID);
            const holePolygon = hole.vertices.toArray().map(vertexID => {
              const { x, y } = layer.vertices.get(vertexID);
              return [x, y];
            });
            areaSize -= areapolygon(holePolygon, false);
          });

          totalAreaSize = areaSize ? totalAreaSize + areaSize : totalAreaSize;
        });
      });

      let fireResistanceItem;
      if (numberOfFloor <= 2 && totalAreaSize <= 140) {
        fireResistanceItem = _.find(fireResistanceSmall, { floorNum: numberOfFloor});
      } else {
        fireResistanceItem = _.find(fireResistanceBig, { floorNum: numberOfFloor});
      }

      if (fireResistanceItem) {
        const row = {
          'TYPE': translateType,
          'DE PISO': numberOfFloor,
          'PISO VENTILADO': fireResistanceItem.floor,
          'ENTREPISO': fireResistanceItem.mezzanine,
          'TECHUMBRE': fireResistanceItem.ceiling,
          'MURO PERÍMETRAL': fireResistanceItem.perimeterWall,
          'MURO DIVISORIO': fireResistanceItem.dividingWall,
          'MURO INTERIOR': fireResistanceItem.interiorWall
        };
        csvResult.push(row);
      }

    } else if (type === ACOUSTIC_REQUIREMENTS) {
      if (typeOfGrouping === HORIZONTAL_PAIRED_BUILDING || typeOfGrouping === COLLECTIVE_BUILDING) {
        csvResult.push({
          'TYPE': 'Requerimiento acústico aéreo',
          'VALUE': 45
        });
        csvResult.push({
          'TYPE': 'Requerimiento acústico de impacto',
          'VALUE': 75
        });
      } else {
        csvResult.push({
          'TYPE': 'Requerimiento acústico aéreo',
          'VALUE': 0
        });
        csvResult.push({
          'TYPE': 'Requerimiento acústico de impacto',
          'VALUE': 0
        });
      }
    }

    const filename = `${type  }_${  Date.now()  }.csv`;

    csvDownload(csvResult, filename);
}