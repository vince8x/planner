import  { Map } from 'immutable';
import {
  Models as PlannerModels,
  reducer as PlannerReducer,
} from '../../react-planner';


const INIT_STATE = Map({
  'react-planner': new PlannerModels.State()
});

export default (state = INIT_STATE, action) => {
  return state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
}