/* PLANNER */

export const EXPORT_SOLUTIONS = 'EXPORT_SOLUTIONS';
export const EXPORT_SOLUTIONS_SUCCESS = 'EXPORT_SOLUTIONS_SUCCESS';
export const EXPORT_SOLUTIONS_FAILURE = 'EXPORT_SOLUTIONS_FAILURE';

export const OPTIMIZE_PLANNER = 'OPTIMIZE_PLANNER';
export const OPTIMIZE_PLANNER_SUCCESS = 'OPTIMIZE_PLANNER_SUCCESS';
export const OPTIMIZE_PLANNER_ERROR = 'OPTIMIZE_PLANNER_ERROR';

export const optimizePlanner = (userId, projectId, elements) => ({
  type: OPTIMIZE_PLANNER,
  payload: { userId, projectId, elements }
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
  type: EXPORT_SOLUTIONS,
  payload: { message }
});