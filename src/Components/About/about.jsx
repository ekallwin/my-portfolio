import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar, Button, Chip, Stack } from '@mui/material';
import Allwin from "./Images/Allwin.jpg";
import { useTheme } from '@mui/material/styles';
import toast from 'react-hot-toast';
import { FaDownload, FaCircleCheck, FaSpinner, FaGithub, FaLinkedin } from 'react-icons/fa6';
import './about.css';
import { scale } from 'motion';

function About() {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const hasDownloadedRef = useRef(false);
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
    if (hasDownloadedRef.current) {
      toast.error("You've already initiated the resume download. Please check your Downloads folder!", { duration: 5000 });
      return;
    }
    hasDownloadedRef.current = true;
    setButtonText(<>Download Processing <FaSpinner className="spinning" style={{ fontSize: '1em', marginLeft: 6 }} /></>);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/Resume.pdf';
      link.download = 'Resume.pdf';

      const handleClick = () => {
        setTimeout(() => {
          toast.success('The resume has been downloaded!', { duration: 6000 });
          setButtonText(<>Download Successful <FaCircleCheck style={{ fontSize: '1em', marginLeft: 6 }} /></>);
        }, 500);
      };

      link.addEventListener('click', handleClick, { once: true });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const skills = [
    'HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js',
    'MongoDB', 'Git', 'Bootstrap', 'Material-UI'
  ];

  return (
    <Box id="About" ref={sectionRef} sx={{ minHeight: '100vh',  }}>
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
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px) saturate(160%)',
            WebkitBackdropFilter: 'blur(12px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease',
            color: '#eee',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
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

                <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                  <a
                    href="https://github.com/ekallwin"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    style={{ color: '#fff', fontSize: 26, display: 'inline-flex', alignItems: 'center' }}
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ekallwin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    style={{ color: '#ffffff', fontSize: 26, display: 'inline-flex', alignItems: 'center' }}
                  >
                    <FaLinkedin />
                  </a>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography paragraph className="animate-child" data-animate>
                  I am <b>Allwin E K</b>, a passionate <strong>Web Developer</strong> with a solid foundation in front-end technologies.
                  I love creating user-friendly and responsive interfaces that deliver excellent user experiences.
                </Typography>

                <Typography paragraph className="animate-child" data-animate>
                  Currently pursuing <strong>B.E</strong> in <strong>Computer Science and Engineering</strong> at
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
                        background: 'rgba(255, 255, 255, 0.2)',
                        textAlign: 'center',
                        padding: '5px 10px',
                        borderRadius: '50',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',

                        },
                      }}
                    />
                  ))}
                </Stack>

                <Button
                  disableRipple
                  variant="contained"
                  onClick={handleDownload}
                  className="animate-child buttons"
                  data-animate
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 3,
                    color: 'white',
                    mx: { xs: 'auto', md: 0 },
                    display: { xs: 'block', md: 'inline-flex' },
                    // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default About;
