import * as _ from 'lodash';
import areapolygon from 'area-polygon';
import { csvDownload } from './browser';
import { GeometryUtils } from './export';
import { pdaData, currentThermalRequirements } from '../data/thermal-regulations/current';
import { futureThermalRequirements } from '../data/thermal-regulations/future';
import { fireResistanceSmall, fireResistanceBig } from '../data/fire-resistance/fire-resistance';
import {
  THERMAL_REQUIREMENTS, ACOUSTIC_REQUIREMENTS,
  FIRE_RESISTANCE_REQUIREMENTS, FUTURE_THERMAL_REGULATION,
  HORIZONTAL_PAIRED_BUILDING, COLLECTIVE_BUILDING
} from '../constants';
import calculateArea from './calculation';

export function convertSceneToElements(scene) {
  const elements = [];
  const areas = [];
  const { defaultWallHeight } = scene;

  _.map(scene.layers, layer => {
    const layerVertices = layer.vertices;
    const layerLines = layer.lines;
    const layerHoles = layer.holes;
    const layerAreas = layer.areas;

    for (const key in layerLines) {
      if (layerLines.hasOwnProperty(key)) {
        const line = layerLines[key];
        if (_.isNil(line)) continue;
        if (_.isNil(line.vertices[0]) || _.isNil(layerVertices[line.vertices[0]])) continue;
        if (_.isNil(line.vertices[1]) || _.isNil(layerVertices[line.vertices[1]])) continue;

        let wallType = null;
        if (line.type === 'interior-wall') {
          wallType = 'Interior';
        } else if (line.type === 'wall' || line.type === 'dividing-wall') {
          wallType = 'Perimeter';
        }

        const row = {
          Id: line.id,
          Sx: _.get(layerVertices[line.vertices[0]], 'x', 0),
          Sy: _.get(layerVertices[line.vertices[0]], 'y', 0),
          Ex: _.get(layerVertices[line.vertices[1]], 'x', 0),
          Ey: _.get(layerVertices[line.vertices[1]], 'y', 0),
          Type: line.type,
          Wall_Type: wallType,
          Wall_Face_A: line.properties.textureA[0].toUpperCase() + line.properties.textureA.slice(1),
          Wall_Face_B: line.properties.textureB[0].toUpperCase() + line.properties.textureB.slice(1),
          Height: defaultWallHeight,
          Associated_Wall: null,
          Areas: null
        };
        elements.push(row);
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
          Type: hole.type,
          Wall_Type: null,
          Wall_Face_A: null,
          Wall_Face_B: null,
          Associated_Wall: line.id
        };
        elements.push(row);
      }
    }

    for (const key in layerAreas) {
      if (layerAreas.hasOwnProperty(key)) {
        const area = layerAreas[key];
        if (_.isNil(area)) continue;
        if (_.isNil(area.vertices) || _.isNil(layerAreas)) continue;
        area.vertices.forEach(verticeKey => {
          const { x, y } = _.get(layer.vertices, verticeKey);
          areas.push({ x, y });
        });
      }
    }
  });

  return { elements, areas };
}

export function convertAreaToCSv(areas) {
  const csvResult = [];

  _.map(areas, area => {
    _.map(area, item => {
      const row = {
        Id: item.id,
        Type: item.type,
        X: item.x,
        Y: item.y
      };
      csvResult.push(row);
    })
  });

  return csvResult;
}

export function exportElementsCsv(scene) {
  const { elements } = convertSceneToElements(scene)
  csvDownload(elements);
}

export function exportAreaCsv(areas) {
  csvDownload(convertAreaToCSv(areas));
}

export function exportRequirement(scene, type, translateType) {

  const { thermalRegulation, layers,
    commune, thermalZone, typeOfGrouping, numberOfFloor } = scene;

  const csvResult = [];

  let thermalRequirementItem;
  // Check override with pda data
  if (_.find(pdaData, { 'commune': commune })) {
    thermalRequirementItem = _.find(pdaData, { 'commune': commune });
  } else {
    thermalRequirementItem = _.find(currentThermalRequirements, { 'thermalZone': thermalZone });
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      thermalRequirementItem = _.find(futureThermalRequirements, { 'thermalZone': thermalZone });
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
        totalAreaSize = calculateArea(area, layer);
      });
    });

    let fireResistanceItem;
    if ((numberOfFloor <= 2 && (totalAreaSize * numberOfFloor) <= 1400000) &&
      (typeOfGrouping !== HORIZONTAL_PAIRED_BUILDING) &&
      (typeOfGrouping !== COLLECTIVE_BUILDING)) {
      fireResistanceItem = _.find(fireResistanceSmall, { 'floorNum': numberOfFloor });
    } else {
      fireResistanceItem = _.find(fireResistanceBig, { 'floorNum': numberOfFloor });
    }

    if (fireResistanceItem) {
      csvResult.push({
        'TYPE': 'CATEGORY',
        'DE PISO': '',
        'PISO VENTILADO': 1,
        'ENTREPISO': 2,
        'TECHUMBRE': 3,
        'MURO DIVISORIO': 4,
        'MURO INTERIOR': 5,
        'MURO PERÍMETRAL': 6
      })
      const row = {
        'TYPE': translateType,
        'DE PISO': numberOfFloor,
        'PISO VENTILADO': fireResistanceItem.floor,
        'ENTREPISO': fireResistanceItem.mezzanine,
        'TECHUMBRE': fireResistanceItem.ceiling,
        'MURO DIVISORIO': fireResistanceItem.dividingWall,
        'MURO INTERIOR': fireResistanceItem.interiorWall,
        'MURO PERÍMETRAL': fireResistanceItem.perimeterWall
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

  const filename = `${type}_${Date.now()}.csv`;

  csvDownload(csvResult, filename);
}