/* AUTH */
export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_ERROR = 'UPDATE_USER_PROFILE_ERROR';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'GET_USER_PROFILE';
export const GET_USER_PROFILE_ERROR = 'GET_USER_PROFILE';

export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: { user, history },
});
export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});
export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const forgotPassword = (forgotUserMail, history) => ({
  type: FORGOT_PASSWORD,
  payload: { forgotUserMail, history },
});
export const forgotPasswordSuccess = (forgotUserMail) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: forgotUserMail,
});
export const forgotPasswordError = (message) => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: { message },
});

export const resetPassword = ({ resetPasswordCode, newPassword, history }) => ({
  type: RESET_PASSWORD,
  payload: { resetPasswordCode, newPassword, history },
});
export const resetPasswordSuccess = (newPassword) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: newPassword,
});
export const resetPasswordError = (message) => ({
  type: RESET_PASSWORD_ERROR,
  payload: { message },
});

export const registerUser = (user, history) => ({
  type: REGISTER_USER,
  payload: { user, history },
});
export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});
export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const updateUserProfile = (user) => ({
  type: UPDATE_USER_PROFILE,
  payload: user
});

export const updateUserProfileSuccess = () => ({
  type: UPDATE_USER_PROFILE_SUCCESS
});

export const updateUserProfileError = (message) => ({
  type: UPDATE_USER_PROFILE_ERROR,
  payload: { message }
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const getUserProfile = () => ({
  type: GET_USER_PROFILE,
});

export const getUserProfileSuccess = (userProfile) => ({
  type: GET_USER_PROFILE_SUCCESS,
  payload: { user: userProfile }
});

export const getUserProfileError = (message) => ({
  type: GET_USER_PROFILE_ERROR,
  payload: { message }
});
