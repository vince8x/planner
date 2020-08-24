/* SETTINGS */
import { setCurrentLanguage } from '../../helpers/Utils';

export const CHANGE_LOCALE = 'CHANGE_LOCALE';

export const changeLocale = (locale) => {
  setCurrentLanguage(locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
};
