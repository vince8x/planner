/* PLANNER */
export const PLANNER_NEW_PROJECT = 'PLANNER_NEW_PROJECT';
export const PLANNER_NEW_PROJECT_SUCCESS = 'PLANNER_NEW_PROJECT_SUCCESS';
export const PLANNER_NEW_PROJECT_ERROR = 'PLANNER_NEW_PROJECT_ERROR';

export const SAVE_REMOTE_PROJECT = 'SAVE_REMOTE_PROJECT';
export const SAVE_REMOTE_PROJECT_SUCCESS = 'SAVE_REMOTE_PROJECT_SUCCESS';
export const SAVE_REMOTE_PROJECT_ERROR = 'SAVE_REMOTE_PROJECT_ERROR';

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

export const FetchRemoteProjectList = (userId) => ({
  type: FETCH_REMOTE_PROJECT_LIST,
  payload: { userId }
});

export const FetchRemoteProjectListSuccess = (projects) => ({
  type: FETCH_REMOTE_PROJECT_LIST_SUCCESS,
  payload: projects
});

export const FetchRemoteProjectListError = (message) => ({
  type: FETCH_REMOTE_PROJECT_LIST_ERROR,
  payload: { message }
});


