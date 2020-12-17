import * as _ from 'lodash';
import {
  GeometryUtils,
} from '../utils/export';
import { Layer, Line, Project } from './export';
import MyCatalog from '../../catalog/mycatalog';
import { Map } from 'immutable';

function convertElementsToScene(state, plan) {
  plan.filter(element => element.Floor === 1 && !_.isNil(element.Wall_Type))
  .forEach(element => {
    const wallProperties = new Map({
      textureA: element.Wall_Face_A.toLowerCase(),
      textureB: element.Wall_Face_B.toLowerCase()
    });
    const layerID = state.getIn(['scene', 'selectedLayer']);
    const wallType = element.Wall_Type === 'Interior' ? 'interior-wall' : 'wall';
    const wallHoles = plan.filter(x => x.Floor === 1 && x.Associated_Wall ===  element.Id);
    const holesWithOffsetPosition = [];
    wallHoles.forEach(wallHole => {
      const offsetPosition = {
        x: (wallHole.Sx + wallHole.Ex)/2,
        y: (wallHole.Sy + wallHole.Ey)/2
      };
      
      const holeWidth = GeometryUtils.pointsDistance(wallHole.Sx, wallHole.Sy, wallHole.Ex, wallHole.Ey);
      const hole = {
        type: wallHole.Type,
        properties: new Map({
          width: new Map({ length: holeWidth })
        }) 
      }
      holesWithOffsetPosition.push({hole, offsetPosition})
    });
    state = Line.createAvoidingIntersections( 
      state, 
      layerID, 
      wallType, 
      element.Sx, 
      element.Sy, 
      element.Ex, 
      element.Ey,
      wallProperties,
      holesWithOffsetPosition.length > 0 ? holesWithOffsetPosition : null 
      ).updatedState;
    state = Layer.detectAndUpdateAreas( state, layerID ).updatedState;
  });
  
  return state;
}

class Optimization{

  static populateOptimizationPlan( state, plan ) {
    state = Project.newProject(state).updatedState;
    state = Project.initCatalog(state, MyCatalog).updatedState;
    state = convertElementsToScene(state, plan)
    return {updatedState: state, plan};
  }
}

export { Optimization as default };
