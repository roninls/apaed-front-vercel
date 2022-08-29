import { IDonor } from './donor.model';
import { IProductLocalDonationGet } from './productLocalDonation.model';

export interface IDonation {
  id?: string;
  donor_id?: string;
  donor?: IDonor;
  type?: string;
  donation_date?: string;
  productLocalDonation?: IProductLocalDonationGet[];
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
