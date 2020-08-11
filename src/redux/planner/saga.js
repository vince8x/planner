import { put, takeEvery, fork, all } from 'redux-saga/effects'
import { SET_LINES_LENGTH_END_DRAWING } from '../../react-planner/constants'
import { beginDrawingLine, endDrawingLine } from '../../react-planner/actions/lines-actions';

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

export default function* rootSaga() {
  yield all([
    fork(watchSetLinesLengthEndDrawing)
  ]);
}