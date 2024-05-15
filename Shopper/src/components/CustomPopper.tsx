import React, { useState, useRef } from 'react';
import { Popper, Paper, Button, Box } from '@mui/material';
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
  const popperRef = useRef<HTMLDivElement>(null);
  const bufferZoneRef = useRef<HTMLDivElement>(null);
  const { setBackDropOpen } = useAppContext();

  const handleMouseEnter = () => {
    setOpen(true);
    setBackDropOpen(true);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      bufferZoneRef.current &&
      relatedTarget &&
      !bufferZoneRef.current.contains(relatedTarget)
    ) {
      setOpen(false);
      setBackDropOpen(false);
    }
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
              offset: [0, -4],
            },
          },
        ]}
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
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
