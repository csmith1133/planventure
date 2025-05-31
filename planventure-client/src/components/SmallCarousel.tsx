import { useEffect, useRef, useState } from 'react';
import './SmallCarousel.css';

const images = [
  { url: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b', title: 'Project 1' },
  { url: 'https://images.unsplash.com/photo-1485550409059-9afb054cada4', title: 'Project 2' },
  { url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', title: 'Project 3' },
  { url: 'https://images.unsplash.com/photo-1429087969512-1e85aab2683d', title: 'Project 4' },
  { url: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee', title: 'Project 5' },
  { url: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9', title: 'Project 6' }
];

export default function SmallCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
        const slideWidth = 68;
        const margin = 40 / window.innerWidth * 100;
        const viewportCenter = (100 - slideWidth) / 2;
        
        if (index === 0) {
            carouselRef.current.style.transform = 'translateX(0)';
        } else if (index === images.length - 1) {
            // New calculation for last slide to align to right edge
            const fullWidth = images.length * (slideWidth + margin);
            const offset = fullWidth - 100 + 1; // 16px from right edge
            carouselRef.current.style.transform = `translateX(-${offset}vw)`;
        } else {
            const offset = index * (slideWidth + margin) - viewportCenter + (margin / 2);
            carouselRef.current.style.transform = `translateX(-${offset}vw)`;
        }
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const diff = startX - touch.clientX;

        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < images.length - 1) {
            handleDotClick(currentIndex + 1);
          } else if (diff < 0 && currentIndex > 0) {
            handleDotClick(currentIndex - 1);
          }
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { once: true });
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [currentIndex]);

  return (
    <div className="small-carousel-section">
      <div className="small-carousel" ref={carouselRef}>
        {images.map((image, index) => (
          <div
            key={index}
            className="small-carousel-slide"
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="small-carousel-content">
              <h2>{image.title}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="small-carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`small-carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

