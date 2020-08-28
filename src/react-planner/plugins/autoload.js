import { loadProject } from '../actions/project-actions';

const localStorage = window.hasOwnProperty('localStorage') ? window.localStorage : false;

export default function autoload(autosaveKey) {

  return (store) => {

    if (!autosaveKey) return;
    if (!localStorage) return;

    if (localStorage.getItem(autosaveKey) !== null) {
      const data = localStorage.getItem(autosaveKey);
      const json = JSON.parse(data);
      store.dispatch(loadProject(json));
    }
  };
}
