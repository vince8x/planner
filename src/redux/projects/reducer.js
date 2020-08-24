
const INIT_STATE = {
  projectId: '',
  projectName: '',
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case LOGIN_USER:
        return { ...state, loading: true, error: '' };
      case LOGIN_USER_SUCCESS:
        return { 
          ...state, 
          loading: false, 
          user: action.payload.uid, 
          error: '',
          email: action.payload.email,
          displayName: action.payload.displayName,
  
        };
      case LOGIN_USER_ERROR:
        return {
          ...state,
          loading: false,
          user: '',
          error: action.payload.message,
        };
      case FORGOT_PASSWORD:
        return { ...state, loading: true, error: '' };
      case FORGOT_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          forgotUserMail: action.payload,
          error: '',
        };
      case FORGOT_PASSWORD_ERROR:
        return {
          ...state,
          loading: false,
          forgotUserMail: '',
          error: action.payload.message,
        };
      case RESET_PASSWORD:
        return { ...state, loading: true, error: '' };
      case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          newPassword: action.payload,
          resetPasswordCode: '',
          error: '',
        };
      case RESET_PASSWORD_ERROR:
        return {
          ...state,
          loading: false,
          newPassword: '',
          resetPasswordCode: '',
          error: action.payload.message,
        };
      case REGISTER_USER:
        return { ...state, loading: true, error: '' };
      case REGISTER_USER_SUCCESS:
        return { ...state, loading: false, user: action.payload.uid, error: '' };
      case REGISTER_USER_ERROR:
        return {
          ...state,
          loading: false,
          user: '',
          error: action.payload.message,
        };
      case LOGOUT_USER:
        return { ...state, user: null, error: '' };
      case UPDATE_USER_PROFILE_SUCCESS:
        return { 
          ...state, 
          loading: false, 
          user: action.payload.uid, 
          error: '',
          email: action.payload.email,
          displayName: action.payload.displayName,
        };
      default:
        return { ...state };
    }
  };