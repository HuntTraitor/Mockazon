import { Email, UUID } from "../types";

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
