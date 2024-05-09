import { Email, UUID } from '../types';

export interface User {
  id: UUID;
  email: Email;
  name: string;
  role: string;
}

export interface Credentials {
  email: Email;
  password: string;
}

export interface Authenticated {
  id: UUID;
  name: string;
  accessToken: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: Email;
  role: string;
}

export interface CreateVendor {
  name: string;
  email: Email;
  password: string;
}
