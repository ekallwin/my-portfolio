import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar, Button, Chip, Stack, Modal, Backdrop, Fade } from '@mui/material';
import Allwin from "./Images/Allwin.jpg";
import { useTheme } from '@mui/material/styles';
import { toast } from '../GlassNotification/glass-notification';
import { FaDownload, FaCircleCheck, FaSpinner, FaGithub, FaLinkedin } from 'react-icons/fa6';
import GreenTickSuccess from '../Contact/Component/Success.jsx';
import LinearDeterminate from '../Contact/Component/Progress.jsx';
import './about.css';
import { scale } from 'motion';

function About() {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState(
    <>Download Resume <FaDownload style={{ fontSize: '1em', marginLeft: 6 }} /></>
  );

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const targets = Array.from(container.querySelectorAll('[data-animate]'));

    const baseDelay = 0.08;
    const duration = 0.75;

    targets.forEach((el, i) => {
      const delay = (i * baseDelay).toFixed(2) + 's';
      el.style.setProperty('--delay', delay);
      el.style.setProperty('--duration', `${duration}s`);
      if (!el.classList.contains('animate-child')) el.classList.add('animate-child');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach(t => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    if (hasDownloaded) {
      toast.error("You've already initiated the resume download. Please check your Downloads folder!", { duration: 5000 });
      return;
    }
    setHasDownloaded(true);
    setIsDownloading(true);
  };

  const handleDownloadComplete = () => {
    const link = document.createElement('a');
    link.href = '/Resume.pdf';
    link.download = 'Allwin E K - Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
    setIsModalOpen(true);
    setButtonText(<>Resume Downloaded <FaCircleCheck style={{ fontSize: '1em', marginLeft: 6 }} /></>);
  };

  const skills = [
    'HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js',
    'MongoDB', 'Git', 'Bootstrap', 'Material-UI'
  ];

  return (
    <>
      <Box id="About" ref={sectionRef} sx={{ minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            className="animate-child heading"
            data-animate
            sx={{
              mb: 6,
              mt: 2,
              fontFamily: 'serif',
              color: 'white',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            About Me
          </Typography>

          <Card
            sx={{
              maxWidth: 900,
              mx: 'auto',
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              position: 'relative',
              background: `
                linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%),
                rgba(18, 18, 28, 0.5)
              `,
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              color: '#eee',
              '&:hover': {
                boxShadow: '0 24px 56px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
                transform: 'translateY(-2px)',
              },
            }}
            className="animate-child"
            data-animate
          >

            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                <Box
                  className="animate-child"
                  data-animate
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    color: 'white',
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: '50%',
                      p: '6px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: 'inline-block'
                    }}
                  >
                    <Avatar
                      src={Allwin}
                      alt="Allwin E K"
                      sx={{
                        width: 200,
                        height: 200,
                        display: 'block',
                        borderRadius: '100%',
                        backgroundColor: '#fff',
                        userSelect: 'none'
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable="false"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box
                      component="a"
                      href="https://github.com/ekallwin"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 22,
                        textDecoration: 'none',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.25)',
                        transition: 'transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.08)',
                          background: 'rgba(255,255,255,0.14)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 6px 16px rgba(0,0,0,0.35)',
                        },
                      }}
                    >
                      <FaGithub />
                    </Box>
                    <Box
                      component="a"
                      href="https://www.linkedin.com/in/ekallwin/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 22,
                        textDecoration: 'none',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.25)',
                        transition: 'transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.08)',
                          background: 'rgba(255,255,255,0.14)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 6px 16px rgba(0,0,0,0.35)',
                        },
                      }}
                    >
                      <FaLinkedin />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography paragraph className="animate-child" data-animate>
                    I am <b>Allwin E K</b>, a passionate <strong>Web Developer</strong> with a solid foundation in front-end technologies.
                    I love creating user-friendly and responsive interfaces that deliver excellent user experiences.
                  </Typography>

                  <Typography paragraph className="animate-child" data-animate>
                    Studied <strong>B.E</strong> in <strong>Computer Science and Engineering</strong> at
                    <strong> Ponjesly College of Engineering, Nagercoil</strong>.
                  </Typography>

                  <Typography paragraph className="animate-child" data-animate>
                    I strongly believe in continuous learning and improving myself, so I try to learn in any situation possible.
                  </Typography>

                  <Typography variant="h6" gutterBottom className="animate-child" data-animate>
                    Technologies I Work With:
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {skills.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        className="animate-child"
                        data-animate
                        sx={{
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          textAlign: 'center',
                          padding: '5px 10px',
                          borderRadius: '50',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            background: 'rgba(255, 255, 255, 0.14)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.25)',

                          },
                        }}
                      />
                    ))}
                  </Stack>

                  {isDownloading ? (
                    <Box sx={{ mt: 3, width: '100%', maxWidth: 300, mx: { xs: 'auto', md: 0 } }}>
                      <LinearDeterminate onComplete={handleDownloadComplete} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, display: 'block', textAlign: 'center' }}>
                        Downloading...
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      disableRipple
                      variant="contained"
                      onClick={handleDownload}
                      className={`buttons ${!hasDownloaded ? 'animate-child' : ''}`}
                      data-animate={!hasDownloaded ? true : undefined}
                      sx={{
                        mt: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 3,
                        color: 'white',
                        mx: { xs: 'auto', md: 0 },
                        display: { xs: 'block', md: 'inline-flex' },
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.85), rgba(118,75,162,0.85))',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        boxShadow: '0 8px 24px rgba(102,126,234,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          background: 'linear-gradient(135deg, rgba(102,126,234,0.95), rgba(118,75,162,0.95))',
                          boxShadow: '0 10px 28px rgba(102,126,234,0.45), inset 0 1px 1px rgba(255,255,255,0.5)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {buttonText}
                    </Button>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          setIsModalOpen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              background: 'rgba(20, 20, 30, 0.75)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 3,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
              p: 4,
              width: { xs: "90%", sm: 450 },
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ mb: 2, color: 'success.main', display: 'flex', justifyContent: 'center' }}>
              <GreenTickSuccess size={100} />
            </Box>

            <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 1, color: '#fff' }}>
              Resume downloaded !
            </Typography>

            <Typography variant="body2" textAlign="justify" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              My resume has been successfully downloaded in your device. Kindly check in your downloaded file named as <strong>"Allwin E K - Resume.pdf"</strong>
            </Typography>

            <Button
              onClick={() => setIsModalOpen(false)}
              variant="contained"
              disableRipple

              sx={{
                mt: 1,
                px: 4,
                py: 1,
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: 'none',
                color: '#fff',
                background: 'linear-gradient(135deg, rgba(102,126,234,0.85), rgba(118,75,162,0.85))',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 8px 24px rgba(102,126,234,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.95), rgba(118,75,162,0.95))',
                  boxShadow: '0 10px 28px rgba(102,126,234,0.45), inset 0 1px 1px rgba(255,255,255,0.5)',
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default About;