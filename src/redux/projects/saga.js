export const SAVE_PROJECT_TO_DB = 'SAVE_PROJECT_TO_DB';
export const SAVE_PROJECT_TO_DB_SUCCESS = 'SAVE_PROJECT_TO_DB_SUCCESS';
export const SAVE_PROJECT_TO_DB_ERROR = 'SAVE_PROJECT_TO_DB_ERROR';

export const saveProjectToDb = (name) => ({
  type: SAVE_PROJECT_TO_DB,
  payload: { name }
});

export const saveProjectToDbSuccess = (state) => ({
  type: SAVE_PROJECT_TO_DB_SUCCESS,
  payload: { project, state }
});

export const saveProjectError = (message) => ({
  type: SAVE_PROJECT_TO_DB_ERROR,
  payload: { message }
});