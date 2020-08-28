import {
  createEntityAdapter,
} from '@reduxjs/toolkit'

import {
  FETCH_REMOTE_PROJECT_LIST,
  FETCH_REMOTE_PROJECT_LIST_SUCCESS,
  LOAD_REMOTE_PROJECT,
  LOAD_REMOTE_PROJECT_SUCCESS,
  SAVE_REMOTE_PROJECT_SUCCESS,
  ADD_REMOTE_PROJECT_SUCCESS,
  DELETE_REMOTE_PROJECTS,
  DELETE_REMOTE_PROJECTS_ERROR,
  DELETE_REMOTE_PROJECTS_SUCCESS
} from "./actions";
import { NEW_PROJECT } from '../../react-planner/constants';

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
    case SAVE_REMOTE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        loadedProject: action.payload
      };
    case ADD_REMOTE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        loadedProject: action.payload
      };
    case NEW_PROJECT:
      return {
        ...state,
        loading: false,
        error: '',
        loadedProject: null
      };
    case DELETE_REMOTE_PROJECTS:
      return {
        ...state,
        loading: true,
      };
    case DELETE_REMOTE_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        ...projectsAdapter.removeMany(state, action.payload)
      };
    case DELETE_REMOTE_PROJECTS_ERROR:
      return {
        ...state,
        loading: false
      };
    default:
      return { ...state };
  }
};