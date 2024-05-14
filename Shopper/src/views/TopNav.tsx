import TopHeader from '@/views/TopHeader';
import SubHeader from '@/views/SubHeader';
import styles from '@/styles/TopNav.module.css';
import { AppBar } from '@mui/material';

const TopNav = () => {
  return (
    <AppBar position="fixed" className={styles.container}>
      <TopHeader />
      <SubHeader />
    </AppBar>
  );
};

export default TopNav;
