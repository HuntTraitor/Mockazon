import { Email, UUID } from "../types";

export interface Account {
  id: UUID;
  email: Email;
  name: string;
  username: string;
  role: string;
  suspended: boolean;
}
