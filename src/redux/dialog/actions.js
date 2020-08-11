/**
 * Open action
 * @type {string}
 */
export const OPEN_DIALOG = 'OPEN_DIALOG';
/**
 * Close action
 * @type {string}
 */
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
/**
 * Toggle action
 * @type {string}
 */
export const TOGGLE_DIALOG = 'TOGGLE_DIALOG';

/**
 * Open a modal
 * @param {string} name Name of the modal to open
 * @param {Object} [data] Data to send to the modal
 * @return {{dialog: {data: *, name: *, open: boolean}, type: string}}
 */
export function openDialog(name, data = undefined) {
  return {
    type: OPEN_DIALOG,
    dialog: {
      name,
      open: true,
      data
    }
  };
}


/**
 * Toggle a modal
 * @param name Name of the modal to toggle
 * @return {{dialog: {name: string}, type: string}}
 */
export const toggleDialog = (name) => {
  return {
    type: TOGGLE_DIALOG,
    dialog: {
      name,
    }
  };
};

/**
 * Close a modal
 * @param {string} name Name of the modal to close
 * @return {{dialog: {name: string, open: boolean}, type: string}}
 */
export function closeDialog(name) {
  return {
    type: CLOSE_DIALOG,
    dialog: {
      name,
      open: false
    }
  };
}