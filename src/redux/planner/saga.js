import axios from 'axios';
import * as _ from 'lodash';
import { success, message, error } from 'react-toastify-redux';
import { select, call, put, fork, takeLatest, all } from 'redux-saga/effects';
import { SET_HEIGHT_FAILURE, SET_LINES_LENGTH_END_DRAWING, SOLUTION_CATEGORIES } from '../../react-planner/constants'
import { beginDrawingLine, endDrawingLine } from '../../react-planner/actions/lines-actions';
import {
  OPTIMIZE_PLANNER,
  OPTIMIZE_PLANNER_SUCCESS,
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
import { populateOptimizeData, cleanupOptimizeData, openOptimizationBar, startProgressBar, stopProgressBar } from '../menu/actions';

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
  const { userId, projectId, elements, email, name, projectParams, isTest } = action.payload;

  const url = isTest ? `${process.env.REACT_APP_API_ENDPOINT}/api/test_process_data` :
   `${process.env.REACT_APP_API_ENDPOINT}/api/process_data`;

  const plannerState = yield select(getPlannerState);
  const { updatedState } = Project.unselectAll(plannerState);
  const scene = updatedState.get('scene');

  const thermal = getThermalRequirement(scene);
  const fire = getFireResistanceRequirement(scene);
  const acoustic = getAcousticRequirement(scene);

  const data = {
    userId,
    projectId,
    elements,
    email,
    name,
    thermal,
    fire,
    acoustic,
    projectParams
  };

  const apiCall = () => {
    return axios.post(url, data).then(response => response.data).catch(err => {
      throw err;
    });
  }
  
  try {
    if (isTest) {
      yield put(openOptimizationBar());
      yield put(cleanupOptimizeData());
    }
    yield put(startProgressBar());
    const response = yield call(apiCall);
    yield put(stopProgressBar());
    yield put(optimizePlannerSuccess(response));
    if (isTest) {
      const filename = `optimize_result_${Date.now()}.csv`;
      yield csvDownload(response, filename);
      yield put(populateOptimizeData(response));
    }
    // else {
    //   yield put(populateOptimizeData(response));
    // }
  } catch (err) {
    yield put(optimizePlannerError(err.message));
  }
}

export function* optimizePlannerSuccessSaga() {
  yield put(success('Request accepted. The result will be sent to your email'));
}

export function* watchOptimizePlanner() {
  yield takeLatest(OPTIMIZE_PLANNER, optimizePlannerSaga);
}

export function* watchOptimizePlannerSuccess() {
  yield takeLatest(OPTIMIZE_PLANNER_SUCCESS, optimizePlannerSuccessSaga);
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
    return axios.post(url, data).then(response => response.data).catch(err => {
      throw err;
    });
  }

  try {
    const response = yield call(apiCall);
    const filename = `${category.NAME}_soluciones_${Date.now()}.csv`;
    yield put(exportSolutionsSuccess(response));
    if (_.isNil(response) || _.isNil(response[0])) {
      yield put(message('No result record'));
    } else {
      yield csvDownload(response, filename);
    }
  } catch (err) {
    yield put(exportSolutionsFailure(err.message));
  }
  
}

export function* setHeightFailure() {
  yield put(error('Default Wall Height value must between 230 cm and 244 cm.'));
}

export function* watchSetHeightFailure() {
  yield takeLatest(SET_HEIGHT_FAILURE, setHeightFailure);
}

export function* watchExportSolutions() {
  yield takeLatest(EXPORT_SOLUTIONS, exportSolutions);
}

export default function* rootSaga() {
  yield all([
    fork(watchSetLinesLengthEndDrawing),
    fork(watchOptimizePlanner),
    fork(watchExportSolutions),
    fork(watchOptimizePlannerSuccess),
    fork(watchSetHeightFailure)
  ]);
}