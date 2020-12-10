import {
  defaultMenuType,
  subHiddenBreakpoint,
  menuHiddenBreakpoint,
} from '../../constants/defaultValues';
import {
  MENU_SET_CLASSNAMES,
  MENU_CONTAINER_ADD_CLASSNAME,
  MENU_CLICK_MOBILE_MENU,
  MENU_CHANGE_DEFAULT_CLASSES,
  MENU_CHANGE_HAS_SUB_ITEM_STATUS,
  TOGGLE_OPTIMIZATION_BAR,
  CLEANUP_OPTIMIZE_DATA,
  OPEN_OPTIMIZATION_BAR,
  CLOSE_OPTIMIZATION_BAR,
  POPULATE_OPTIMIZE_DATA,
  START_PROGRESS_BAR,
  STOP_PROGRESS_BAR,
} from './actions';

const INIT_STATE = {
  containerClassnames: defaultMenuType,
  subHiddenBreakpoint,
  menuHiddenBreakpoint,
  menuClickCount: 0,
  selectedMenuHasSubItems: defaultMenuType === 'menu-default', // if you use menu-sub-hidden as default menu type, set value of this variable to false
  showOptimizationBar: false,
  loading: {
    isLoading: false,
    percent: -1,
    autoIncrement: false,
  },
  status: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case MENU_CHANGE_HAS_SUB_ITEM_STATUS:
      return { ...state, selectedMenuHasSubItems: action.payload };

    case MENU_SET_CLASSNAMES:
      return {
        ...state,
        containerClassnames: action.payload.containerClassnames,
        menuClickCount: action.payload.menuClickCount,
      };

    case MENU_CLICK_MOBILE_MENU:
      return {
        ...state,
        containerClassnames: action.payload.containerClassnames,
        menuClickCount: action.payload.menuClickCount,
      };

    case MENU_CONTAINER_ADD_CLASSNAME:
      return { ...state, containerClassnames: action.payload };

    case MENU_CHANGE_DEFAULT_CLASSES:
      return { ...state, containerClassnames: action.payload };

    case TOGGLE_OPTIMIZATION_BAR:
      return { ...state, showOptimizationBar: !state.showOptimizationBar };

    case OPEN_OPTIMIZATION_BAR:
      return { ...state, showOptimizationBar: true };

    case CLOSE_OPTIMIZATION_BAR:
      return { ...state, showOptimizationBar: false };

    case START_PROGRESS_BAR:
      return {
        ...state,
        loading: {
          isLoading: true,
          percent: 0,
          autoIncrement: true,
        },
      };

    case STOP_PROGRESS_BAR:
      return {
        ...state,
        loading: {
          isLoading: false,
          percent: 100,
          autoIncrement: false,
        },
      };
    case POPULATE_OPTIMIZE_DATA:
      return { ...state, status: action.payload };
    case CLEANUP_OPTIMIZE_DATA:
      return { ...state, status: null };

    default:
      return { ...state };
  }
};
