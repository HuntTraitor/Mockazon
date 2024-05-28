import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import styles from '@/styles/ProductCard.module.css';
import { Product } from '@/graphql/types';
import { Link, Box } from '@mui/material';
import Price from './Price';
import DeliveryText from './DeliveryText';
import AddToCartButton from './AddToCartButton';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const { t } = useTranslation('viewProduct');
  const price = product.data.price.toFixed(2).toString();
  const router = useRouter();

  return (
    <Card
      sx={{
        height: 650,
        minWidth: 275,
        maxWidth: 275,
      }}
    >
      <CardContent>
        <Button
          onClick={() => router.push(`/products/${product.id}`)}
          className={styles.productImage}
        >
          <Box className={styles.imageContainerAlt}>
            <Image
              src={product.data.image}
              alt={t('productImageAlt')}
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Button>
        <div>
          <Link
            variant="h6"
            onClick={() => router.push(`/products/${product.id}`)}
            className={styles.productName}
            underline="none"
          >
            {product.data.name}
          </Link>
        </div>
        <Price price={price} />
        <Typography sx={{ mb: 1.5 }} className={styles.primeLogo}>
          <span>
            <Image
              src="/prime_logo.jpg"
              alt="Prime logo"
              width={70}
              height={21.5}
            />
          </span>
        </Typography>
        <DeliveryText deliveryDate={product.data.deliveryDate} />
        <AddToCartButton product={product} quantity={'1'} />
      </CardContent>
    </Card>
  );
}
