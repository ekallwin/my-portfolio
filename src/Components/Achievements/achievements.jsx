import React, { useState, useEffect, useRef } from "react";
import './achievements.css';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/footer';
import { slides } from './Data';
import { Carousel, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

const Achievements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef(null);
  const hideTimeout = useRef(null);
  const event_name = slides[currentIndex]?.event_name || "";
  const college_name = slides[currentIndex]?.college_name || "";
  const college_place = slides[currentIndex]?.college_place || "";
  const rank_no = slides[currentIndex]?.rank_no || "";
  let sup = null;
  if (rank_no === "1" || rank_no === 1) sup = <sup>st</sup>;
  else if (rank_no === "2" || rank_no === 2) sup = <sup>nd</sup>;
  else if (rank_no === "3" || rank_no === 3) sup = <sup>rd</sup>;
  const rank = <>{rank_no}{sup}</>;

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const togglePlay = () => {
    if (!carouselRef.current) return;
    const carouselNode = carouselRef.current;
    if (isPlaying) {
      window.bootstrap.Carousel.getInstance(carouselNode)?.pause();
    } else {
      window.bootstrap.Carousel.getInstance(carouselNode)?.cycle();
    }
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="components-container">
        <h2 id="achievments" className="projects-title">Achievements</h2>
        <Container>
          <div className="carousel-wrapper">
            <Carousel
              ref={carouselRef}
              activeIndex={currentIndex}
              onSelect={handleSelect}
              interval={5000}
              className="custom-carousel"
              indicators={false}
              nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
              prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
              onMouseMove={() => !isMobile && showControlsTemporarily()}
            >
              {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    onTouchStart={() => isMobile && showControlsTemporarily()}
                  />
                  {showControls && (
                    <button
                      className="pause-play-btn"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                    >
                      {isPlaying ? (
                        <FontAwesomeIcon icon={faPause} />
                      ) : (
                        <FontAwesomeIcon icon={faPlay} />
                      )}
                    </button>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
            <div className="custom-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`custom-indicator ${index === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    showControlsTemporarily();
                  }}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="custom-caption">
              <p>{rank} prize in {event_name} at {college_name}, {college_place}</p>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Achievements;
