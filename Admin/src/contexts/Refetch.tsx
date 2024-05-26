import { PropsWithChildren, useState, createContext } from "react";

export const RefetchContext = createContext({
  refetch: false,
  setRefetch: (refetch: boolean) => {},
});

export const RefetchProvider = ({ children }: PropsWithChildren<{}>) => {
  const [refetch, setRefetch] = useState(false)
  return (
    <RefetchContext.Provider value={{refetch, setRefetch}}>
      {children}
    </RefetchContext.Provider>
  )
}