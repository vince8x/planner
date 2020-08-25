import firebase from 'firebase';
import { select, call, put, fork, takeLatest, all } from 'redux-saga/effects';
import { success } from 'react-toastify-redux';
import { firestore } from '../../helpers/Firebase';
import { getUserId } from '../auth/selectors';
import { saveRemoteProjectError, saveRemoteProjectSuccess, SAVE_REMOTE_PROJECT, SAVE_REMOTE_PROJECT_SUCCESS } from './actions';


const saveRemoteProjectAsync = async(userId, projectName, projectState) => {
  return await firestore.collection('users').doc(userId).collection('projects').set({
    name: projectName,
    state: projectState,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function* saveRemoteProject({ payload }) {
  const { name, projectState } = payload;

  try {
    const userId = yield select(getUserId);
    const status = yield call(saveRemoteProjectAsync, userId, name, projectState);

    if (!status) {
      yield put(saveRemoteProjectSuccess(projectState));
    } else {
      yield put(saveRemoteProjectError(status.message));
    }
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

export default function* rootSaga() {
  yield all([
    fork(watchSaveRemoteProject),
    fork(watchSaveRemoteProjectSuccess)
  ]);
}