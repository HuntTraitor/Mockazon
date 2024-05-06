import { PropsWithChildren, useState, createContext } from 'react';

export const LoggedInContext = createContext({
  accessToken: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAccessToken: (accessToken: string) => {},
  location: 'login',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLocation: (loc: string) => {},
  locale: 'en',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLocale: (locale: string) => {},
});

export const LoggedInUserProvider = ({
  children,
}: PropsWithChildren<NonNullable<unknown>>) => {
  const [accessToken, setAccessToken] = useState('');
  const [location, setLocation] = useState('login');
  const [locale, setLocale] = useState('en');
  return (
    <LoggedInContext.Provider
      value={{
        accessToken,
        setAccessToken,
        location,
        setLocation,
        locale,
        setLocale,
      }}
    >
      {children}
    </LoggedInContext.Provider>
  );
};
