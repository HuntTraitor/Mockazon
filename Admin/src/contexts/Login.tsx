/*
  Citation:
  Professor Harrison's NextJS TypeScript Authenticated Book Example
*/

import { PropsWithChildren, useState, createContext } from 'react';

export const LoginContext = createContext({
  id: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setId: (id: string) => {},
  accessToken: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAccessToken: (accessToken: string) => {},
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [id, setId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return (
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      {children}
    </LoginContext.Provider>
  );
};
