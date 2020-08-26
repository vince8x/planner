import { 
  FETCH_REMOTE_PROJECT_LIST, 
  FETCH_REMOTE_PROJECT_LIST_SUCCESS 
} from "./actions";

const INIT_STATE = {
  loading: false,
  error: '',
  projects: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_REMOTE_PROJECT_LIST:
      return { 
        ...state, 
        loading: true,
        error: '' 
      };
    case FETCH_REMOTE_PROJECT_LIST_SUCCESS:
      return {
        ...state,
        projects: action.payload.projects
      };
    default:
      return { ...state };
  }
};