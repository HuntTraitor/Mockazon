import React from 'react';
import {
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  ListItemText,
  Box,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Image from 'next/image';

const drawerWidth = 300;

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyDrawer() {
  const listItems = {
    Users: <PeopleAltOutlinedIcon />,
    Settings: <SettingsOutlinedIcon />,
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          gap: '8px',
        }}
      >
        <Image
          src="/mini_mockazon_logo.png"
          alt="Mockazon Logo"
          width={40}
          height={30}
        />
        <Typography variant="h6">Mockazon</Typography>
      </Box>
      <Divider />
      <List>
        {Object.entries(listItems).map(([text, icon]) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
