import firebase from 'firebase';
import { select, call, put, fork, takeLatest, all } from 'redux-saga/effects';
import { success, error } from 'react-toastify-redux';
import * as _ from 'lodash';
import { reduxSagaFirebase as rsf } from '../../helpers/Firebase';
import { getUserId } from '../auth/selectors';
import {
  saveRemoteProjectError,
  saveRemoteProjectSuccess,
  SAVE_REMOTE_PROJECT,
  SAVE_REMOTE_PROJECT_SUCCESS,
  SAVE_REMOTE_PROJECT_ERROR,
  fetchRemoteProjectListError,
  fetchRemoteProjectListSuccess,
  FETCH_REMOTE_PROJECT_LIST,
  LOAD_REMOTE_PROJECT,
  loadRemoteProjectSuccess,
  loadRemoteProjectError,
  ADD_REMOTE_PROJECT,
  addRemoteProjectSuccess,
  addRemoteProjectError,
  ADD_REMOTE_PROJECT_SUCCESS,
  ADD_REMOTE_PROJECT_ERROR,
  DELETE_REMOTE_PROJECTS,
  deleteRemoteProjectsSuccess,
  deleteRemoteProjectsError,
} from './actions';
import { LOAD_PROJECT, NEW_PROJECT } from '../../react-planner/constants';
import { loadProject } from '../../react-planner/actions/project-actions';
import {
  cleanupOptimizeData,
  closeOptimizationBar,
  openOptimizationBar,
  populateOptimizeData,
  stopProgressBar,
} from '../menu/actions';
import { getOptimizeData } from '../menu/selectors';

