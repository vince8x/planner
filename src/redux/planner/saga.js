import axios from 'axios';
import * as _ from 'lodash';
import { select, call, put, fork, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { SET_LINES_LENGTH_END_DRAWING, SOLUTION_CATEGORIES } from '../../react-planner/constants'
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
import { csvDownload } from '../../react-planner/utils/browser';

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
    yield call(apiCall);
    yield put(optimizePlannerSuccess('success'));
  } catch (err) {
    yield put(optimizePlannerError(err.message));
  }


}

export function* watchOptimizePlanner() {
  yield takeLatest(OPTIMIZE_PLANNER, optimizePlannerSaga);
}

export function* exportSolutions({ payload }) {
  const categoryId = _.parseInt(payload.categoryId);
  const category = _.find(SOLUTION_CATEGORIES, { 'ID': categoryId });
  const plannerState = yield select(getPlannerState);
  const { updatedState } = Project.unselectAll(plannerState);
  const scene = updatedState.get('scene');
  const thermal = _.filter(getThermalRequirement(scene), { 'categoryId': categoryId });
  const fire = _.filter(getFireResistanceRequirement(scene), { 'categoryId': categoryId });
  const acoustic = _.filter(getAcousticRequirement(scene), { 'categoryId': categoryId });

  const csvResult = [];

  thermal.map(item => {
    csvResult.push({
      'Id': categoryId,
      'Category': category.NAME,
      'Type': 'Térmico',
      'Value': item.value
    });
  });
  fire.map(item => {
    csvResult.push({
      'Id': categoryId,
      'Category': category.NAME,
      'Type': 'Resistencia al fuego',
      'Value': item.value
    });
  });
  acoustic.map(item => {
    csvResult.push({
      'Id': categoryId,
      'Category': category.NAME,
      'Type': 'Acústico',
      'Value': item.value
    });
  });
  const url = `${process.env.REACT_APP_API_ENDPOINT}/api/filter_solutions`;
  const data = {
    categoryId,
    thermal,
    fire,
    acoustic
  };

  const apiCall = () => {
    return axios.post(url, data).then(response => response.data).catch(error => {
      throw error;
    });
  }

  try {
    const response = yield call(apiCall);
    const filename = `${category.NAME}_soluciones_${Date.now()}.csv`;
    yield put(exportSolutionsSuccess(response));
    yield csvDownload(response, filename);
  } catch (error) {
    yield put(exportSolutionsFailure(error.message));
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