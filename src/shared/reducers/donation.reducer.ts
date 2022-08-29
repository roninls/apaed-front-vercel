import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IDonation } from '../model/donation.model';

export const ACTION_TYPES = {
  NEW_DONATION: 'DONATION/NEW_DONATION',
  GET_DONATIONS_FOR_USER: 'DONATION/GET_DONATIONS_FOR_USER',
  SET_DONATION: 'DONATION/SET_DONATION',
  RESET: 'DONATION/RESET',
};

const initialState = {
  loading: false,
  getDonationsForUserSuccess: false,
  getDonationsForUserError: false,
  NewDonationCreateSuccess: false,
  NewDonationCreateError: false,
  donationsForUser: [] as Array<IDonation>,
  selectedDonation: {} as IDonation,
};

export type DonationState = Readonly<typeof initialState>;

// Reducer

export default (state: DonationState = initialState, action): DonationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.NEW_DONATION):
    case REQUEST(ACTION_TYPES.GET_DONATIONS_FOR_USER):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.NEW_DONATION):
      return {
        ...initialState,
        loading: false,
        NewDonationCreateError: true,
        NewDonationCreateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_DONATIONS_FOR_USER):
      return {
        ...initialState,
        loading: false,
        getDonationsForUserError: true,
        getDonationsForUserSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_DONATIONS_FOR_USER):
      return {
        ...state,
        loading: false,
        getDonationsForUserSuccess: true,
        getDonationsForUserError: false,
        donationsForUser: [...action.payload.data],
      };
    case SUCCESS(ACTION_TYPES.NEW_DONATION):
      return {
        ...state,
        loading: false,
        NewDonationCreateError: false,
        NewDonationCreateSuccess: true,
      };
    case ACTION_TYPES.SET_DONATION:
      return {
        ...state,
        selectedDonation: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getDonationsForUser = (userId: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_DONATIONS_FOR_USER,
    payload: APIUrl.get(`donations/${userId}`),
  });
};

export const createNewDonation = (donation: IDonation) => async (dispatch) => {
  const response = await dispatch({
    type: ACTION_TYPES.NEW_DONATION,
    payload: APIUrl.post('donations', donation),
  });
  dispatch(setDonation(response.action.payload.data));
};

export const setDonation = (donation: IDonation) => ({
  type: ACTION_TYPES.SET_DONATION,
  payload: donation,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
