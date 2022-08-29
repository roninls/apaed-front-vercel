import { IRole } from './role.model';

export interface IAccount {
  id: string;
  name: string;
  local_id: string;
  role_id: string;
  role: IRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}
