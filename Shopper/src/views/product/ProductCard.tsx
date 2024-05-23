import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import styles from '@/styles/ProductCard.module.css'
import { enqueueSnackbar } from 'notistack';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

const convertDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
  return formattedDate
}

export default function ProductCard({product}: any) {
  const price = product.data.price.toString()
  let beforeDot, afterDot: string;
  const dotIndex = price.indexOf('.')
  if (dotIndex === -1) {
    beforeDot = price
    afterDot = '00'
  } else {
    beforeDot = price.slice(0, dotIndex)
    afterDot = afterDot = price.slice(dotIndex + 1);
  }
  const { user } = React.useContext(LoggedInContext);

  const addToShoppingCart = (productId: string) => {
    const query = {
      query: `mutation AddToShoppingCart {
        addToShoppingCart(productId: "${productId}", shopperId: "${user.id}", quantity: "1") {
          id
          product_id
          shopper_id
          data { 
            quantity
          }
        }
      }`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(shoppingCart => {
        if (shoppingCart.errors && shoppingCart.errors.length > 0) {
          throw new Error(shoppingCart.errors[0].message);
        }
        enqueueSnackbar('Added to shopping cart', {
          variant: 'success',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
        console.log(shoppingCart);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could not add product to cart', {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  return (
    <Card sx={{ 
      minWidth: 275,
      }}>
      <CardContent>
        <Image 
          src={product.data.image} 
          alt='Product image'
          width={250}
          height={250} 
        />
        <Typography variant="h6" component="div">
          {product.data.name}
        </Typography>
        <Typography variant="body2">
          <span>$</span>
          <span className={styles.middlePrice}>{beforeDot}</span>
          <span>{afterDot}</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} className={styles.primeLogo}>
          <span>
            <Image 
              src='/prime_logo.jpg'
              alt='Prime logo'
              width={70}
              height={21.5}
            />
          </span>
        </Typography>
        <Typography variant="body2">
          FREE delivery <span className={styles.deliveryDate}>{convertDate(product.data.deliveryDate)}</span>
        </Typography>
        <Button size="small" className={styles.addToCart} onClick={() => addToShoppingCart(product.id)} aria-label='Add to cart button'>Add to cart</Button>
      </CardContent>
    </Card>
  );
}