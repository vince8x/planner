/* PLANNER */
export const NEW_REMOTE_PROJECT = 'NEW_REMOTE_PROJECT';
export const NEW_REMOTE_PROJECT_SUCCESS = 'NEW_REMOTE_PROJECT_SUCCESS';
export const NEW_REMOTE_PROJECT_ERROR = 'NEW_REMOTE_PROJECT_ERROR';

export const SAVE_REMOTE_PROJECT = 'SAVE_REMOTE_PROJECT';
export const SAVE_REMOTE_PROJECT_SUCCESS = 'SAVE_REMOTE_PROJECT_SUCCESS';
export const SAVE_REMOTE_PROJECT_ERROR = 'SAVE_REMOTE_PROJECT_ERROR';

export const LOAD_REMOTE_PROJECT = 'LOAD_REMOTE_PROJECT';
export const LOAD_REMOTE_PROJECT_SUCCESS = 'LOAD_REMOTE_PROJECT_SUCCESS';
export const LOAD_REMOTE_PROJECT_ERROR = 'LOAD_REMOTE_PROJECT_ERROR';

export const FETCH_REMOTE_PROJECT_LIST = 'FETCH_REMOTE_PROJECT_LIST';
export const FETCH_REMOTE_PROJECT_LIST_SUCCESS = 'FETCH_REMOTE_PROJECT_LIST_SUCCESS';
export const FETCH_REMOTE_PROJECT_LIST_ERROR = 'FETCH_REMOTE_PROJECT_LIST_ERROR';

export const saveRemoteProject = (name, projectState) => ({
  type: SAVE_REMOTE_PROJECT,
  payload: { name, projectState }
});

export const saveRemoteProjectSuccess = (project) => ({
  type: SAVE_REMOTE_PROJECT_SUCCESS,
  payload: project
});

export const saveRemoteProjectError = (message) => ({
  type: SAVE_REMOTE_PROJECT_ERROR,
  payload: { message }
});

export const newRemoteProject = (name) => ({
  type: NEW_REMOTE_PROJECT,
  payload: { name },
});

export const newRemoteProjectSuccess = (project) => ({
  type: NEW_REMOTE_PROJECT_SUCCESS,
  payload: project,
});

export const newRemoteProjectError = (message) => ({
  type: NEW_REMOTE_PROJECT_ERROR,
  payload: { message },
});

export const loadRemoteProject = (id) => ({
  type: LOAD_REMOTE_PROJECT,
  payload: { id },
});

export const loadRemoteProjectSuccess = (project) => ({
  type: LOAD_REMOTE_PROJECT_SUCCESS,
  payload: project,
});

export const loadRemoteProjectError = (message) => ({
  type: LOAD_REMOTE_PROJECT_ERROR,
  payload: { message },
});

export const fetchRemoteProjectList = (userId) => ({
  type: FETCH_REMOTE_PROJECT_LIST,
  payload: { userId }
});

export const fetchRemoteProjectListSuccess = (projects) => ({
  type: FETCH_REMOTE_PROJECT_LIST_SUCCESS,
  payload: projects
});

export const fetchRemoteProjectListError = (message) => ({
  type: FETCH_REMOTE_PROJECT_LIST_ERROR,
  payload: { message }
});


