import axios from 'axios';
import { success } from 'react-toastify-redux';
import { call, put, fork, takeLatest, all } from 'redux-saga/effects';
import {
  processOptimizeDataError,
  processOptimizeDataSuccess,
  PROCESS_OPTIMIZE_DATA,
  PROCESS_OPTIMIZE_DATA_SUCCESS,
} from './actions';

function* processOptimizeDataSaga({ payload }) {
  const { projectName, email, name, selectedPlan } = payload;

  const url = `${process.env.REACT_APP_API_ENDPOINT}/api/optimize_process_data`;
  
  const data = {
    projectName,
    email,
    name,
    selectedPlan,
  };

  const apiCall = () => {
    return axios
      .post(url, data)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  };

  try {
    const response = yield call(apiCall);
    yield put(processOptimizeDataSuccess());
  } catch (err) {
    yield put(processOptimizeDataError(err.message));
  }
}

export function* processOptimizeDataSuccessSaga() {
  yield put(success('Request accepted. The result will be sent to your email'));
}

export function* watchProcessOptimizeData() {
  yield takeLatest(PROCESS_OPTIMIZE_DATA, processOptimizeDataSaga);
}

export function* watchProcessOptimizeDataSuccess() {
  yield takeLatest(PROCESS_OPTIMIZE_DATA_SUCCESS, processOptimizeDataSuccessSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchProcessOptimizeData),
    fork(watchProcessOptimizeDataSuccess)
  ]);
}
