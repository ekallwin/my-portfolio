import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import { slides } from "./Data";
import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Achievements = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const hideTimeout = useRef(null);
  const autoplayInterval = useRef(null);

  const slide = slides[currentIndex] || {};
  const { caption = "", clickhere = "" } = slide;

  const [rankNo, ...captionParts] = caption.split(" ");

  let rank = rankNo;

  if (rankNo === "1st") {
    rank = (
      <>
        1<sup>st</sup>
      </>
    );
  } else if (rankNo === "2nd") {
    rank = (
      <>
        2<sup>nd</sup>
      </>
    );
  } else if (rankNo === "3rd") {
    rank = (
      <>
        3<sup>rd</sup>
      </>
    );
  }

  const captionText = captionParts.join(" ");

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

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

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
              fontFamily: "Times New Roman",
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
                borderRadius: 3,
                background: `
                  linear-gradient(
                    160deg,
                    rgba(255,255,255,0.08) 0%,
                    rgba(255,255,255,0.02) 50%,
                    rgba(255,255,255,0.05) 100%
                  ),
                  rgba(18, 18, 28, 0.5)
                `,
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.12)",
                p: 1.5,
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
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundColor: "#f4f4f8",
                }}
              >
                {slides.map((s, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={s.image}
                    alt={s.caption || `Slide ${index + 1}`}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 600ms ease",
                      opacity: index === currentIndex ? 1 : 0,
                      pointerEvents:
                        index === currentIndex ? "auto" : "none",
                      userSelect: "none",
                    }}
                  />
                ))}

                {showControls && (
                  <>
                    <IconButton
                      disableRipple
                      aria-label="Previous slide"
                      onClick={prevSlide}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(20,20,30,0.45)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#fff",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.25)",
                        transition:
                          "background 0.25s ease, transform 0.25s ease",
                        "&:hover": {
                          bgcolor: "rgba(20,20,30,0.65)",
                          transform: "translateY(-50%) scale(1.08)",
                        },
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>

                    <IconButton
                      disableRipple
                      aria-label="Next slide"
                      onClick={nextSlide}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(20,20,30,0.45)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#fff",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.25)",
                        transition:
                          "background 0.25s ease, transform 0.25s ease",
                        "&:hover": {
                          bgcolor: "rgba(20,20,30,0.65)",
                          transform: "translateY(-50%) scale(1.08)",
                        },
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
                        border: "1px solid rgba(255,255,255,0.3)",
                        padding: 0,
                        cursor: "pointer",
                        backgroundColor:
                          idx === currentIndex
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(255,255,255,0.2)",
                        boxShadow:
                          idx === currentIndex
                            ? "0 0 8px rgba(255,255,255,0.5)"
                            : "none",
                        transition:
                          "transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease",
                        transform:
                          idx === currentIndex ? "scale(1)" : "scale(0.75)",
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
                    color: "#fff",
                  }}
                >
                  {rank} {captionText}
                </Typography>

                {clickhere && (
                  <Box
                    component="a"
                    href={clickhere}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mt: 2,
                      px: { xs: 3, sm: 3.5 },
                      py: 1.25,
                      minHeight: 44,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: { xs: "auto", md: 0 },
                      borderRadius: 2.5,
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "0.2px",
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      boxShadow:
                        "0 6px 18px rgba(102,126,234,0.3), inset 0 1px 1px rgba(255,255,255,0.35)",
                      transition:
                        "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "none",
                        transform: "translateY(-2px)",
                        filter: "brightness(1.08)",
                        boxShadow:
                          "0 9px 24px rgba(102,126,234,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                      "&:visited": {
                        color: "#fff",
                      },
                      "&:focus": {
                        outline: "none",
                        textDecoration: "none",
                      },
                    }}
                  >
                    Learn more
                  </Box>
                )}
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