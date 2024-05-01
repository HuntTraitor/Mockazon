/**
 * Define any global types for the Vendor API
 */

/**
 * Citation for Regex: https://ihateregex.io/expr/uuid/
 * @pattern ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$
 * @example "81c689b1-b7a7-4100-8b2d-309908b444f5"
 */
export type UUID = string;

/**
 * @pattern ^(.+)@(.+)$ please provide correct email
 * @example "test@gmail.com"
 */
export type Email = string;

export type SessionUser = {
    id: UUID,
    email: string,
    name: string
    role: string,
  }
  
declare global {
namespace Express {
    export interface Request {
    user?: SessionUser;
    }
}
}