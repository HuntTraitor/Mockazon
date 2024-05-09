export type SessionUser = {
  id: string;
};

declare module 'next' {
  export interface NextApiRequest {
    user: SessionUser;
  }
}
