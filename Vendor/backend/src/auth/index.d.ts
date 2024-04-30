export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Authenticated {
  id: string;
  name: string;
  accessToken: string;
}
