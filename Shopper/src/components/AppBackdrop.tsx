import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Backdrop } from '@mui/material';

/**
 * AppBackDrop component
 * @return {React.ReactElement}
 */
const AppBackDrop = () => {
  const { backDropOpen, setBackDropOpen } = useAppContext();

  return (
    <Backdrop
      open={backDropOpen}
      style={{ zIndex: 1, position: 'fixed' }}
      onClick={() => setBackDropOpen(false)}
    />
  );
};

export default AppBackDrop;
