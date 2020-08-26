import { combineReducers } from 'redux';
import {toastsReducer as toasts} from 'react-toastify-redux';
import dialogReducer from './dialog/reducer';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import planner from './planner/reducer';
import projects from './projects/reducer';



const reducers = combineReducers({
  menu,
  settings,
  authUser,
  planner,
  dialogReducer,
  toasts,

});

export default reducers;
