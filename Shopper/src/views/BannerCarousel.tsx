import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/BannerCarousel.module.css';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeArrow, setActiveArrow] = useState<'left' | 'right' | null>(null);
  const slides = [
    {
      url: 'https://m.media-amazon.com/images/I/61gOVRHYR2L._SX3000_.jpg',
      alt: 'Banner 1',
    },
    {
      url: 'https://m.media-amazon.com/images/I/71A6FesSGOL._SX3000_.jpg',
      alt: 'Banner 2',
    },
    {
      url: 'https://m.media-amazon.com/images/I/61Pda4M7l4L._SX3000_.jpg',
      alt: 'Banner 3',
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
    setActiveArrow('left');
  };

  const goToNextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    setActiveArrow('right');
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (carouselRef.current && !carouselRef.current.contains(event.target as Node)) {
      setActiveArrow(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={carouselRef} className={styles.carousel}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            index === currentSlide ? styles.active : ''
          }`}
        >
          <div className={styles.slideImage}>
            <Image
              src={slide.url}
              alt={slide.alt}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        </div>
      ))}
      <div
        className={`${styles.arrow} ${styles.arrowLeft} ${
          activeArrow === 'left' ? styles.active : ''
        }`}
        aria-label='previous slide button'
        onClick={goToPrevSlide}
      >
        &lt;
      </div>
      <div
        className={`${styles.arrow} ${styles.arrowRight} ${
          activeArrow === 'right' ? styles.active : ''
        }`}
        aria-label='next slide button'
        onClick={goToNextSlide}
      >
        &gt;
      </div>
    </div>
  );
};

export default BannerCarousel;