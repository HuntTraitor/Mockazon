import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { Product } from '@/graphql/types';
import { Link, Box } from '@mui/material';
import Price from './Price';
import DeliveryText from './DeliveryText';
import AddToCartButton from './AddToCartButton';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/ProductCard.module.css';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const { t } = useTranslation('viewProduct');
  const price = product.data.price.toFixed(2).toString();

  // Set the maximum number of characters for the product name
  const maxCharacters = 45;

  // Truncate the product name if it exceeds the maximum characters
  const truncatedName =
    product.data.name.length > maxCharacters
      ? product.data.name.slice(0, maxCharacters) + '...'
      : product.data.name;

  return (
    <Card
      sx={{
        width: 250,
        height: 500,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <Link href={`/products/${product.id}`} underline="none">
        <Box className={styles.imageContainer}>
          <Image src={product.data.image} alt={t('productImageAlt')} layout='fill' objectFit='contain' />
        </Box>
      </Link>
      <CardContent>
        <Link href={`/products/${product.id}`} underline="none" color="inherit">
          <Typography
            style={{ fontSize: '1rem' }}
            component="div"
            className={styles.productName}
          >
            {truncatedName}
          </Typography>
        </Link>
        <Price price={price} />
        <Typography variant="body1" color="text.secondary" className={styles.primeLogo}>
          <Image src="/prime_logo.jpg" alt="Prime logo" width={70} height={21.5} />
        </Typography>
        <DeliveryText deliveryDate={product.data.deliveryDate} />
        <AddToCartButton product={product} quantity={'1'} />
      </CardContent>
    </Card>
  );
}