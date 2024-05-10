import {
  PropsWithChildren,
  useState,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react';

export const LoggedInContext = createContext<{
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}>({
  accessToken: '',
  setAccessToken: () => {},
  location: 'login',
  setLocation: () => {},
  locale: 'en',
  setLocale: () => {},
  user: { accessToken: '', id: '', name: '', role: '' },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: () => {},
});

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

export const LoggedInUserProvider = ({
  children,
}: PropsWithChildren<NonNullable<unknown>>) => {
  const [accessToken, setAccessToken] = useState('');
  const [location, setLocation] = useState('login');
  const [locale, setLocale] = useState('en');
  const [user, setUser] = useState({} as User);
  return (
    <LoggedInContext.Provider
      value={{
        accessToken,
        setAccessToken,
        location,
        setLocation,
        locale,
        setLocale,
        user,
        setUser,
      }}
    >
      {children}
    </LoggedInContext.Provider>
  );
};
