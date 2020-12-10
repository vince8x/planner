/* MENU */
export const MENU_SET_CLASSNAMES = 'MENU_SET_CLASSNAMES';
export const MENU_CONTAINER_ADD_CLASSNAME = 'MENU_CONTAINER_ADD_CLASSNAME';
export const MENU_CLICK_MOBILE_MENU = 'MENU_CLICK_MOBILE_MENU';
export const MENU_CHANGE_DEFAULT_CLASSES = 'MENU_CHANGE_DEFAULT_CLASSES';
export const MENU_CHANGE_HAS_SUB_ITEM_STATUS =
  'MENU_CHANGE_HAS_SUB_ITEM_STATUS';
export const TOGGLE_OPTIMIZATION_BAR = 'TOGGLE_OPTIMIZATION_BAR';
export const OPEN_OPTIMIZATION_BAR = 'OPEN_OPTIMIZATION_BAR';
export const CLOSE_OPTIMIZATION_BAR = 'CLOSE_OPTIMIZATION_BAR';

export const START_PROGRESS_BAR = 'START_PROGRESS_BAR';
export const STOP_PROGRESS_BAR = 'STOP_PROGRESS_BAR';
export const CLEANUP_OPTIMIZE_DATA = 'CLEANUP_OPTIMIZE_DATA';
export const POPULATE_OPTIMIZE_DATA = 'POPULATE_OPTIMIZE_DATA';

export const changeSelectedMenuHasSubItems = (payload) => {
  return {
    type: MENU_CHANGE_HAS_SUB_ITEM_STATUS,
    payload,
  };
};

export const changeDefaultClassnames = (strCurrentClasses) => {
  return {
    type: MENU_CHANGE_DEFAULT_CLASSES,
    payload: strCurrentClasses,
  };
};

export const addContainerClassname = (classname, strCurrentClasses) => {
  const newClasses =
    !strCurrentClasses.indexOf(classname) > -1
      ? `${strCurrentClasses} ${classname}`
      : strCurrentClasses;
  return {
    type: MENU_CONTAINER_ADD_CLASSNAME,
    payload: newClasses,
  };
};

export const clickOnMobileMenu = (strCurrentClasses) => {
  const currentClasses = strCurrentClasses
    ? strCurrentClasses
        .split(' ')
        .filter((x) => x !== '' && x !== 'sub-show-temporary')
    : '';
  let nextClasses = '';
  if (currentClasses.includes('main-show-temporary')) {
    nextClasses = currentClasses
      .filter((x) => x !== 'main-show-temporary')
      .join(' ');
  } else {
    nextClasses = `${currentClasses.join(' ')} main-show-temporary`;
  }
  return {
    type: MENU_CLICK_MOBILE_MENU,
    payload: { containerClassnames: nextClasses, menuClickCount: 0 },
  };
};

export const setContainerClassnames = (
  clickIndex,
  strCurrentClasses,
  selectedMenuHasSubItems
) => {
  const currentClasses = strCurrentClasses
    ? strCurrentClasses.split(' ').filter((x) => x !== '')
    : '';
  let nextClasses = '';
  if (!selectedMenuHasSubItems) {
    if (
      currentClasses.includes('menu-default') &&
      (clickIndex % 4 === 0 || clickIndex % 4 === 3)
    ) {
      clickIndex = 1;
    }
    if (currentClasses.includes('menu-sub-hidden') && clickIndex % 4 === 2) {
      clickIndex = 0;
    }
    if (
      currentClasses.includes('menu-hidden') &&
      (clickIndex % 4 === 2 || clickIndex % 4 === 3)
    ) {
      clickIndex = 0;
    }
  }

  if (clickIndex % 4 === 0) {
    if (
      currentClasses.includes('menu-default') &&
      currentClasses.includes('menu-sub-hidden')
    ) {
      nextClasses = 'menu-default menu-sub-hidden';
    } else if (currentClasses.includes('menu-default')) {
      nextClasses = 'menu-default';
    } else if (currentClasses.includes('menu-sub-hidden')) {
      nextClasses = 'menu-sub-hidden';
    } else if (currentClasses.includes('menu-hidden')) {
      nextClasses = 'menu-hidden';
    }
    clickIndex = 0;
  } else if (clickIndex % 4 === 1) {
    if (
      currentClasses.includes('menu-default') &&
      currentClasses.includes('menu-sub-hidden')
    ) {
      nextClasses = 'menu-default menu-sub-hidden main-hidden sub-hidden';
    } else if (currentClasses.includes('menu-default')) {
      nextClasses = 'menu-default sub-hidden';
    } else if (currentClasses.includes('menu-sub-hidden')) {
      nextClasses = 'menu-sub-hidden main-hidden sub-hidden';
    } else if (currentClasses.includes('menu-hidden')) {
      nextClasses = 'menu-hidden main-show-temporary';
    }
  } else if (clickIndex % 4 === 2) {
    if (
      currentClasses.includes('menu-default') &&
      currentClasses.includes('menu-sub-hidden')
    ) {
      nextClasses = 'menu-default menu-sub-hidden sub-hidden';
    } else if (currentClasses.includes('menu-default')) {
      nextClasses = 'menu-default main-hidden sub-hidden';
    } else if (currentClasses.includes('menu-sub-hidden')) {
      nextClasses = 'menu-sub-hidden sub-hidden';
    } else if (currentClasses.includes('menu-hidden')) {
      nextClasses = 'menu-hidden main-show-temporary sub-show-temporary';
    }
  } else if (clickIndex % 4 === 3) {
    if (
      currentClasses.includes('menu-default') &&
      currentClasses.includes('menu-sub-hidden')
    ) {
      nextClasses = 'menu-default menu-sub-hidden sub-show-temporary';
    } else if (currentClasses.includes('menu-default')) {
      nextClasses = 'menu-default sub-hidden';
    } else if (currentClasses.includes('menu-sub-hidden')) {
      nextClasses = 'menu-sub-hidden sub-show-temporary';
    } else if (currentClasses.includes('menu-hidden')) {
      nextClasses = 'menu-hidden main-show-temporary';
    }
  }
  if (currentClasses.includes('menu-mobile')) {
    nextClasses += ' menu-mobile';
  }
  return {
    type: MENU_SET_CLASSNAMES,
    payload: { containerClassnames: nextClasses, menuClickCount: clickIndex },
  };
};

export const toggleOptimizationBar = () => ({
  type: TOGGLE_OPTIMIZATION_BAR,
});

export const openOptimizationBar = () => ({
  type: OPEN_OPTIMIZATION_BAR,
});

export const closeOptimizationBar = () => ({
  type: CLOSE_OPTIMIZATION_BAR,
});

export const startProgressBar = () => ({
  type: START_PROGRESS_BAR
});

export const stopProgressBar = () => ({
  type: STOP_PROGRESS_BAR
});

export const cleanupOptimizeData = () => ({
  type: CLEANUP_OPTIMIZE_DATA
});

export const populateOptimizeData = (status) => ({
  type: POPULATE_OPTIMIZE_DATA,
  payload: status
});
