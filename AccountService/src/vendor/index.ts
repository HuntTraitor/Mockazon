import { Email, UUID } from "../types";

export interface Vendor {
  id: UUID;
  email: Email;
  name: string;
  role: string;
  suspended: boolean;
}

export interface CreateVendor {
  name: string;
  email: Email;
  password: string;
}

// export type SessionUser = {
//   id: string;
//   role: string;
// };
