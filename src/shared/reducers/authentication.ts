import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IAccount } from '../model/account.model';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  RESET: 'authentication/RESET',
};

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  account: {} as IAccount,
  sessionHasBeenFetched: false,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
    case REQUEST(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.LOGIN):
      return {
        ...initialState,
        loginError: true,
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
      return {
        ...state,
        loading: false,
        loginError: false,
        loginSuccess: true,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION): {
      const isAuthenticated = action.payload && action.payload.data && action.payload.data.active;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        sessionHasBeenFetched: true,
        account: action.payload.data,
      };
    }
    case ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getSession = () => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: APIUrl.get('session'),
  });
};

export const login = (username, password) => async (dispatch) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: APIUrl.post('session', { username, password }),
  });
  const token = result.value.data.token;
  if (token) {
    const bearerToken = `Bearer ${token}`;
    APIUrl.defaults.headers.common.Authorization = bearerToken;
    localStorage.setItem('jwt_access_token_apaed', bearerToken);
  }
  await dispatch(getSession());
};

export const clearAuthToken = () => {
  localStorage.removeItem('jwt_access_token_apaed');
  delete APIUrl.defaults.headers.common.Authorization;
};

export const logout = () => (dispatch) => {
  clearAuthToken();
  dispatch({
    type: ACTION_TYPES.LOGOUT,
  });
};

export const clearAuthentication = () => (dispatch) => {
  clearAuthToken();
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH,
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
