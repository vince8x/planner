/* PLANNER */
export const PLANNER_NEW_PROJECT = 'PLANNER_NEW_PROJECT';
export const PLANNER_NEW_PROJECT_SUCCESS = 'PLANNER_NEW_PROJECT_SUCCESS';
export const PLANNER_NEW_PROJECT_ERROR = 'PLANNER_NEW_PROJECT_ERROR';

export const PLANNER_SAVE_PROJECT = 'PLANNER_SAVE_PROJECT';
export const PLANNER_SAVE_PROJECT_SUCCESS = 'PLANNER_SAVE_PROJECT_SUCCESS';
export const PLANNER_SAVE_PROJECT_ERROR = 'PLANNER_SAVE_PROJECT_ERROR';

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