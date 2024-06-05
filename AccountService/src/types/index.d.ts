/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

/**
 * @pattern ^(.+)@(.+)$ please provide correct email
 * @example "test@gmail.com"
 */
export type Email = string;

export interface User {
  id: UUID;
  email: Email;
  name: string;
  role: string;
  suspended: boolean;
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

export type SessionUser = {
  id: string;
  role: string;
};

export type Account = {
  id: string;
  name: string;
  role: string;
};
