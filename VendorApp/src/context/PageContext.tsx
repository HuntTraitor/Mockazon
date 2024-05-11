import { PropsWithChildren, useState, createContext } from 'react';

export const PageContext = createContext({
  page: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPage: (page: string) => {},
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const PageProvider = ({ children }: PropsWithChildren<{}>) => {
  // Pages: Products, API Keys
  const [page, setPage] = useState('Products');
  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};
