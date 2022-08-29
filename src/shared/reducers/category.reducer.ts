import { FAILURE, REQUEST, SUCCESS } from './action-type.util';
import APIUrl from '../../config/api';
import { ICategory } from '../model/category.model';

export const ACTION_TYPES = {
  GET_CATEGORIES: 'category/GET_CATEGORIES',
  GET_CATEGORY: 'category/GET_CATEGORY',
  CREATE_CATEGORY: 'category/CREATE_CATEGORY',
  DELETE_CATEGORY: 'category/DELETE_CATEGORY',
  SET_CATEGORY_VIEW: 'category/SET_CATEGORY_VIEW',
  UPDATE_CATEGORY: 'category/UPDATE_CATEGORY',
  RESET: 'category/RESET',
};

const initialState = {
  loading: false,
  getCategorySuccess: false,
  getCategoryError: false,
  getCategoriesSuccess: false,
  getCategoriesError: false,
  createCategorySuccess: false,
  createCategoryError: false,
  deleteCategorySuccess: false,
  deleteCategoryError: false,
  updateCategorySuccess: false,
  updateCategoryError: false,
  categories: [] as Array<ICategory>,
  category: {} as ICategory,
  totalCount: 0,
  toViewCategory: {} as ICategory,
};

export type CategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: CategoryState = initialState, action): CategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_CATEGORY):
      return {
        ...state,
        loading: true,
        getCategoryError: false,
        getCategorySuccess: false,
      };
    case REQUEST(ACTION_TYPES.GET_CATEGORIES):
      return {
        ...state,
        loading: true,
        getCategoriesSuccess: false,
        getCategoriesError: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_CATEGORY):
      return {
        ...state,
        loading: true,
        createCategoryError: false,
        createCategorySuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_CATEGORY):
      return {
        ...state,
        loading: true,
        deleteCategoryError: false,
        deleteCategorySuccess: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_CATEGORY):
      return {
        ...state,
        loading: true,
        updateCategoryError: false,
        updateCategorySuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_CATEGORY):
      return {
        ...initialState,
        loading: false,
        getCategoryError: true,
        getCategorySuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_CATEGORIES):
      return {
        ...initialState,
        loading: false,
        getCategoriesError: true,
        getCategoriesSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_CATEGORY):
      return {
        ...initialState,
        loading: false,
        createCategoryError: true,
        createCategorySuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_CATEGORY):
      return {
        ...initialState,
        loading: false,
        deleteCategoryError: true,
        deleteCategorySuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_CATEGORY):
      return {
        ...initialState,
        loading: false,
        updateCategoryError: true,
        updateCategorySuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_CATEGORY):
      return {
        ...state,
        loading: false,
        getCategoryError: false,
        getCategorySuccess: true,
        category: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_CATEGORIES):
      return {
        ...state,
        loading: false,
        getCategoriesError: false,
        getCategoriesSuccess: true,
        categories: [...action.payload.data[0]],
        totalCount: action.payload.data[1],
      };
    case SUCCESS(ACTION_TYPES.CREATE_CATEGORY):
      return {
        ...state,
        loading: false,
        createCategoryError: false,
        createCategorySuccess: true,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CATEGORY):
      return {
        ...state,
        loading: false,
        deleteCategoryError: false,
        deleteCategorySuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CATEGORY):
      return {
        ...state,
        loading: false,
        updateCategoryError: false,
        updateCategorySuccess: true,
      };
    case ACTION_TYPES.SET_CATEGORY_VIEW:
      return {
        ...state,
        toViewCategory: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const getCategories = (skip: number, take: number) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_CATEGORIES,
    payload: APIUrl.get(`ncm?skip=${skip}&take=${take}`),
  });
};

export const createCategory = (category: ICategory) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_CATEGORY,
    payload: APIUrl.post('ncm', category),
  });
};

export const updateCategory = (category: ICategory) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_CATEGORY,
    payload: APIUrl.put('ncm', category),
  });
};

export const getCategoryById = (id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.GET_CATEGORY,
    payload: APIUrl.get(`ncm/${id}`),
  });
};

export const deleteCategory = (category_id: string) => async (dispatch) => {
  await dispatch({
    type: ACTION_TYPES.DELETE_CATEGORY,
    payload: APIUrl.delete(`ncm/${category_id}`),
  });
  dispatch(getCategories(0, 10));
};

export const setToViewCategory = (category: ICategory) => ({
  type: ACTION_TYPES.SET_CATEGORY_VIEW,
  payload: category,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
