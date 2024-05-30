// ProductCarousel.tsx
import React, { useRef } from 'react';
import { Box, Button, CardActionArea, Typography } from '@mui/material';
import Image from 'next/image';
import styles from '@/styles/MainPage.module.css';
import { Product } from '@/graphql/types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 1500;

  const handleScroll = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft +=
        direction === 'prev' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <Box className={styles.productImages}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={carouselRef}
          className={styles.productCarousel}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {products.map((product, index) => (
            <Box key={index} sx={{ flexShrink: 0, marginRight: '16px' }}>
              <Button
                href={`/products/${product.id}`}
                className={styles.productImage}
              >
                <CardActionArea>
                  <Box className={styles.imageContainer}>
                    <Image
                      src={product.data.image}
                      alt={`Product ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </Box>
                </CardActionArea>
              </Button>
            </Box>
          ))}
        </Box>
        <Button
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            opacity: 1.0,
            padding: '24px 16px',
            minWidth: 'auto',
            height: '60%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              opacity: 1,
              backgroundColor: 'white',
            },
          }}
          onClick={() => handleScroll('prev')}
        >
          <ArrowBackIosIcon />
        </Button>
        <Button
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            opacity: 1.0,
            padding: '24px 16px',
            minWidth: 'auto',
            height: '60%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              opacity: 1,
              backgroundColor: 'white',
            },
          }}
          onClick={() => handleScroll('next')}
        >
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCarousel;
