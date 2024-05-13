import { Email, UUID } from '../types';

export interface Vendor {
  id: UUID;
  email: Email;
  name: string;
  role: string;
}

export interface CreateVendor {
  name: string;
  email: Email;
  password: string;
}
