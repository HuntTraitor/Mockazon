import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react';

interface ContextType {
  backDropOpen: boolean;
  setBackDropOpen: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<ContextType>({
  backDropOpen: false,
  setBackDropOpen: () => {},
});

export const AppContextProvider: React.FC<PropsWithChildren<object>> = ({
  children,
}) => {
  const [backDropOpen, setBackDropOpen] = useState(false);
  return (
    <AppContext.Provider value={{ backDropOpen, setBackDropOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};
