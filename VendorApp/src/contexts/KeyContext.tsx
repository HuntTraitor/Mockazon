import { PropsWithChildren, useState, createContext } from 'react';

export interface Key {
  key: string;
  vendor_id: string;
  active: boolean;
  blacklisted: boolean;
}

export const KeyContext = createContext<{
  keys: Key[];
  setKeys: (keys: Key[]) => void;
    }>({
      keys: [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setKeys: () => {},
    });

// eslint-disable-next-line @typescript-eslint/ban-types
export const KeyProvider = ({ children }: PropsWithChildren<{}>) => {
  // Pages: Products, API Keys
  const [keys, setKeys] = useState<Key[]>([]);
  return (
    <KeyContext.Provider value={{ keys, setKeys }}>
      {children}
    </KeyContext.Provider>
  );
};
