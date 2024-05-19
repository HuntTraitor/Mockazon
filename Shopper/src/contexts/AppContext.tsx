import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/router';

export interface ContextType {
  backDropOpen: boolean;
  setBackDropOpen: Dispatch<SetStateAction<boolean>>;
  mockazonMenuDrawerOpen: boolean;
  setMockazonMenuDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<ContextType | undefined>(undefined);

export const AppContextProvider: React.FC<PropsWithChildren<object>> = ({
  children,
}) => {
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [mockazonMenuDrawerOpen, setMockazonMenuDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setBackDropOpen(false);
      setMockazonMenuDrawerOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <AppContext.Provider
      value={{
        backDropOpen,
        setBackDropOpen,
        mockazonMenuDrawerOpen,
        setMockazonMenuDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
