import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IStock, IProductLocalDonationGet, IProductLocalDonationPostPut } from '../model/productLocalDonation.model';
import { IProduct } from '../model/product.model';

export const ACTION_TYPES = {
  GET_STOCK: 'stock/GET_STOCK',
  GET_STOCK_BY_FOODSTAMP_ID: 'stock/GET_STOCK_BY_FOODSTAMP_ID',
  EDIT_PRODUCT: 'stock/EDIT_PRODUCT',
  REGISTER_NEW_PRODUCT_TO_STOCK: 'stock/REGISTER_NEW_PRODUCT_TO_STOCK',
  RESET_REGISTER: 'stock/RESET_REGISTER',
  RESET: 'stock/RESET',
  SET_TO_VIEW_PRODUCT: 'product/SET_TO_VIEW_PRODUCT',
  UPDATE_PRODUCT_LOCAL_DONATION: 'stock/UPDATE_PRODUCT_LOCAL_DONATION',
};

const initialState = {
  loading: false,
  stockByFoodStampIdSuccess: false,
  stockByFoodStampIdError: false,
  getStockSuccess: false,
  getStockError: false,
  registerNewProductToStockSuccess: false,
  registerNewProductToStockError: false,
  stock: [] as Array<IStock>,
  stockByFoodStampId: [] as Array<any>,
  toEditProduct: {} as IStock,
  totalCount: 0,
  totalCountByFoodStampId: 0,
  updateStockSuccess: false,
  updateStockError: false,
  toViewProduct: {} as IProduct,
};

export type StockState = Readonly<typeof initialState>;

// Reducer

export default (state: StockState = initialState, action): StockState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_STOCK):
    case REQUEST(ACTION_TYPES.GET_STOCK_BY_FOODSTAMP_ID):
    case REQUEST(ACTION_TYPES.REGISTER_NEW_PRODUCT_TO_STOCK):
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCT_LOCAL_DONATION):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_STOCK):
      return {
        ...initialState,
        loading: false,
        getStockError: true,
        getStockSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_STOCK_BY_FOODSTAMP_ID):
      return {
        ...initialState,
        loading: false,
        stockByFoodStampIdError: true,
        stockByFoodStampIdSuccess: false,
      };
    case FAILURE(ACTION_TYPES.REGISTER_NEW_PRODUCT_TO_STOCK):
      return {
        ...initialState,
        loading: false,
        registerNewProductToStockError: true,
        registerNewProductToStockSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCT_LOCAL_DONATION):
      return {
        ...state,
        loading: false,
        updateStockSuccess: false,
        updateStockError: true,
      };
    case SUCCESS(ACTION_TYPES.REGISTER_NEW_PRODUCT_TO_STOCK):
      return {
        ...state,
        loading: false,
        registerNewProductToStockError: false,
        registerNewProductToStockSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.GET_STOCK):
      return {
        ...state,
        loading: false,
        getStockError: false,
        getStockSuccess: true,
        stock: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.GET_STOCK_BY_FOODSTAMP_ID):
      return {
        ...state,
        loading: false,
        stockByFoodStampIdError: false,
        stockByFoodStampIdSuccess: true,
        stockByFoodStampId: [...action.payload.data[0]],
        totalCountByFoodStampId: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCT_LOCAL_DONATION):
      return {
        ...state,
        loading: false,
        updateStockSuccess: true,
        updateStockError: false,
      };
    case ACTION_TYPES.EDIT_PRODUCT:
      return {
        ...state,
        toEditProduct: action.payload,
      };
    case ACTION_TYPES.SET_TO_VIEW_PRODUCT:
      return {
        ...state,
        toViewProduct: action.payload,
      };
    case ACTION_TYPES.RESET_REGISTER:
      return {
        ...state,
        registerNewProductToStockSuccess: false,
        registerNewProductToStockError: false,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getStock = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_STOCK,
    payload: APIUrl.get(`stock?skip=${skip}&take=${take}`),
  });
};

export const setToViewProduct = (product: IProduct) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.SET_TO_VIEW_PRODUCT,
    payload: product,
  });
};

export const getStockByFoodStampId = (id: string, skip: number, take: number) => async (dispatch) => {
  console.log(id);
  await dispatch({
    type: ACTION_TYPES.GET_STOCK_BY_FOODSTAMP_ID,
    payload: APIUrl.get(`stock/foodStamp/${id}?skip=${skip}&take=${take}`),
  });
};

export const registerNewProductToStock = (product: IProductLocalDonationPostPut) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.REGISTER_NEW_PRODUCT_TO_STOCK,
    payload: APIUrl.post('stock', product),
  });
};

export const setProductToEdit = (product: IStock) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.EDIT_PRODUCT,
    payload: product,
  });
};

export const updateProduct = (foodStampId: string, product: IStock) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCT_LOCAL_DONATION,
    payload: APIUrl.put('stock', product),
  });
  dispatch(getStockByFoodStampId(foodStampId, 0, 10));
};

export const resetSuccessRegister = () => ({
  type: ACTION_TYPES.RESET_REGISTER,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
