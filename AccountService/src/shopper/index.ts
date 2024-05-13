import { Email, UUID } from "../types";

export interface Shopper {
  id: UUID;
  email: Email;
  name: string;
  role: string;
}