function* saveRemoteProject({ payload }) {
  const { id, imageBlob } = payload;
  let { project } = payload;

  try {
    const userId = yield select(getUserId);
    const optimizeData = yield select(getOptimizeData);
    project = {
      ...project,
      id,
      optimizeData : optimizeData ?? null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    yield rsf.storage.uploadFile(
      `images/${userId}/projects/${id}.png`,
      imageBlob
    );
    yield call(
      rsf.firestore.setDocument,
      `users/${userId}/projects/${id}`,
      project
    );
    yield put(saveRemoteProjectSuccess(project));
  } catch (err) {
    yield put(saveRemoteProjectError(err));
  }
}

export function* watchSaveRemoteProject() {
  yield takeLatest(SAVE_REMOTE_PROJECT, saveRemoteProject);
}

export function* saveRemoteProjectSuccessSaga() {
  // @TODO: multi language in saga
  yield put(success('Save project success'));
}

export function* saveRemoteProjectErrorSaga() {
  // @TODO: multi language in saga
  yield put(error('Unable to save project'));
}

export function* watchSaveRemoteProjectSuccess() {
  yield takeLatest(SAVE_REMOTE_PROJECT_SUCCESS, saveRemoteProjectSuccessSaga);
}

export function* watchSaveRemoteProjectError() {
  yield takeLatest(SAVE_REMOTE_PROJECT_ERROR, saveRemoteProjectErrorSaga);
}

export function* fetchRemoteProjectList({ payload }) {
  const { userId } = payload;
  try {
    const snapshot = yield call(
      rsf.firestore.getCollection,
      `users/${userId}/projects`
    );
    const projects = [];
    snapshot.forEach((item) => {
      const project = {
        id: item.id,
        ...item.data(),
      };
      projects.push(project);
    });
    yield put(fetchRemoteProjectListSuccess(projects));
  } catch (err) {
    yield put(fetchRemoteProjectListError(err));
  }
}

export function* watchFetchRemoteProjectList() {
  yield takeLatest(FETCH_REMOTE_PROJECT_LIST, fetchRemoteProjectList);
}

export function* loadRemoteProject({ payload }) {
  try {
    const { id, history } = payload;
    const userId = yield select(getUserId);
    const snapshot = yield call(
      rsf.firestore.getDocument,
      `users/${userId}/projects/${id}`
    );
    if (snapshot.exists) {
      const project = snapshot.data();
      project.id = id;
      yield put(loadRemoteProjectSuccess(project));
      yield put(loadProject(project.state, project.optimizeData));
      history.push('/planner');
    } else {
      yield put(loadRemoteProjectError('No project found'));
    }
  } catch (err) {
    yield put(loadRemoteProjectError(err));
  }
}

export function* loadProjectSaga({ sceneJSON, optimizeData }) {
  yield put(stopProgressBar());
  yield put(populateOptimizeData(optimizeData));
  if (!_.isNil(optimizeData)) {
    yield put(openOptimizationBar());
  }
  else {
    yield put(closeOptimizationBar());
  }
}

export function* newProjectSaga() {
  yield put(stopProgressBar());
  yield put(cleanupOptimizeData());
  yield put(closeOptimizationBar());
}

export function* addRemoteProjectSuccessSaga() {
  // @TODO: multi language in saga
  yield put(success('Add project success'));
}

export function* addRemoteProjectErrorSaga() {
  // @TODO: multi language in saga
  yield put(error('Unable to add project'));
}

export function* watchLoadRemoteProject() {
  yield takeLatest(LOAD_REMOTE_PROJECT, loadRemoteProject);
}

function* addRemoteProject({ payload }) {
  const { name, projectState, imageBlob } = payload;

  try {
    const userId = yield select(getUserId);
    const optimizeData = yield select(getOptimizeData);
    const project = {
      name,
      state: projectState,
      optimizeData : optimizeData ?? null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const doc = yield call(
      rsf.firestore.addDocument,
      `users/${userId}/projects`,
      project
    );
    const result = yield doc.get();
    const newProject = result.data();
    newProject.id = result.id;
    yield rsf.storage.uploadFile(
      `images/${userId}/projects/${newProject.id}.png`,
      imageBlob
    );
    yield put(addRemoteProjectSuccess(newProject));
  } catch (err) {
    yield put(addRemoteProjectError(err));
  }
}

export function* watchAddRemoteProject() {
  yield takeLatest(ADD_REMOTE_PROJECT, addRemoteProject);
}

export function* watchAddRemoteProjectSuccess() {
  yield takeLatest(ADD_REMOTE_PROJECT_SUCCESS, addRemoteProjectSuccessSaga);
}

export function* watchAddRemoteProjectError() {
  yield takeLatest(ADD_REMOTE_PROJECT_ERROR, addRemoteProjectErrorSaga);
}

export function* deleteRemoteProjects({ payload }) {
  const { ids } = payload;
  const userId = yield select(getUserId);
  try {
    yield all(
      _.map(ids, (id) => {
        return rsf.firestore.deleteDocument(`users/${userId}/projects/${id}`);
      })
    );
  } catch (err) {
    console.log(err);
    yield put(deleteRemoteProjectsError());
  }

  yield all(
    _.map(ids, (id) => {
      return rsf.storage.deleteFile(`images/${userId}/projects/${id}.png`);
    })
  );
  yield put(deleteRemoteProjectsSuccess(ids));
}

export function* watchDeleteRemoteProjects() {
  yield takeLatest(DELETE_REMOTE_PROJECTS, deleteRemoteProjects);
}

export function* watchLoadProject() {
  yield takeLatest(LOAD_PROJECT, loadProjectSaga);
}

export function* watchNewProject() {
  yield takeLatest(NEW_PROJECT, newProjectSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchAddRemoteProject),
    fork(watchAddRemoteProjectError),
    fork(watchAddRemoteProjectSuccess),
    fork(watchSaveRemoteProject),
    fork(watchSaveRemoteProjectSuccess),
    fork(watchSaveRemoteProjectError),
    fork(watchFetchRemoteProjectList),
    fork(watchLoadRemoteProject),
    fork(watchDeleteRemoteProjects),
    fork(watchLoadProject),
    fork(watchNewProject),
  ]);
}
