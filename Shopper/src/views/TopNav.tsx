import React from 'react';
import { AppBar, Grid, Toolbar } from '@mui/material';
import TopHeader from '@/views/TopHeader';
// import SubHeader from '@/views/SubHeader';
import styles from '@/styles/TopNav.module.css';

const TopNav = () => {
  return (
    <Grid container spacing={2} className={styles.container}>
      <Grid item xs={12} className={styles.item}>
        <AppBar position="fixed" className={styles.appBar}>
          <TopHeader />
          {/* <SubHeader /> */}
        </AppBar>
        <Toolbar />
      </Grid>
    </Grid>
  );
};

export default TopNav;
