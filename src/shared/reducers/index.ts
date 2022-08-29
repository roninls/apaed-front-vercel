import { combineReducers } from 'redux';
import authentication, { AuthenticationState } from './authentication';
import stock, { StockState } from './stock.reducer';
import bazar, { BazarState } from './productBazar.reducer';
import donor, { DonorState } from './donor.reducer';
import category, { CategoryState } from './category.reducer';
import product, { ProductState } from './product.reducer';
import donation, { DonationState } from './donation.reducer';
import transfer, { TransferState } from './transfer.reducer';
import local, { LocalState } from './local.reducer';
import type, { TypeState } from './type.reducer';
import unityMeasurement, { UnityMeasurementState } from './unityMeasurement.reducer';
import contact, { ContactState } from './contact.reducer';
import foodStamp, { FoodStampState } from './food-stamp.reducer';
import user, { UserState } from './user.reducer';

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly stock: StockState;
  readonly bazar: BazarState;
  readonly donor: DonorState;
  readonly category: CategoryState;
  readonly product: ProductState;
  readonly donation: DonationState;
  readonly transfer: TransferState;
  readonly local: LocalState;
  readonly type: TypeState;
  readonly unityMeasurement: UnityMeasurementState;
  readonly contact: ContactState;
  readonly foodStamp: FoodStampState;
  readonly user: UserState;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  stock,
  bazar,
  donor,
  category,
  product,
  donation,
  transfer,
  local,
  type,
  unityMeasurement,
  contact,
  foodStamp,
  user,
});

export default rootReducer;
