import React, { PropsWithChildren, useState, createContext } from 'react';
import { ReactNode } from 'react';

//This is so the linter doesnt complain about types
interface LoginProviderProps {
  children: ReactNode;
}

export const LoginContext = createContext({
  userName: '',
  // eslint-disable-next-line
  setUserName: (userName: string) => {},
  accessToken: '',
  // eslint-disable-next-line
  setAccessToken: (accessToken: string) => {},
});

export const LoginProvider = ({
  children,
}: PropsWithChildren<LoginProviderProps>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setAccessToken(token)
    }
  })

  return (
    <LoginContext.Provider
      value={{ userName, setUserName, accessToken, setAccessToken }}
    >
      {children}
    </LoginContext.Provider>
  );
};
