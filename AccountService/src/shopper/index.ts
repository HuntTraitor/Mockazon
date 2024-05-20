import { Email, UUID } from "../types";

export interface Shopper {
  id: UUID;
  email: Email;
  name: string;
  role: string;
}

export interface CreateUserInput {
  email: Email;
  name: string;
  password?: string;
  sub?: string;
}

export interface LoginInput {
  email?: Email;
  password?: string;
  sub?: string;
}
