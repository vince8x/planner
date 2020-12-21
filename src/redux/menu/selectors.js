import { createSelector } from 'reselect'

const menuSelector = state => state.menu;

export const  getMenu = createSelector(
  state => state,
  menuSelector
);

export const getOptimizeData = createSelector(
  getMenu,
  menu => menu.optimizeData
);

export const isOptimized = createSelector(
  getMenu,
  menu => menu.isOptimized
);
