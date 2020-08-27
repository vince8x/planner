import firebase from 'firebase';
import { select, call, put, fork, takeLatest, all } from 'redux-saga/effects';
import { success } from 'react-toastify-redux';
import { firestore, reduxSagaFirebase as rsf } from '../../helpers/Firebase';
import { getUserId } from '../auth/selectors';
import {
  saveRemoteProjectError,
  saveRemoteProjectSuccess,
  SAVE_REMOTE_PROJECT,
  SAVE_REMOTE_PROJECT_SUCCESS,
  fetchRemoteProjectListError,
  fetchRemoteProjectListSuccess,
  FETCH_REMOTE_PROJECT_LIST
} from './actions';

function* saveRemoteProject({ payload }) {
  const { name, projectState } = payload;

  try {
    const userId = yield select(getUserId);
    const project = {
      name,
      state: projectState,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
    const doc = yield call(rsf.firestore.addDocument, `users/${userId}/projects`, project)
    const result = yield doc.get();
    yield put(saveRemoteProjectSuccess(result.data()));

  } catch (error) {
    yield put(saveRemoteProjectError(error));
  }
}



export function* watchSaveRemoteProject() {
  yield takeLatest(SAVE_REMOTE_PROJECT, saveRemoteProject);
}

export function* saveRemoteProjectSuccessSaga() {
  // @TODO: multi language in saga
  yield put(success('Save project success'));
}

export function* watchSaveRemoteProjectSuccess() {
  yield takeLatest(SAVE_REMOTE_PROJECT_SUCCESS, saveRemoteProjectSuccessSaga);
}


export function* fetchRemoteProjectList({ payload }) {
  const { userId } = payload;
  try {
    const snapshot = yield call(rsf.firestore.getCollection, `users/${userId}/projects`);
    const projects = [];
    snapshot.forEach(item => {
      const project = {
        id: item.id,
        ...item.data()
      }
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

export default function* rootSaga() {
  yield all([
    fork(watchSaveRemoteProject),
    fork(watchSaveRemoteProjectSuccess),
    fork(watchFetchRemoteProjectList)
  ]);
}