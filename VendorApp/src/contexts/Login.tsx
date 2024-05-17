import React, { PropsWithChildren, useState, createContext } from 'react';
import { ReactNode } from 'react';

//This is so the linter doesnt complain about types
interface LoginProviderProps {
  children: ReactNode;
}

export const LoginContext = createContext({
  accessToken: '',
  // eslint-disable-next-line
  setAccessToken: (accessToken: string) => {},
});

export const LoginProvider = ({
  children,
}: PropsWithChildren<LoginProviderProps>) => {
  const [accessToken, setAccessToken] = useState('');

  return (
    <LoginContext.Provider
      value={{accessToken, setAccessToken }}
    >
      {children}
    </LoginContext.Provider>
  );
};
