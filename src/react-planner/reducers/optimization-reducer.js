import { SELECTED_OPTIMIZE_PLAN } from '../constants';
import { Optimization } from '../class/export';

export default function (state, action) {

  switch (action.type) {
    case SELECTED_OPTIMIZE_PLAN:
      return Optimization.populateOptimizationPlan(state, action.payload).updatedState;

    default:
      return state;

  }
}
