import { Email, UUID } from "../types";

export interface User {
  id: UUID;
  email: Email;
  name: string;
  username: string;
  role: string;
}
