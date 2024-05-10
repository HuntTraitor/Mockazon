import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Switcher from '@/views/Switcher';
import { useTranslation } from 'next-i18next';

const ProductsHeaderBar = () => {
  const { t } = useTranslation('products');

  // https://chat.openai.com/share/86f158f1-110e-4905-ac4a-85ae8282f2c2
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          aria-label={'prime-title'}
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Mockazon Prime
        </Typography>

        {/* "Delivery" text on the left */}
        <Typography aria-label={'delivery'} variant="subtitle1" component="div">
          {t('deliver')} &lt;Username&gt;
        </Typography>

        <InputBase
          placeholder={`${t('search')}`}
          inputProps={{ 'aria-label': 'search' }}
          sx={{ mx: 2, flexGrow: 1, backgroundColor: 'white' }}
        />

        <Switcher />

        <Typography
          aria-label={'greeting'}
          sx={{ ml: 2 }}
          variant="subtitle1"
          component="div"
        >
          {t('greeting')} &lt;Username&gt;
          <br />
          {t('accountsAndLists')}
        </Typography>

        {/* "Returns & Orders" text */}
        <Typography
          aria-label={'returns and orders'}
          variant="subtitle1"
          component="div"
          sx={{ ml: 2 }}
        >
          {t('returnsAndOrders')}
        </Typography>

        <IconButton
          size="large"
          aria-label="cart"
          color="inherit"
          sx={{ ml: 2 }}
        >
          <ShoppingCart />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ProductsHeaderBar;
