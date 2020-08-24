/* PLANNER */
export const PLANNER_NEW_PROJECT = 'PLANNER_NEW_PROJECT';
export const PLANNER_NEW_PROJECT_SUCCESS = 'PLANNER_NEW_PROJECT_SUCCESS';
export const PLANNER_NEW_PROJECT_ERROR = 'PLANNER_NEW_PROJECT_ERROR';

export const PLANNER_SAVE_PROJECT = 'PLANNER_SAVE_PROJECT';
export const PLANNER_SAVE_PROJECT_SUCCESS = 'PLANNER_SAVE_PROJECT_SUCCESS';
export const PLANNER_SAVE_PROJECT_ERROR = 'PLANNER_SAVE_PROJECT_ERROR';

export const newProject = (name) => ({
  type: PLANNER_NEW_PROJECT,
  payload: { name },
});

export const newProjectSuccess = (project) => ({
  type: PLANNER_NEW_PROJECT_SUCCESS,
  payload: project,
});

export const newProjectError = (message) => ({
  type: PLANNER_NEW_PROJECT_ERROR,
  payload: { message },
});

export const saveProjectSuccess = (state) => ({
  type: PLANNER_SAVE_PROJECT_SUCCESS,
  payload: { state }
});

export const saveProjectError = (message) => ({
  type: PLANNER_SAVE_PROJECT_ERROR,
  payload: { message }
});