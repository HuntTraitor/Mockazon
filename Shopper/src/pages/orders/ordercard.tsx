import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import StorefrontIcon from '@mui/icons-material/Storefront';

import styles from '@/styles/OrderCard.module.css';
import Image from 'next/image';

const mockOrder = {
  orderId: 'a2249de3-0339-43c0-8dc0-c2ba8ede7ba0',
  purchased: 'May 5, 2024',
  total: '22.16',
  shippingAddress: {
    name: 'Naomi Tratar',
    address: '6019 W. 74th st.',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90045',
    country: 'United States',
  },
  delieveredDate: 'May 6',
  productName: 'Computer science book for dummies',
};

const card = (
  <React.Fragment>
    <div className={styles.cardHeader}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Typography variant="subtitle2">ORDER PLACED</Typography>
          <Typography variant="body2">{mockOrder.purchased}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">TOTAL</Typography>
          <Typography variant="body2">${mockOrder.total}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">SHIP TO</Typography>
          <Typography variant="body2">
            {mockOrder.shippingAddress.name}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle2">
            ORDER # {mockOrder.orderId}
          </Typography>
        </Grid>
      </Grid>
    </div>
    <Divider />
    <CardContent>
      <Typography variant="h5" component="div">
        Delivered {mockOrder.delieveredDate}
      </Typography>
      <Typography variant="body2" sx={{ mt: '1px' }}>
        Your package was left near the front door or porch
      </Typography>
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div>
            <Image
              src="https://m.media-amazon.com/images/I/51B4RTFxcKL._SS142_.jpg"
              alt="product-image"
              width={100}
              height={100}
            />
          </div>
          <div className={styles.contentDetails}>
            <Link underline="hover">{mockOrder.productName}</Link>
            <Typography variant="body2">
              Return or replace items: Eligible through June 5, 2024
            </Typography>
            <div className={styles.purchaseButtons}>
              <Button variant="contained" className={styles.buyAgainIcon}>
                <StorefrontIcon sx={{ mr: '5px' }} />
                Buy it again
              </Button>
              <Button variant="contained" className={styles.buttonStyle}>
                View your item
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.contentButtons}>
          <div className={styles.buttonList}>
            <Button variant="contained" className={styles.buttonStyle}>
              Track package
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Return or replace items
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Share gift recipt
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Write a product review
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
    <Divider />
    <CardActions>
      <Button size="small" className={styles.archive}>
        Archive order
      </Button>
    </CardActions>
  </React.Fragment>
);

export default function OrderCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
