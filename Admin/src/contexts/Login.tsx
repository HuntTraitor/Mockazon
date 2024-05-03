/*
  Citation:
  Professor Harrison's NextJS TypeScript Authenticated Book Example
*/

import { PropsWithChildren, useState, createContext } from 'react';

export const LoginContext = createContext({
  userName: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserName: (userName: string) => {},
  accessToken: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAccessToken: (accessToken: string) => {},
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return (
    <LoginContext.Provider
      value={{ userName, setUserName, accessToken, setAccessToken }}
    >
      {children}
    </LoginContext.Provider>
  );
};
