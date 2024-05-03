import { PropsWithChildren, useState, createContext } from 'react';

export const LoggedInContext = createContext({
  accessToken: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAccessToken: (accessToken: string) => {},
});

export const LoggedInUserProvider = ({
  children,
}: PropsWithChildren<NonNullable<unknown>>) => {
  const [accessToken, setAccessToken] = useState('');

  return (
    <LoggedInContext.Provider
      value={{
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </LoggedInContext.Provider>
  );
};
