import React, { useState, useRef, useEffect } from 'react';
import { Popper, Paper, Button } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

interface CustomPopperProps {
  children: React.ReactNode;
  buttonContent: React.ReactNode;
}

const CustomPopper: React.FC<CustomPopperProps> = ({
  children,
  buttonContent,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setBackDropOpen } = useAppContext();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
    setBackDropOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      setBackDropOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <Button
        ref={anchorRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          color: 'white',
          textTransform: 'none',
          textAlign: 'left',
        }}
      >
        {buttonContent}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        placement="bottom"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ]}
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Paper>{children}</Paper>
      </Popper>
    </div>
  );
};

export default CustomPopper;
