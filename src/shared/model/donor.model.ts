import { IContact } from './contact.model';

export interface IDonor {
  id?: string;
  name?: string;
  email?: string;
  contact_id?: string;
  document?: string;
  contact?: IContact;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
