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
  isMobile: boolean;
  setIsMobile?: Dispatch<SetStateAction<boolean>>;
  accountDrawerOpen: boolean;
  setAccountDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<ContextType | undefined>(undefined);

export const AppContextProvider: React.FC<PropsWithChildren<object>> = ({
  children,
}) => {
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [mockazonMenuDrawerOpen, setMockazonMenuDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
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

  useEffect(() => {
    const mobileSize = 1000;

    if (window.innerWidth < mobileSize) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    const handleResize = () => {
      if (window.innerWidth < mobileSize) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log('AccountDrawer open:', accountDrawerOpen);
  }, [accountDrawerOpen]);

  return (
    <AppContext.Provider
      value={{
        backDropOpen,
        setBackDropOpen,
        mockazonMenuDrawerOpen,
        setMockazonMenuDrawerOpen,
        isMobile,
        setIsMobile,
        accountDrawerOpen,
        setAccountDrawerOpen,
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
