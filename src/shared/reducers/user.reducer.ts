import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IUser } from '../model/user.model';
import { IRole } from '../model/role.model';

export const ACTION_TYPES = {
  CREATE_USER: 'user/CREATE_USER',
  GET_USER: 'user/GET_USER',
  GET_USERS: 'user/GET_USERS',
  UPDATE_USER: 'user/UPDATE_USER',
  GET_ROLES: 'user/GET_ROLES',
  SET_USER_VIEW: 'user/SET_USER_VIEW',
  DELETE_USER: 'user/DELETE_USER',
  RESET: 'user/RESET',
};

const initialState = {
  loading: false,
  createUserSuccess: false,
  createUserError: false,
  updateUserSuccess: false,
  updateUserError: false,
  getUsersSuccess: false,
  getUsersError: false,
  deleteUserSuccess: false,
  deleteUserError: false,
  user: {} as IUser,
  users: [] as IUser[],
  toViewUser: {} as IUser,
  roles: [] as IRole[],
  totalCount: 0,
  errorMessage: '',
};

export type UserState = Readonly<typeof initialState>;

// Reducer

export default (state: UserState = initialState, action): UserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CREATE_USER):
      return {
        ...state,
        loading: true,
        createUserError: false,
        createUserSuccess: false,
        errorMessage: '',
      };
    case REQUEST(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        loading: true,
        updateUserError: false,
        updateUserSuccess: false,
        errorMessage: '',
      };
    case REQUEST(ACTION_TYPES.GET_ROLES):
      return {
        ...state,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        loading: true,
        getUsersError: false,
        getUsersSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_USER):
      return {
        ...state,
        loading: true,
        deleteUserError: false,
        deleteUserSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_USER):
      return {
        ...state,
        loading: false,
        createUserError: true,
        createUserSuccess: false,
        errorMessage: action.payload.response.data.error,
      };
    case FAILURE(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        loading: false,
        updateUserError: true,
        updateUserSuccess: false,
        errorMessage: action.payload.response.data.error,
      };
    case FAILURE(ACTION_TYPES.GET_ROLES):
      return {
        ...state,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        loading: false,
        getUsersError: true,
        getUsersSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_USER):
      return {
        ...state,
        loading: false,
        deleteUserError: true,
        deleteUserSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_USER):
      return {
        ...state,
        loading: false,
        toViewUser: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_USER):
      return {
        ...state,
        loading: false,
        createUserError: false,
        createUserSuccess: true,
        errorMessage: '',
      };
    case SUCCESS(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        loading: false,
        updateUserError: false,
        updateUserSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.GET_ROLES):
      return {
        ...state,
        loading: false,
        roles: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        loading: false,
        getUsersError: false,
        getUsersSuccess: true,
        users: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.DELETE_USER):
      return {
        ...state,
        loading: false,
        deleteUserError: false,
        deleteUserSuccess: true,
      };
    case ACTION_TYPES.SET_USER_VIEW:
      return {
        ...state,
        toViewUser: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getUsers = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_USERS,
    payload: APIUrl.get(`users?skip=${skip}&take=${take}`),
  });
};

export const getRoles = () => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_ROLES,
    payload: APIUrl.get(`roles`),
  });
};

export const createUser = (user: IUser) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_USER,
    payload: APIUrl.post('users', user),
  });
};

export const updateUser = (user: IUser) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_USER,
    payload: APIUrl.put('users', user),
  });
};

export const getUserById = (userId: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_USER,
    payload: APIUrl.get(`users/${userId}`),
  });
};

export const deleteUser = (user_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_USER,
    payload: APIUrl.delete(`users/${user_id}`),
  });
  dispatch(getUsers(0, 10));
};

export const setToViewUser = (user: IUser) => ({
  type: ACTION_TYPES.SET_USER_VIEW,
  payload: user,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
