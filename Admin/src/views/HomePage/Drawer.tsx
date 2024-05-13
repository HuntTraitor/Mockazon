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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Image from 'next/image';
import { PageContext } from '@/contexts/PageContext';

const drawerWidth = 300;

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyDrawer() {
  const pageContext = React.useContext(PageContext);

  const handleUsersClick = () => {
    pageContext.setPage('Users');
  };

  const handleRequestsClick = () => {
    pageContext.setPage('Requests');
  };

  const listItems = [
    {
      text: 'Users',
      icon: <PeopleAltOutlinedIcon />,
      onClick: handleUsersClick,
    },
    {
      text: 'Requests',
      icon: <PersonAddAltIcon />,
      onClick: handleRequestsClick,
    },
  ];

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
          src={`${process.env.ENVIRONMENT == 'production' ? '/admin' : ''}/mini_mockazon_logo.png`}
          alt="Mockazon Logo"
          width={40}
          height={30}
        />
        <Typography variant="h6">Mockazon</Typography>
      </Box>
      <Divider />
      <List>
        {listItems.map(({ text, icon, onClick }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
