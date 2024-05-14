import React, { useState, useRef, useEffect } from 'react';
import { Popper, Backdrop, Paper, Button } from '@mui/material';

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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
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
      <Backdrop
        open={open}
        style={{ zIndex: -1 }}
        onClick={() => setOpen(false)}
      />
    </div>
  );
};

export default CustomPopper;
