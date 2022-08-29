import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IProduct } from '../model/product.model';
import { IProductBazar } from '../model/productBazar.model';

export const ACTION_TYPES = {
  GET_PRODUCTS_BY_NCM_BAZAR: 'productBazar/GET_PRODUCTS_BY_NCM_BAZAR',
  GET_PRODUCTS_BAZAR: 'productBazar/GET_PRODUCTS_BAZAR',
  GET_PRODUCT_BAZAR: 'productBazar/GET_PRODUCT_BAZAR',
  CREATE_PRODUCT_BAZAR: 'productBazar/CREATE_PRODUCT_BAZAR',
  DELETE_PRODUCT_BAZAR: 'productBazar/DELETE_PRODUCT_BAZAR',
  SET_TO_VIEW_PRODUCT_BAZAR: 'productBazar/SET_TO_VIEW_PRODUCT_BAZAR',
  UPDATE_PRODUCT_BAZAR: 'productBazar/UPDATE_PRODUCT_BAZAR',
  RESET_BAZAR: 'productBazar/RESET_BAZAR',
};

const initialState = {
  loading: false,
  getProductSuccess: false,
  getProductError: false,
  getProductsSuccess: false,
  getProductsError: false,
  getProductsByNcmSuccess: false,
  getProductsByNcmError: false,
  createProductSuccess: false,
  createProductError: false,
  updateProductSuccess: false,
  updateProductError: false,
  deleteProductSuccess: false,
  deleteProductError: false,
  productsBazar: [] as Array<IProductBazar>,
  productBazar: {} as IProductBazar,
  totalCount: 0,
  toViewProduct: {} as IProductBazar,
};

export type BazarState = Readonly<typeof initialState>;

// Reducer

export default (state: BazarState = initialState, action): BazarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PRODUCT_BAZAR):
      return {
        ...state,
        loading: true,
        getProductError: false,
        getProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.GET_PRODUCTS_BY_NCM_BAZAR):
      return {
        ...state,
        loading: true,
        getProductsByNcmSuccess: false,
        getProductsByNcmError: false,
      };
    case REQUEST(ACTION_TYPES.GET_PRODUCTS_BAZAR):
      return {
        ...state,
        loading: true,
        getProductsSuccess: false,
        getProductsError: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: true,
        createProductError: false,
        createProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: true,
        deleteProductError: false,
        deleteProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: true,
        updateProductSuccess: false,
        updateProductError: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        getProductError: true,
        getProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCTS_BY_NCM_BAZAR):
      return {
        ...state,
        loading: false,
        getProductsByNcmError: true,
        getProductsByNcmSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCTS_BAZAR):
      return {
        ...state,
        loading: false,
        getProductsError: true,
        getProductsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        createProductError: true,
        createProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        deleteProductError: true,
        deleteProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        updateProductError: true,
        updateProductSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        getProductError: false,
        getProductSuccess: true,
        productBazar: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCTS_BY_NCM_BAZAR):
      return {
        ...state,
        loading: false,
        getProductsByNcmError: false,
        getProductsByNcmSuccess: true,
        productsBazar: [...action.payload.data],
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCTS_BAZAR):
      return {
        ...state,
        loading: false,
        getProductsError: false,
        getProductsSuccess: true,
        productsBazar: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        createProductError: false,
        createProductSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        deleteProductError: false,
        deleteProductSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCT_BAZAR):
      return {
        ...state,
        loading: false,
        updateProductError: false,
        updateProductSuccess: true,
      };
    case ACTION_TYPES.SET_TO_VIEW_PRODUCT_BAZAR:
      return {
        ...state,
        toViewProduct: action.payload,
      };
    case ACTION_TYPES.RESET_BAZAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getProductsBazar = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCTS_BAZAR,
    payload: APIUrl.get(`productsBazar?skip=${skip}&take=${take}`),
  });
};

export const getProductsByNCMBazar = (ncmId: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCTS_BY_NCM_BAZAR,
    payload: APIUrl.get(`productsBazar/${ncmId}`),
  });
};

export const createProductBazar = (product: IProductBazar) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_PRODUCT_BAZAR,
    payload: APIUrl.post('productsBazar', product),
  });
};

export const updateProductBazar = (product: IProductBazar) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCT_BAZAR,
    payload: APIUrl.put('productsBazar', product),
  });
};

export const deleteProductBazar = (product_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_PRODUCT_BAZAR,
    payload: APIUrl.delete(`productsBazar/${product_id}`),
  });
  dispatch(getProductsBazar(0, 10));
};

export const setToViewProductBazar = (product: IProductBazar) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.SET_TO_VIEW_PRODUCT_BAZAR,
    payload: product,
  });
};

export const getProductByIdBazar = (id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCT_BAZAR,
    payload: APIUrl.get(`productsBazar/${id}`),
  });
};

export const resetBazar = () => ({
  type: ACTION_TYPES.RESET_BAZAR,
});