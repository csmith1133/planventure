import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import './SmallCarousel.css';

export default function SmallCarousel() {
  const navigate = useNavigate();
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
        } else if (index === projects.length - 1) {
            // New calculation for last slide to align to right edge
            const fullWidth = projects.length * (slideWidth + margin);
            const offset = fullWidth - 100 + 1; // 16px from right edge
            carouselRef.current.style.transform = `translateX(-${offset}vw)`;
        } else {
            const offset = index * (slideWidth + margin) - viewportCenter + (margin / 2);
            carouselRef.current.style.transform = `translateX(-${offset}vw)`;
        }
    }
  };

  const handleLearnMore = (projectId: string) => {
    navigate(`/documentation?project=${projectId}`);
  };

  const handleProjectClick = (projectLink: string, isExternal: boolean = false) => {
    if (isExternal) {
      window.open(projectLink, '_blank');
    } else {
      navigate(projectLink);
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
          if (diff > 0 && currentIndex < projects.length - 1) {
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
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="small-carousel-slide"
            style={{ backgroundImage: `url(${project.imageUrl})` }}
          >
            <div className="small-carousel-content">
              <h2>{project.title}</h2>
              <div className="carousel-buttons">
                <button 
                  className="carousel-btn go-to-project"
                  onClick={() => handleProjectClick(project.url, project.isExternal)}
                >
                  Go to Project
                </button>
                <button 
                  className="carousel-btn learn-more"
                  onClick={() => handleLearnMore(project.id)}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="small-carousel-dots">
        {projects.map((_, index) => (
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

