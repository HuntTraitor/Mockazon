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
// import StorefrontIcon from '@mui/icons-material/Storefront';
import KeyIcon from '@mui/icons-material/Key';
import Image from 'next/image';
import { PageContext } from '../../contexts/PageContext';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

const drawerWidth = 300;

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyDrawer() {
  const pageContext = React.useContext(PageContext);

  // const handleProductsClick = () => {
  //   pageContext.setPage('Products');
  // };

  const handleKeysClick = () => {
    pageContext.setPage('API Keys');
  };

  const listItems = [
    // {
    //   // text: 'Products',
    //   // icon: <StorefrontIcon />,
    //   // onClick: handleProductsClick,
    // },
    {
      text: 'API Keys',
      icon: <KeyIcon />,
      onClick: handleKeysClick,
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
          src={`${basePath}/mini_mockazon_logo.png`}
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
