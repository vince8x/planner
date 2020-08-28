const localStorage = window.hasOwnProperty('localStorage') ? window.localStorage : false;

const TIMEOUT_DELAY = 500;

let timeout = null;

export default function autosave(autosaveKey, delay) {

  return (store, stateExtractor) => {

    const timeoutDelay = delay || TIMEOUT_DELAY;

    if (!autosaveKey) return;
    if (!localStorage) return;

    // update
    store.subscribe(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const plannerState = stateExtractor(store.getState().planner);
        localStorage.setItem(autosaveKey, JSON.stringify(plannerState.scene.toJS()));
      }, timeoutDelay);
    });
  };
}
