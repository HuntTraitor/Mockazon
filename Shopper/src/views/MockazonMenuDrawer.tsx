import { Drawer, Box, Typography } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import styles from '@/styles/MockazonMenuDrawer.module.css';
// import { useTranslation } from 'next-i18next';

const MockazonMenuDrawer = () => {
  const { mockazonMenuDrawerOpen, setMockazonMenuDrawerOpen } = useAppContext();
  //   const { t } = useTranslation('mockazonMenuDrawer');

  return (
    <Drawer
      className={styles.container}
      anchor="left"
      open={mockazonMenuDrawerOpen}
      onClose={() => setMockazonMenuDrawerOpen(false)}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: '300px',
          padding: '20px',
          backgroundColor: 'white',
        },
        overflow: 'auto',
      }}
    >
      <Box className={styles.userBox}>
        {/* load user name  */}
        <Typography variant="h6">Hello, User Name</Typography>
      </Box>
      <Box>{/* Load categories */}</Box>
    </Drawer>
  );
};

export default MockazonMenuDrawer;
