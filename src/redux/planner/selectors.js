import { createSelector } from 'reselect'

const plannerSelector = state => state.planner;

export const  getPlanner = createSelector(
  state => state,
  plannerSelector
);

export const getPlannerState = createSelector(
  getPlanner,
  planner => planner.get('react-planner')
);
