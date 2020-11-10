
import {
  MODE_IDLE,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  MODE_SNAPPING,
  KEYBOARD_BUTTON_CODE,
  MODE_DRAWING_LINE
} from '../constants';

import {
  rollback,
  undo,
  remove,
  toggleSnap,
  copyProperties,
  pasteProperties,
  setAlterateState
} from '../actions/project-actions';

import { openDialog } from '../../redux/actions';

export default function keyboard() {

  return (store, stateExtractor) => {

    window.addEventListener('keydown', event => {

      const state = stateExtractor(store.getState().planner);
      const mode = state.get('mode');

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.BACKSPACE:
        case KEYBOARD_BUTTON_CODE.DELETE:
          {
            if ([MODE_IDLE, MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode))
              store.dispatch(remove());
            break;
          }
        case KEYBOARD_BUTTON_CODE.ESC:
          {
            if (![MODE_IDLE].includes(mode))
              store.dispatch(rollback());
              
            break;
          }
        case KEYBOARD_BUTTON_CODE.Z:
          {
            if (event.getModifierState('Control') || event.getModifierState('Meta'))
              store.dispatch(undo());
            break;
          }
        case KEYBOARD_BUTTON_CODE.ALT:
          {
            if (MODE_SNAPPING.includes(mode))
              store.dispatch(toggleSnap(state.snapMask.merge({
                SNAP_POINT: false,
                SNAP_LINE: false,
                SNAP_SEGMENT: false,
                SNAP_GRID: false,
                SNAP_GUIDE: false,
                tempSnapConfiguartion: state.snapMask.toJS()
              })));
            break;
          }
        case KEYBOARD_BUTTON_CODE.C:
          {
            const selectedLayer = state.getIn(['scene', 'selectedLayer']);
            const selected = state.getIn(['scene', 'layers', selectedLayer, 'selected']);

            if ((mode === MODE_IDLE || mode === MODE_3D_VIEW) && (selected.holes.size || selected.areas.size || selected.items.size || selected.lines.size)) {
              if (selected.holes.size) {
                const hole = state.getIn(['scene', 'layers', selectedLayer, 'holes', selected.holes.get(0)]);
                store.dispatch(copyProperties(hole.get('properties')));
              }
              else if (selected.areas.size) {
                const area = state.getIn(['scene', 'layers', selectedLayer, 'areas', selected.areas.get(0)]);
                store.dispatch(copyProperties(area.properties));
              }
              else if (selected.items.size) {
                const item = state.getIn(['scene', 'layers', selectedLayer, 'items', selected.items.get(0)]);
                store.dispatch(copyProperties(item.properties));
              }
              else if (selected.lines.size) {
                const line = state.getIn(['scene', 'layers', selectedLayer, 'lines', selected.lines.get(0)]);
                store.dispatch(copyProperties(line.properties));
              }
            }
            break;
          }
        case KEYBOARD_BUTTON_CODE.V:
          {
            store.dispatch(pasteProperties());
            break;
          }
        case KEYBOARD_BUTTON_CODE.CTRL:
          {
            store.dispatch(setAlterateState());
            break;
          }
        default:
          break;
      }

    });

    window.addEventListener('keyup', event => {

      const state = stateExtractor(store.getState().planner);
      const mode = state.get('mode');

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.ALT:
          {
            if (MODE_SNAPPING.includes(mode))
              store.dispatch(toggleSnap(state.snapMask.merge(state.snapMask.get('tempSnapConfiguartion'))));
            break;
          }
        case KEYBOARD_BUTTON_CODE.CTRL:
          {
            store.dispatch(setAlterateState());
            break;
          }
        case KEYBOARD_BUTTON_CODE.DIGIT_0:
        case KEYBOARD_BUTTON_CODE.DIGIT_1:
        case KEYBOARD_BUTTON_CODE.DIGIT_2:
        case KEYBOARD_BUTTON_CODE.DIGIT_3:
        case KEYBOARD_BUTTON_CODE.DIGIT_4:
        case KEYBOARD_BUTTON_CODE.DIGIT_5:
        case KEYBOARD_BUTTON_CODE.DIGIT_6:
        case KEYBOARD_BUTTON_CODE.DIGIT_7:
        case KEYBOARD_BUTTON_CODE.DIGIT_8:
        case KEYBOARD_BUTTON_CODE.DIGIT_9:
        case KEYBOARD_BUTTON_CODE.NUMPAD_0:
        case KEYBOARD_BUTTON_CODE.NUMPAD_1:
        case KEYBOARD_BUTTON_CODE.NUMPAD_2:
        case KEYBOARD_BUTTON_CODE.NUMPAD_3:
        case KEYBOARD_BUTTON_CODE.NUMPAD_4:
        case KEYBOARD_BUTTON_CODE.NUMPAD_5:
        case KEYBOARD_BUTTON_CODE.NUMPAD_6:
        case KEYBOARD_BUTTON_CODE.NUMPAD_7:
        case KEYBOARD_BUTTON_CODE.NUMPAD_8:
        case KEYBOARD_BUTTON_CODE.NUMPAD_9:
        case KEYBOARD_BUTTON_CODE.DOT:
          {
            if (mode !== MODE_DRAWING_LINE)
              return;
              
            let num = '';
            if (event.keyCode >= KEYBOARD_BUTTON_CODE.DIGIT_0 && event.keyCode <= KEYBOARD_BUTTON_CODE.DIGIT_9) {
              num = event.keyCode -48;
            } else if (event.keyCode >= 96 && event.keyCode <= 105) {
              num = event.keyCode - 96;
            }
            store.dispatch(openDialog('lengthInputDialog', {length: num}))
            break;
          }
        default:
          break;
      }

    });

  }
}
