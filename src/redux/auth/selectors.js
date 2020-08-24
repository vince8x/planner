import { createSelector } from 'reselect'

const getUserProfileReducerState = state => state.authUser;

export const getUserProfileState = createSelector(
  state => state,
  getUserProfileReducerState
);

export const getUserId = createSelector(
  getUserProfileState,
  state => state.user
);