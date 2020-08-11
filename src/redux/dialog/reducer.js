import * as _ from 'lodash';
import merge from 'deepmerge';
import { normalize } from "normalizr";
import dialogSchema from './schemas';
import * as actions from "./actions";


const initialState = {
  dialogs: {}
};

/**
 * Create dialogs state reducer
 * @param state
 * @param action
 * @return {{dialogs}|*}
 */
export default (state = initialState, action) => {

  const normalized = normalize(action, {
    dialog: dialogSchema
  }).entities;


  // Fix wrong initial state
  if (!state.dialogs)
    state = merge.all([state, initialState]);

  switch (action.type) {
    case actions.OPEN_DIALOG:
      return merge.all([state, normalized]);


    case actions.CLOSE_DIALOG:
      return merge.all([state, normalized]);


    case actions.TOGGLE_DIALOG:
      {
        const dialogName = action.dialog.name;
        const { open } = state.dialogs[dialogName];
        const result = {
          dialogs: {
            ...state.dialogs,
          }
        }
        result.dialogs[dialogName].open = !open;
        return result;
      }

    default:
      return state;
  }
};