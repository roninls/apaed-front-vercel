import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IDonor } from '../model/donor.model';

export const ACTION_TYPES = {
  GET_DONOR: 'donor/GET_DONOR',
  GET_DONORS: 'donor/GET_DONORS',
  CREATE_DONOR: 'donor/CREATE_DONOR',
  SET_DONOR_VIEW: 'donor/SET_DONOR_VIEW',
  UPDATE_DONOR: 'donor/UPDATE_DONOR',
  RESET: 'donor/RESET',
  DELETE_DONOR: 'donor/DELETE_DONOR',
};

const initialState = {
  loading: false,
  getDonorSuccess: false,
  getDonorError: false,
  getDonorsSuccess: false,
  getDonorsError: false,
  createDonorSuccess: false,
  createDonorError: false,
  updateDonorSuccess: false,
  updateDonorError: false,
  deleteDonorSuccess: false,
  deleteDonorError: false,
  donors: [] as Array<IDonor>,
  donor: {} as IDonor,
  toViewDonor: {} as IDonor,
  totalCount: 0,
};

export type DonorState = Readonly<typeof initialState>;

// Reducer

export default (state: DonorState = initialState, action): DonorState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_DONOR):
      return {
        ...state,
        loading: true,
        getDonorError: false,
        getDonorSuccess: false,
      };
    case REQUEST(ACTION_TYPES.GET_DONORS):
      return {
        ...state,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DONOR):
      return {
        ...state,
        loading: true,
        createDonorSuccess: false,
        createDonorError: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_DONOR):
      return {
        ...state,
        loading: true,
        updateDonorError: false,
        updateDonorSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_DONOR):
      return {
        ...state,
        loading: true,
        deleteDonorError: false,
        deleteDonorSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_DONOR):
      return {
        ...state,
        loading: false,
        getDonorError: true,
        getDonorSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_DONORS):
      return {
        ...state,
        loading: false,
        getDonorsError: true,
        getDonorsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_DONOR):
      return {
        ...state,
        loading: false,
        createDonorError: true,
        createDonorSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_DONOR):
      return {
        ...state,
        loading: false,
        updateDonorError: true,
        updateDonorSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_DONOR):
      return {
        ...state,
        loading: false,
        deleteDonorError: true,
        deleteDonorSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_DONOR):
      return {
        ...state,
        loading: false,
        getDonorError: false,
        getDonorSuccess: true,
        donor: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_DONORS):
      return {
        ...state,
        loading: false,
        getDonorsError: false,
        getDonorsSuccess: true,
        donors: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.CREATE_DONOR):
      return {
        ...state,
        loading: false,
        createDonorError: false,
        createDonorSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DONOR):
      return {
        ...state,
        loading: false,
        updateDonorError: false,
        updateDonorSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DONOR):
      return {
        ...state,
        loading: false,
        deleteDonorError: false,
        deleteDonorSuccess: true,
      };
    case ACTION_TYPES.SET_DONOR_VIEW:
      return {
        ...state,
        toViewDonor: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getDonors = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_DONORS,
    payload: APIUrl.get(`donors?skip=${skip}&take=${take}`),
  });
};

export const getDonorByDocument = (document: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_DONOR,
    payload: APIUrl.get(`donors/${document}`),
  });
};

export const createDonor = (donor: IDonor) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_DONOR,
    payload: APIUrl.post('donors', donor),
  });
};

export const updateDonor = (donor: IDonor) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_DONOR,
    payload: APIUrl.put('donors', donor),
  });
};

export const deleteDonor = (donor_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_DONOR,
    payload: APIUrl.delete(`donors/${donor_id}`),
  });
  dispatch(getDonors(0, 10));
};

export const setToViewDonor = (donor: IDonor) => ({
  type: ACTION_TYPES.SET_DONOR_VIEW,
  payload: donor,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
