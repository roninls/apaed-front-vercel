import { ICategory } from './category.model';
import { IDonation } from './donation.model';
import { ILocal } from './local.model';
import { IProduct } from './product.model';

export interface IStock {
  id?: string;
  name?: string;
  donation_id?: string;
  local_id?: string;
  product_id?: string;
  ncm_id?: string;
  brand?: string;
  ncm_code?: string;
  ncm?: ICategory;
  valor_product?: number;
  count?: number;
  unity_measurement?: string;
  expiration_date?: Date;
  minimal_qntt?: number;
  totalAmount?: number;
  active?: boolean;
}

export interface IProductLocalDonationGet {
  id?: string;
  donation_id?: string;
  donation?: IDonation;
  local_id?: string;
  local?: ILocal;
  ncm_id?: string;
  product_id?: string;
  product?: IProduct;
  expiration_date?: string;
  active?: boolean;
  totalAmount?: number;
  totalvalor_product?: number;
  created_at?: string;
  updated_at?: string;
  valor_product?: number;
}

export interface IProductLocalDonationPostPut {
  id?: string;
  brand?: string;
  donation_id?: string;
  local_id?: string;
  ncm_id?: string;
  ncm?: ICategory;
  product_id?: string;
  expiration_date?: string;
  name?: string;
  category?: string;
  amount?: number;
  valor_product?: number;
  active?: boolean;
}
