import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';
import {
  PropsWithChildren,
  useState,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react';

export interface ContextType {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const LoggedInContext = createContext<ContextType>({
  accessToken: '',
  setAccessToken: () => {},
  location: '',
  setLocation: () => {},
  locale: '',
  setLocale: () => {},
  user: { accessToken: '', id: '', name: '', role: '' },
  setUser: () => {},
});

export interface User {
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
  useLoadLocalStorageUser(setUser, setAccessToken);

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
