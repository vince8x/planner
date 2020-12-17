import { createSelector } from 'reselect'
import { projectsAdapter } from './reducer';

const projectsSelector = state => state.projects;

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = projectsAdapter.getSelectors();

export const getAllProjects = createSelector(
  projectsSelector,
  selectAll
);

export const getProjectsEntities = createSelector(
  projectsSelector,
  selectEntities
);

export const getProjectsTotal = createSelector(
  projectsSelector,
  selectTotal
);

export const getProjectsIds = createSelector(
  projectsSelector,
  selectIds
);

export const getCurrentProject = createSelector(
  projectsSelector,
  project => project.get('loadedProject')
);