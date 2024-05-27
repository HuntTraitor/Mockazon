import { PropsWithChildren, useState, createContext } from 'react';

export const RefetchContext = createContext({
  refetch: false,
  // eslint-disable-next-line
  setRefetch: (refetch: boolean) => {},
});

// eslint-disable-next-line
export const RefetchProvider = ({ children }: PropsWithChildren<{}>) => {
  const [refetch, setRefetch] = useState(false);
  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};
