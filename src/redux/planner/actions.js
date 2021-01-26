/* PLANNER */

export const EXPORT_SOLUTIONS = 'EXPORT_SOLUTIONS';
export const EXPORT_SOLUTIONS_SUCCESS = 'EXPORT_SOLUTIONS_SUCCESS';
export const EXPORT_SOLUTIONS_FAILURE = 'EXPORT_SOLUTIONS_FAILURE';

export const OPTIMIZE_PLANNER = 'OPTIMIZE_PLANNER';
export const OPTIMIZE_PLANNER_SUCCESS = 'OPTIMIZE_PLANNER_SUCCESS';
export const OPTIMIZE_PLANNER_ERROR = 'OPTIMIZE_PLANNER_ERROR';
export const SET_HEIGHT_FAILURE = 'SET_HEIGHT_FAILURE';

export const END_DRAWING_LINE = 'END_DRAWING_LINE';
export const END_DRAWING_LINE_SUCCESS = 'END_DRAWING_LINE_SUCCESS'

export const optimizePlanner = (userId, projectId, elements, email, name, projectParams, areas, isTest) => ({
  type: OPTIMIZE_PLANNER,
  payload: { userId, projectId, elements, email, name, projectParams, areas, isTest }
});

export const optimizePlannerSuccess = (status) => ({
  type: OPTIMIZE_PLANNER_SUCCESS,
  payload: status
});

export const optimizePlannerError = (message) => ({
  type: OPTIMIZE_PLANNER_ERROR,
  payload: { message }
});

export const exportSolutions = (categoryId) => ({
  type: EXPORT_SOLUTIONS,
  payload: { categoryId }
});

export const exportSolutionsSuccess = (solutions) => ({
  type: EXPORT_SOLUTIONS_SUCCESS,
  payload: solutions
});

export const exportSolutionsFailure = (message) => ({
  type: EXPORT_SOLUTIONS_FAILURE,
  payload: { message }
});

export function setHeightFailure() {
  return {
    type: SET_HEIGHT_FAILURE
  };
}

export function endDrawingLineSuccess() {
  return {
    type: END_DRAWING_LINE_SUCCESS
  };
}