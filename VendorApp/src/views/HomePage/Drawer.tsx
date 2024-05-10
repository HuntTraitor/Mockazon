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
//import { PageContext } from '@/contexts/PageContext';

const drawerWidth = 300;

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyDrawer() {
  // const pageContext = React.useContext(PageContext);

  const handleProductsClick = () => {
    console.log('Products');
    //pageContext.setPage('Users');
  };

  const handleOrdersClick = () => {
    console.log('Orders');
    // pageContext.setPage('Requests');
  };

  const listItems = [
    {
      text: 'Products',
      icon: <PeopleAltOutlinedIcon />,
      onClick: handleProductsClick,
    },
    {
      text: 'Orders',
      icon: <PersonAddAltIcon />,
      onClick: handleOrdersClick,
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
          src="/mini_mockazon_logo.png"
          alt="Mockazon Logo"
          width={40}
          height={30}
        />
        <Typography variant="h6">Mockazon Vendor App</Typography>
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
