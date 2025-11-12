import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import { slides } from "./Data";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Achievements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const hideTimeout = useRef(null);
  const autoplayInterval = useRef(null);

  const slide = slides[currentIndex] || {};
  const { event_name = "", college_name = "", college_place = "", rank_no = "" } = slide;

  let sup = null;
  if (rank_no === "1" || rank_no === 1) sup = <sup>st</sup>;
  else if (rank_no === "2" || rank_no === 2) sup = <sup>nd</sup>;
  else if (rank_no === "3" || rank_no === 3) sup = <sup>rd</sup>;
  const rank = (
    <>
      {rank_no}
      {sup}
    </>
  );

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
      autoplayInterval.current = null;
    }

    if (isPlaying && slides.length > 1) {
      autoplayInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (autoplayInterval.current) {
        clearInterval(autoplayInterval.current);
        autoplayInterval.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };
  }, []);

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    showControlsTemporarily();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    showControlsTemporarily();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    showControlsTemporarily();
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
    showControlsTemporarily();
  };

  const smallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "transparent",
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          textAlign: "center",
          mt: { md: 0 },
          mb: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mt: 5,
              mb: 4,
              fontFamily: "serif",
              color: "white",
              fontSize: { xs: "2rem", md: "3rem" },
            }}
            id="achievements"
          >
            Achievements
          </Typography>

          <Container maxWidth="md">
            <Box
              className="carousel-wrapper"
              sx={{
                mb: 6,
                position: "relative",
                width: "100%",
                maxWidth: 1500,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#fff",
                p: 0,
              }}
              onMouseMove={() => !isMobile && showControlsTemporarily()}
              onTouchStart={() => isMobile && showControlsTemporarily()}
            >
              <Box
                sx={{
                  width: "100%",
                  height: smallScreen ? "180px" : "410px",
                  position: "relative",
                  display: "block",
                  backgroundColor: "#fff",
                }}
              >
                {slides.map((s, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={s.image}
                    alt={s.event_name || `Slide ${index + 1}`}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 600ms ease",
                      opacity: index === currentIndex ? 1 : 0,
                      pointerEvents: index === currentIndex ? "auto" : "none",
                      userSelect: "none",
                    }}
                  />
                ))}

                {showControls && (
                  <>
                    <IconButton
                      aria-label="Previous slide"
                      onClick={prevSlide}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Next slide"
                      onClick={nextSlide}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  py: 2.5,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 0.5, sm: 0.5 },
                    mb: 1.5,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: { xs: 24, sm: 20 },
                  }}
                >
                  {slides.map((_, idx) => (
                    <Box
                      key={idx}
                      component="button"
                      onClick={() => handleIndicatorClick(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      sx={{
                        width: { xs: 18, sm: 14 },
                        height: { xs: 18, sm: 14 },
                        borderRadius: "50%",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        backgroundColor: idx === currentIndex ? "grey" : "grey.400",
                        transition: "transform 200ms ease, background-color 200ms ease",
                        transform: idx === currentIndex ? "scale(1)" : "scale(0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        verticalAlign: "middle",
                        willChange: "transform",
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    fontWeight: 500,
                    color: "black",
                  }}
                >
                  {rank} prize in {event_name} at {college_name}, {college_place}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Achievements;
