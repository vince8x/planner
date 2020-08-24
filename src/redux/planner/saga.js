import { put, takeEvery, fork, all, takeLatest, select, call } from 'redux-saga/effects'
import {dismiss, update, error, message, warning, success, info} from 'react-toastify-redux';
import { database } from '../../helpers/Firebase';
import { SET_LINES_LENGTH_END_DRAWING, NEW_PROJECT, SAVE_PROJECT } from '../../react-planner/constants'
import { beginDrawingLine, endDrawingLine } from '../../react-planner/actions/lines-actions';
import { newProjectError, newProjectSuccess, saveProjectSuccess, saveProjectError } from './actions';
import { getPlannerState }   from './selectors';

export function* endDrawingLineSaga(action) {
  const { linesAttributes, layerID } = action;
  const x = linesAttributes.getIn(['vertexTwo', 'x']);
  const y = linesAttributes.getIn(['vertexTwo', 'y']);
  yield put(endDrawingLine(x, y));
  yield put(beginDrawingLine(layerID, x, y));
}

export function* watchSetLinesLengthEndDrawing() {
  yield takeEvery(SET_LINES_LENGTH_END_DRAWING, endDrawingLineSaga)
}

const saveProjectAsync = async(projectId, projectName, plannerState) => {
  await database.ref('projects/' + projectId).set({
    name: projectName,
    planner: plannerState
  });
}

export function* saveProject() {
  const planner = yield select(getPlannerState);
  const savedProject = yield call(saveProjectAsync, 'abc123', 'abc', planner);
  if (!savedProject.message) {
    yield put(saveProjectSuccess(savedProject));
  } else {
    yield put(saveProjectError(savedProject.message));
  }
}

// export function* watchSaveProject() {
//   yield takeLatest(SAVE_PROJECT)
// }

export function* newProject() {
  try {
    yield put(success('New project success'));
    yield put(newProjectSuccess());
  } catch (err) {
    yield put(newProjectError(err));
  }
  
}

export function* watchSaveProject() {
  yield takeLatest(SAVE_PROJECT, saveProject);
}

export function* watchNewProject() {
  yield takeLatest(NEW_PROJECT, newProject);
}

export default function* rootSaga() {
  yield all([
    fork(watchSetLinesLengthEndDrawing),
    fork(watchNewProject),
    fork(watchSaveProject),
  ]);
}