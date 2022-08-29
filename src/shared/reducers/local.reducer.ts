import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { ILocal } from '../model/local.model';

export const ACTION_TYPES = {
  GET_LOCALS: 'locals/GET_LOCALS',
  SET_LOCAL_VIEW: 'locals/SET_LOCAL_VIEW',
  CREATE_LOCAL: 'locals/CREATE_LOCAL',
  UPDATE_LOCAL: 'locals/UPDATE_DONOR',
  RESET_SUCCESS: 'locals/RESET_REGISTER',
  RESET: 'locals/RESET',
  DELETE_LOCAL: 'locals/DELETE',
};

const initialState = {
  loading: false,
  getLocalsSuccess: false,
  getLocalsError: false,
  createLocalSuccess: false,
  createLocalError: false,
  updateLocalSuccess: false,
  updateLocalError: false,
  deleteLocalSuccess: false,
  deleteLocalError: false,
  locals: [] as Array<ILocal>,
  toViewLocal: {} as ILocal,
  totalCount: 0,
};

export type LocalState = Readonly<typeof initialState>;

// Reducer

export default (state: LocalState = initialState, action): LocalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_LOCALS):
    case REQUEST(ACTION_TYPES.CREATE_LOCAL):
      return {
        ...state,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_LOCAL):
      return {
        ...state,
        loading: true,
        updateLocalError: false,
        updateLocalSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_LOCALS):
      return {
        ...initialState,
        loading: false,
        getLocalsError: true,
        getLocalsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_LOCAL):
      return {
        ...initialState,
        loading: false,
        createLocalError: true,
        createLocalSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_LOCAL):
      return {
        ...initialState,
        loading: false,
        updateLocalError: true,
        updateLocalSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_LOCAL):
      return {
        ...initialState,
        loading: false,
        deleteLocalError: true,
        deleteLocalSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_LOCALS):
      return {
        ...state,
        loading: false,
        getLocalsError: false,
        getLocalsSuccess: true,
        locals: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.CREATE_LOCAL):
      return {
        ...state,
        loading: false,
        createLocalError: false,
        createLocalSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_LOCAL):
      return {
        ...state,
        loading: false,
        updateLocalError: false,
        updateLocalSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.DELETE_LOCAL):
      return {
        ...state,
        loading: false,
        deleteLocalError: false,
        deleteLocalSuccess: true,
      };
    case ACTION_TYPES.RESET_SUCCESS:
      return {
        ...state,
        getLocalsError: false,
        getLocalsSuccess: false,
      };
    case ACTION_TYPES.SET_LOCAL_VIEW:
      return {
        ...state,
        toViewLocal: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getLocals = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_LOCALS,
    payload: APIUrl.get(`locals?skip=${skip}&take=${take}`),
  });
};

export const createLocal = (local: ILocal) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_LOCAL,
    payload: APIUrl.post('locals', local),
  });
};

export const updateLocal = (local: ILocal) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_LOCAL,
    payload: APIUrl.put('locals', local),
  });
};

export const deleteLocal = (local_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_LOCAL,
    payload: APIUrl.delete(`locals/${local_id}`),
  });
  dispatch(getLocals(0, 10));
};

export const setToViewLocal = (local: ILocal) => ({
  type: ACTION_TYPES.SET_LOCAL_VIEW,
  payload: local,
});

export const resetSuccessGetLocals = () => ({
  type: ACTION_TYPES.RESET_SUCCESS,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
