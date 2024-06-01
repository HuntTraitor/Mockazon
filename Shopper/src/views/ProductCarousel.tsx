// ProductCarousel.tsx
import React, { useRef } from 'react';
import {
  Box,
  Button,
  CardActionArea,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScroll = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft +=
        direction === 'prev' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <Box
      className={isMobile ? styles.productImagesMobile : styles.productImages}
    >
      <Typography
        variant={isMobile ? 'subtitle1' : 'h6'}
        sx={{
          fontWeight: 'bold',
          fontSize: isMobile ? '1.1rem' : undefined,
        }}
      >
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
                  <Box
                    className={
                      isMobile
                        ? styles.imageContainerMobile
                        : styles.imageContainer
                    }
                  >
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
        {!isMobile && (
          <Button
            aria-label={'previous button'}
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
        )}
        {!isMobile && (
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
            aria-label={'next button'}
            onClick={() => handleScroll('next')}
          >
            <ArrowForwardIosIcon />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductCarousel;
