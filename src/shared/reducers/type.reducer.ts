import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IType } from '../model/type.model';

export const ACTION_TYPES = {
  GET_TYPES: 'type/GET_TYPES',
  RESET: 'type/RESET',
};

const initialState = {
  loading: false,
  getTypesSuccess: false,
  getTypesError: false,
  types: [] as Array<IType>,
};

export type TypeState = Readonly<typeof initialState>;

// Reducer

export default (state: TypeState = initialState, action): TypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_TYPES):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_TYPES):
      return {
        ...initialState,
        loading: false,
        getTypesError: true,
        getTypesSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_TYPES):
      return {
        ...state,
        loading: false,
        getTypesError: false,
        getTypesSuccess: true,
        types: [...action.payload.data],
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getTypes = () => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_TYPES,
    payload: APIUrl.get('types'),
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
