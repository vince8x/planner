/* eslint-disable no-unused-vars */
import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import plannerSagas from './planner/saga';
import projectSagas from './projects/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    plannerSagas(),
    projectSagas()
  ]);
}
