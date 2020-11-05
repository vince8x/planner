import * as _ from 'lodash';
import areapolygon from 'area-polygon';
import { CATEGORY_MURO_INTERIOR, CATEGORY_PISO_VENTILADOR, CATEGORY_TECHUMBRE } from '../constants';
import { pdaData, currentThermalRequirements } from '../data/thermal-regulations/current';
import { futureThermalRequirements } from '../data/thermal-regulations/future';
import { fireResistanceSmall, fireResistanceBig } from '../data/fire-resistance/fire-resistance';
import {
  THERMAL_REQUIREMENTS, ACOUSTIC_REQUIREMENTS,
  FIRE_RESISTANCE_REQUIREMENTS, FUTURE_THERMAL_REGULATION,
  HORIZONTAL_PAIRED_BUILDING, COLLECTIVE_BUILDING,
  CATEGORY_MURO_PERIMETRAL, CATEGORY_ENTREPISO,
  CATEGORY_MURO_DIVISORIO
} from '../constants';

// piso ventilado: floor
// Entrepisos: Mezzanines
// Techumbre: Roofing, ceiling
// Muro Perímetral: Perimeter wall
// Muro Interior: interiorWall
// Muro Divisorio: dividingWall


export function getThermalRequirement(scene) {

  const { thermalRegulation, commune, thermalZone } = scene;

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

  if (!_.isNil(thermalRequirementItem)) {
    return [{
      categoryId: CATEGORY_PISO_VENTILADOR.ID,
      value: thermalRequirementItem.floor
    }, {
      categoryId: CATEGORY_TECHUMBRE.ID,
      value: thermalRequirementItem.ceiling
    }, {
      categoryId: CATEGORY_MURO_PERIMETRAL.ID,
      value: thermalRequirementItem.wall
    }];
  }

  return [];
}

export function getFireResistanceRequirement(scene) {
  const { layers, typeOfGrouping, numberOfFloor } = scene;

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
  if ((numberOfFloor <= 2 && (totalAreaSize * numberOfFloor) <= 1400000) &&
    (typeOfGrouping !== HORIZONTAL_PAIRED_BUILDING) &&
    (typeOfGrouping !== COLLECTIVE_BUILDING)) {
    fireResistanceItem = _.find(fireResistanceSmall, { 'floorNum': numberOfFloor });
  } else {
    fireResistanceItem = _.find(fireResistanceBig, { 'floorNum': numberOfFloor });
  }

  if (fireResistanceItem) {
    return [
      {
        categoryId: CATEGORY_PISO_VENTILADOR.ID,
        value: fireResistanceItem.floor
      },
      {
        categoryId: CATEGORY_ENTREPISO.ID,
        value: fireResistanceItem.mezzanine
      },
      {
        categoryId: CATEGORY_TECHUMBRE.ID,
        value: fireResistanceItem.ceiling
      },
      {
        categoryId: CATEGORY_MURO_DIVISORIO.ID,
        value: fireResistanceItem.dividingWall
      },
      {
        categoryId: CATEGORY_MURO_INTERIOR.ID,
        value: fireResistanceItem.interiorWall
      },
      {
        categoryId: CATEGORY_MURO_PERIMETRAL.ID,
        value: fireResistanceItem.perimeterWall
      }
    ];
  }

  return [];
}

export function getAcousticRequirement(scene) {
  const { typeOfGrouping } = scene;

  if (typeOfGrouping === HORIZONTAL_PAIRED_BUILDING || typeOfGrouping === COLLECTIVE_BUILDING) {
    return [
      {
        categoryId: CATEGORY_ENTREPISO.ID,
        value: 45
      },
      {
        categoryId: CATEGORY_ENTREPISO.ID,
        value: 75
      }
    ];
  }

  return [
    {
      categoryId: CATEGORY_ENTREPISO.ID,
      value: 0
    },
    {
      categoryId: CATEGORY_ENTREPISO.ID,
      value: 0
    }
  ]
}