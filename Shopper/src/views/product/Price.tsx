import { Typography } from "@mui/material";
import styles from '@/styles/ProductCard.module.css';

interface PriceProps {
  price: string;
}

export default function Price({price}: PriceProps) {
  let beforeDot, afterDot: string;
  const dotIndex = price.indexOf('.');
  if (dotIndex === -1) {
    beforeDot = price;
    afterDot = '00';
  } else {
    beforeDot = price.slice(0, dotIndex);
    afterDot = afterDot = price.slice(dotIndex + 1);
  }

  return (
    <Typography variant="body2" >
    <span>$</span>
    <span className={styles.middlePrice}>{beforeDot}</span>
    <span>{afterDot}</span>
    </Typography>
  )
}