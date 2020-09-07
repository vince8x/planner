import  axios  from  'axios' ;
import { put, takeEvery, fork, all, call } from 'redux-saga/effects'
import { SET_LINES_LENGTH_END_DRAWING } from '../../react-planner/constants'
import { beginDrawingLine, endDrawingLine } from '../../react-planner/actions/lines-actions';
import { OPTIMIZE_PLANNER, optimizePlannerSuccess, optimizePlannerError } from './actions';

export function* endDrawingLineSaga(action) {
  const { linesAttributes, layerID } = action;
  const x = linesAttributes.getIn(['vertexTwo', 'x']);
  const y = linesAttributes.getIn(['vertexTwo', 'y']);
  yield put(endDrawingLine(x, y));
  yield put(beginDrawingLine(layerID, x, y));
}

export function* watchSetLinesLengthEndDrawing() {
  yield takeEvery(SET_LINES_LENGTH_END_DRAWING, endDrawingLineSaga);
}



export function* optimizePlannerSaga(action) {
  const { userId, projectId, elements } = action.payload;
  const url = 'http://localhost:8070/api/optimize';
  const apiCall = () => {
    return axios.post(url, 
      action.payload,
   ).then(response => response.data)
    .catch(err => {
      throw err;
    });
  }

  try {
    yield call (apiCall);
    yield put(optimizePlannerSuccess('success'));
  } catch (err) {
    yield put(optimizePlannerError(err.message));
  }
  

}

export function* watchOptimizePlanner() {
  yield takeEvery(OPTIMIZE_PLANNER, optimizePlannerSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchSetLinesLengthEndDrawing),
    fork(watchOptimizePlanner)
  ]);
}