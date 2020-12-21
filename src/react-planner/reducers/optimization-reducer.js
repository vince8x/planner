import { SELECTED_OPTIMIZE_PLAN, LOAD_ORIGINAL } from '../constants';
import { Optimization, Project } from '../class/export';

export default function (state, action) {
  switch (action.type) {
    case SELECTED_OPTIMIZE_PLAN:
      return Optimization.populateOptimizationPlan(state, action.payload)
        .updatedState;
    case LOAD_ORIGINAL:
      return Project.loadProject(state, action.payload).updatedState;
    default:
      return state;
  }
}
