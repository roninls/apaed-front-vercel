import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { IProduct } from '../model/product.model';

export const ACTION_TYPES = {
  GET_PRODUCTS_BY_NCM: 'product/GET_PRODUCTS_BY_NCM',
  GET_PRODUCTS: 'product/GET_PRODUCTS',
  GET_PRODUCT: 'product/GET_PRODUCT',
  CREATE_PRODUCT: 'product/CREATE_PRODUCT',
  DELETE_PRODUCT: 'product/DELETE_PRODUCT',
  SET_TO_VIEW_PRODUCT: 'product/SET_TO_VIEW_PRODUCT',
  UPDATE_PRODUCT: 'product/UPDATE_PRODUCT',
  RESET: 'product/RESET',
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
  products: [] as Array<IProduct>,
  product: {} as IProduct,
  totalCount: 0,
  toViewProduct: {} as IProduct,
};

export type ProductState = Readonly<typeof initialState>;

// Reducer

export default (state: ProductState = initialState, action): ProductState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PRODUCT):
      return {
        ...state,
        loading: true,
        getProductError: false,
        getProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.GET_PRODUCTS_BY_NCM):
      return {
        ...state,
        loading: true,
        getProductsByNcmSuccess: false,
        getProductsByNcmError: false,
      };
    case REQUEST(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...state,
        loading: true,
        getProductsSuccess: false,
        getProductsError: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...state,
        loading: true,
        createProductError: false,
        createProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_PRODUCT):
      return {
        ...state,
        loading: true,
        deleteProductError: false,
        deleteProductSuccess: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCT):
      return {
        ...state,
        loading: true,
        updateProductSuccess: false,
        updateProductError: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCT):
      return {
        ...state,
        loading: false,
        getProductError: true,
        getProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCTS_BY_NCM):
      return {
        ...state,
        loading: false,
        getProductsByNcmError: true,
        getProductsByNcmSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...state,
        loading: false,
        getProductsError: true,
        getProductsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...state,
        loading: false,
        createProductError: true,
        createProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_PRODUCT):
      return {
        ...state,
        loading: false,
        deleteProductError: true,
        deleteProductSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCT):
      return {
        ...state,
        loading: false,
        updateProductError: true,
        updateProductSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCT):
      return {
        ...state,
        loading: false,
        getProductError: false,
        getProductSuccess: true,
        product: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCTS_BY_NCM):
      return {
        ...state,
        loading: false,
        getProductsByNcmError: false,
        getProductsByNcmSuccess: true,
        products: [...action.payload.data],
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...state,
        loading: false,
        getProductsError: false,
        getProductsSuccess: true,
        products: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...state,
        loading: false,
        createProductError: false,
        createProductSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PRODUCT):
      return {
        ...state,
        loading: false,
        deleteProductError: false,
        deleteProductSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCT):
      return {
        ...state,
        loading: false,
        updateProductError: false,
        updateProductSuccess: true,
      };
    case ACTION_TYPES.SET_TO_VIEW_PRODUCT:
      return {
        ...state,
        toViewProduct: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getProducts = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCTS,
    payload: APIUrl.get(`products?skip=${skip}&take=${take}`),
  });
};

export const getProductsByNCM = (ncmId: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCTS_BY_NCM,
    payload: APIUrl.get(`products/${ncmId}`),
  });
};

export const createProduct = (product: IProduct) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_PRODUCT,
    payload: APIUrl.post('products', product),
  });
};

export const updateProduct = (product: IProduct) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCT,
    payload: APIUrl.put('products', product),
  });
};

export const deleteProduct = (product_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_PRODUCT,
    payload: APIUrl.delete(`products/${product_id}`),
  });
  dispatch(getProducts(0, 10));
};

export const setToViewProduct = (product: IProduct) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.SET_TO_VIEW_PRODUCT,
    payload: product,
  });
};

export const getProductById = (id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCT,
    payload: APIUrl.get(`products/${id}`),
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});