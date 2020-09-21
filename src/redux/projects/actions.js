/* PLANNER */
export const NEW_REMOTE_PROJECT = 'NEW_REMOTE_PROJECT';
export const NEW_REMOTE_PROJECT_SUCCESS = 'NEW_REMOTE_PROJECT_SUCCESS';
export const NEW_REMOTE_PROJECT_ERROR = 'NEW_REMOTE_PROJECT_ERROR';

export const ADD_REMOTE_PROJECT = 'ADD_REMOTE_PROJECT';
export const ADD_REMOTE_PROJECT_SUCCESS = 'ADD_REMOTE_PROJECT_SUCCESS';
export const ADD_REMOTE_PROJECT_ERROR = 'ADD_REMOTE_PROJECT_ERROR';

export const SAVE_REMOTE_PROJECT = 'SAVE_REMOTE_PROJECT';
export const SAVE_REMOTE_PROJECT_SUCCESS = 'SAVE_REMOTE_PROJECT_SUCCESS';
export const SAVE_REMOTE_PROJECT_ERROR = 'SAVE_REMOTE_PROJECT_ERROR';

export const LOAD_REMOTE_PROJECT = 'LOAD_REMOTE_PROJECT';
export const LOAD_REMOTE_PROJECT_SUCCESS = 'LOAD_REMOTE_PROJECT_SUCCESS';
export const LOAD_REMOTE_PROJECT_ERROR = 'LOAD_REMOTE_PROJECT_ERROR';

export const FETCH_REMOTE_PROJECT_LIST = 'FETCH_REMOTE_PROJECT_LIST';
export const FETCH_REMOTE_PROJECT_LIST_SUCCESS = 'FETCH_REMOTE_PROJECT_LIST_SUCCESS';
export const FETCH_REMOTE_PROJECT_LIST_ERROR = 'FETCH_REMOTE_PROJECT_LIST_ERROR';

export const DELETE_REMOTE_PROJECTS = 'DELETE_REMOTE_PROJECTS';
export const DELETE_REMOTE_PROJECTS_SUCCESS = 'DELETE_REMOTE_PROJECTS_SUCCESS';
export const DELETE_REMOTE_PROJECTS_ERROR = 'DELETE_REMOTE_PROJECTS_ERROR';



export const addRemoteProject = (name, projectState, imageBlob) => ({
  type: ADD_REMOTE_PROJECT,
  payload: { name, projectState, imageBlob }
});

export const addRemoteProjectSuccess = (project) => ({
  type: ADD_REMOTE_PROJECT_SUCCESS,
  payload: project
});

export const addRemoteProjectError = (message) => ({
  type: ADD_REMOTE_PROJECT_ERROR,
  payload: { message }
});

export const saveRemoteProject = (id, project, imageBlob) => ({
  type: SAVE_REMOTE_PROJECT,
  payload: { id, project, imageBlob }
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

export const loadRemoteProject = (id, history) => ({
  type: LOAD_REMOTE_PROJECT,
  payload: { id, history },
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

export const deleteRemoteProjects = (ids) => ({
  type: DELETE_REMOTE_PROJECTS,
  payload: { ids },
});

export const deleteRemoteProjectsSuccess = (ids) => ({
  type: DELETE_REMOTE_PROJECTS_SUCCESS,
  payload: ids
});

export const deleteRemoteProjectsError = (message) => ({
  type: DELETE_REMOTE_PROJECTS_ERROR,
  payload: { message },
});
