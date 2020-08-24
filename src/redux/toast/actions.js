/**
 * Show toast action
 * @type {string}
 */
export const SHOW_TOAST = 'SHOW_TOAST';

/**
 * Open a modal
 * @param {string} name Name of the modal to open
 * @param {Object} [data] Data to send to the modal
 * @return {{dialog: {data: *, name: *, open: boolean}, type: string}}
 */
export function showToast(message) {
  return {
    type: SHOW_TOAST,
    message
  };
}