// ProductCarousel.tsx
import React from 'react';
import { Box, Button, CardActionArea, Typography } from '@mui/material';
import Image from 'next/image';
import styles from '@/styles/MainPage.module.css';
import { Product } from '@/graphql/types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  return (
    <Box className={styles.productImages}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title} {/* Use the title prop */}
      </Typography>
      <Box
        className={styles.productCarousel}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {products.map((product, index) => (
          <Box key={index} sx={{ flexShrink: 0 }}>
            <Button
              href={`/products/${product.id}`}
              className={styles.productImage}
            >
              <CardActionArea>
                <Image
                  src={product.data.image}
                  alt={`Product ${index + 1}`}
                  width={200}
                  height={200}
                />
              </CardActionArea>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCarousel;