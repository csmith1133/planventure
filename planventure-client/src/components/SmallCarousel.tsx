import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import './SmallCarousel.css';

export default function SmallCarousel() {
  const filteredProjects = projects.filter(project => !project.documentationOnly);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);
  const scrollThreshold = 30;

  // --- NEW: always use currentIndexRef to avoid closure bugs ---
  const currentIndexRef = useRef(0);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      const slideWidth = 68;
      const margin = 40 / window.innerWidth * 100;
      const viewportCenter = (100 - slideWidth) / 2;
      if (index === 0) {
        carouselRef.current.style.transform = 'translateX(0)';
      } else if (index === filteredProjects.length - 1) {
        const fullWidth = filteredProjects.length * (slideWidth + margin);
        const offset = fullWidth - 100 + 1;
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
          if (diff > 0 && currentIndexRef.current < filteredProjects.length - 1) {
            handleDotClick(currentIndexRef.current + 1);
          } else if (diff < 0 && currentIndexRef.current > 0) {
            handleDotClick(currentIndexRef.current - 1);
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
  }, [filteredProjects.length]);

  const scrollAccumulatorRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
  
        if (!isScrollingRef.current) {
          // Lock immediately BEFORE expensive work
          isScrollingRef.current = true;
  
          scrollAccumulatorRef.current += e.deltaX;
          const idx = currentIndexRef.current;
  
          if (Math.abs(scrollAccumulatorRef.current) > scrollThreshold) {
            if (scrollAccumulatorRef.current > 0 && idx < filteredProjects.length - 1) {
              handleDotClick(idx + 1);
            } else if (scrollAccumulatorRef.current < 0 && idx > 0) {
              handleDotClick(idx - 1);
            }
            scrollAccumulatorRef.current = 0;
          }
  
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 100);
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
  }, [filteredProjects.length, scrollThreshold]);

  return (
    <div className="small-carousel-section">
      <div className="small-carousel" ref={carouselRef}>
        {filteredProjects.map((project, index) => (
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
        {filteredProjects.map((_, index) => (
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