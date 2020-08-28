import {
  createEntityAdapter,
} from '@reduxjs/toolkit'

import {
  FETCH_REMOTE_PROJECT_LIST,
  FETCH_REMOTE_PROJECT_LIST_SUCCESS,
  LOAD_REMOTE_PROJECT,
  LOAD_REMOTE_PROJECT_SUCCESS,
} from "./actions";

export const projectsAdapter = createEntityAdapter();

const initialState = {
  loading: false,
  error: '',
  ...projectsAdapter.getInitialState(),
  loadedProject: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_REMOTE_PROJECT_LIST:
      return {
        ...state,
        loading: true,
        error: '',

      };
    case FETCH_REMOTE_PROJECT_LIST_SUCCESS:
      return {
        ...state,
        ...projectsAdapter.setAll(state, action.payload),
        loading: false,
        error: ''
      };
    case LOAD_REMOTE_PROJECT:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case LOAD_REMOTE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        loadedProject: action.payload
      };
    default:
      return { ...state };
  }
};