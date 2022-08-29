import { IContact } from './contact.model';

export interface ILocal {
  id?: string;
  name?: string;
  contact_id?: string;
  contact?: IContact;
  document?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
