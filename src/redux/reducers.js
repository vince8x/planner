import { combineReducers } from 'redux';
import dialogReducer from './dialog/reducer';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import planner from './planner/reducer';


const reducers = combineReducers({
  menu,
  settings,
  authUser,
  planner,
  dialogReducer
});

export default reducers;
