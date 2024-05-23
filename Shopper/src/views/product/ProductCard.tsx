import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import styles from '@/styles/ProductCard.module.css'

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
  beforeDot = price.slice(0, dotIndex)
  if (dotIndex === -1) {
    afterDot = '00'
  } else {
    afterDot = afterDot = price.slice(dotIndex + 1);
  }

  console.log(convertDate(product.data.deliveryDate))

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
        <Button size="small" className={styles.addToCart}>Add to cart</Button>
      </CardContent>
    </Card>
  );
}