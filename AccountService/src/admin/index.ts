import { Email, UUID } from "../types";

export interface Account {
  id: UUID;
  email: Email;
  name: string;
  role: string;
  suspended: boolean;
}
