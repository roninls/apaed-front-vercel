import { ILocal } from './local.model';
import { IRole } from './role.model';

export interface IUser {
  id?: string;
  name?: string;
  password?: string;
  local_id?: string;
  local?: ILocal;
  role_id?: string;
  role?: IRole;
  active?: boolean;
}
