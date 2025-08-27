import React, { useState, useEffect, useRef } from "react";
import './achievements.css';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/footer';
import { slides } from './Slides';

const Achievements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
    startTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
    startTimer();
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    startTimer();
  };

  const handlePause = () => {
    setIsPaused(true);
    stopTimer();
  };

  const handleResume = () => {
    setIsPaused(false);
    startTimer();
  };

  return (
    <>
      <Navbar />
      <div className="components-container">
        <h2 id="achievments">Achievements</h2>

        <div
          className="custom-carousel"
          onMouseDown={handlePause}
          onMouseUp={handleResume}
          onMouseLeave={handleResume}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          <button
            className="custom-prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            ❮
          </button>

          <div
            className="custom-carousel-slide"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="custom-carousel-item">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onContextMenu={(e) => e.preventDefault()} draggable="false" 
                />
              </div>
            ))}
          </div>

          <button
            className="custom-next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            ❯
          </button>
        </div>

        <div className="custom-carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`custom-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>

        <div className="custom-carousel-caption">
          <p>{slides[currentIndex].caption}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Achievements;