import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IUnityMeasurement } from '../model/unityMeasurement.model';

export const ACTION_TYPES = {
  GET_UNITS_MEASURE: 'unity_measurement/GET_UNITS_MEASURE',
  RESET: 'unity_measurement/RESET',
};

const initialState = {
  loading: false,
  getUnitsMeasureSuccess: false,
  getUnitsMeasureError: false,
  unitsMeasure: [] as Array<IUnityMeasurement>,
};

export type UnityMeasurementState = Readonly<typeof initialState>;

// Reducer

export default (state: UnityMeasurementState = initialState, action): UnityMeasurementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_UNITS_MEASURE):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_UNITS_MEASURE):
      return {
        ...initialState,
        loading: false,
        getUnitsMeasureError: true,
        getUnitsMeasureSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_UNITS_MEASURE):
      return {
        ...state,
        loading: false,
        getUnitsMeasureError: false,
        getUnitsMeasureSuccess: true,
        unitsMeasure: [...action.payload.data],
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getUnitsMeasure = () => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_UNITS_MEASURE,
    payload: APIUrl.get('units_measure'),
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
