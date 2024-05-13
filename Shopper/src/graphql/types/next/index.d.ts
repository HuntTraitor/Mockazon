export type SessionUser = {
  id: string;
};

declare module 'next' {
  export interface NextApiRequest {
    user: SessionUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: any;
  }
}
