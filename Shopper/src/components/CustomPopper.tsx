import React, { useState, useRef } from 'react';
import { Popper, Paper, Button, Box } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

interface CustomPopperProps {
  children: React.ReactNode;
  buttonContent: React.ReactNode;
  buttonSX?: React.CSSProperties;
  popperSX?: React.CSSProperties;
  offset?: [number, number];
}

const CustomPopper: React.FC<CustomPopperProps> = ({
  children,
  buttonContent,
  buttonSX,
  popperSX,
  offset = [0, -4],
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const bufferZoneRef = useRef<HTMLDivElement>(null);
  const { setBackDropOpen } = useAppContext();

  const handleMouseEnter = () => {
    setOpen(true);
    setBackDropOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setBackDropOpen(false);
  };

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
          ...buttonSX,
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
              offset: offset,
            },
          },
        ]}
        sx={{ 
          zIndex: theme => theme.zIndex.drawer + 1,
          ...popperSX, 
        }}
      >
        <Box ref={bufferZoneRef} sx={{ pt: 1, pb: 1 }}>
          <div ref={popperRef}>
            <Paper>{children}</Paper>
          </div>
        </Box>
      </Popper>
    </div>
  );
};

export default CustomPopper;
