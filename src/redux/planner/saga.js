import  axios  from  'axios' ;
import { select, call, put, fork, takeLatest, all } from 'redux-saga/effects';
import { SET_LINES_LENGTH_END_DRAWING } from '../../react-planner/constants'
import { beginDrawingLine, endDrawingLine } from '../../react-planner/actions/lines-actions';
import { 
  OPTIMIZE_PLANNER, 
  optimizePlannerSuccess, 
  optimizePlannerError,
  EXPORT_SOLUTIONS,
  exportSolutionsSuccess,
  exportSolutionsFailure
} from './actions';
import { getPlannerState } from './selectors';
import { Project } from '../../react-planner/class/export';
import { getAcousticRequirement, getFireResistanceRequirement, getThermalRequirement } from '../../react-planner/utils/requirement-solutions';
import environment from '../../environment/environment';

export function* endDrawingLineSaga(action) {
  const { linesAttributes, layerID } = action;
  const x = linesAttributes.getIn(['vertexTwo', 'x']);
  const y = linesAttributes.getIn(['vertexTwo', 'y']);
  yield put(endDrawingLine(x, y));
  yield put(beginDrawingLine(layerID, x, y));
}

export function* watchSetLinesLengthEndDrawing() {
  yield takeLatest(SET_LINES_LENGTH_END_DRAWING, endDrawingLineSaga);
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
  yield takeLatest(OPTIMIZE_PLANNER, optimizePlannerSaga);
}

export function* exportSolutions({ payload }) {
  const { categoryId } = payload;
  const plannerState = yield select(getPlannerState);
  const { updatedState } = Project.unselectAll(plannerState);
  const scene = updatedState.get('scene').toJS();
  const thermal = getThermalRequirement(scene);
  const fire = getFireResistanceRequirement(scene);
  const acoustic = getAcousticRequirement(scene);
  const url = `${environment.apiEndpoint}/api/filter_solutions`;
  const data = {
    categoryId,
    thermal,
    fire,
    acoustic
  };

  const apiCall = () => {
    return axios.post(url, data).then(response => response.data)
    .catch(err => {
      throw err;
    });
  }

  try {
    const response = yield call (apiCall);
    yield put(exportSolutionsSuccess(response));
  } catch (err) {
    yield put(exportSolutionsFailure(err.message));
  }
}

export function* watchExportSolutions() {
  yield takeLatest(EXPORT_SOLUTIONS, exportSolutions);
}

export default function* rootSaga() {
  yield all([
    fork(watchSetLinesLengthEndDrawing),
    fork(watchOptimizePlanner),
    fork(watchExportSolutions)
  ]);
}