import { IType } from './type.model';
import { IUnityMeasurement } from './unityMeasurement.model';

export interface ICategory {
  id?: string;
  description?: string;
  ncm_code?: string;
  long_description?: string;
  type_id?: string;
  type?: IType;
  unity_measurement_id?: string;
  minimal_more_products?: number;
  unity_measurement?: IUnityMeasurement;
  minimal_qntt?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
