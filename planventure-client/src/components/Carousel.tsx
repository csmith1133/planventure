import { useEffect, useRef, useState } from 'react';
import './Carousel.css';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    title: 'Your Next Adventure'
  },
  {
    url: 'https://images.unsplash.com/photo-1476067897447-d0c5df27b5df?auto=format&fit=crop&w=2000&q=80',
    title: 'Plan Your Journey'
  }
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);
  const scrollThreshold = 30;
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    let scrollAccumulator = 0;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        
        if (!isScrollingRef.current) {
          scrollAccumulator += e.deltaX;
          
          if (Math.abs(scrollAccumulator) > scrollThreshold) {
            isScrollingRef.current = true;
            
            if (scrollAccumulator > 0 && currentIndexRef.current < images.length - 1) {
              nextSlide();
            } else if (scrollAccumulator < 0 && currentIndexRef.current > 0) {
              prevSlide();
            }
            
            scrollAccumulator = 0;
            
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 300);
          }
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('wheel', handleWheel);
      }
    };
  }, [images.length]);

  return (
    <div className="carousel-section">
      <div className="carousel" ref={carouselRef}>
        {images.map((image, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="carousel-content">
              <h1>{image.title}</h1>
            </div>
          </div>
        ))}
        
        <button className="carousel-arrow left" onClick={prevSlide}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="m15.057 19.78-7.213-7.232a.75.75 0 0 1 0-1.06l7.25-7.268a.75.75 0 0 1 1.062 1.06l-6.721 6.739 6.684 6.701a.75.75 0 0 1-1.062 1.06" />
          </svg>
        </button>
        
        <button className="carousel-arrow right" onClick={nextSlide}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="m8.943 19.78 7.213-7.232a.75.75 0 0 0 0-1.06L8.906 4.22a.75.75 0 0 0-1.062 1.06l6.721 6.739-6.684 6.701a.75.75 0 0 0 1.062 1.06" />
          </svg>
        </button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
