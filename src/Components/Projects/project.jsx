import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Footer from "../Footer/footer";
import "./project.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import Railway from "./Project Images/Railway.png";
import Instagram from "./Project Images/Instagram.png";
import Dine from "./Project Images/Dine.png";
import NVSP from './Project Images/Nvsp.png';
import Billing from './Project Images/Billing.png';
const projects = [
  {
    id: 5,
    title: "Billing Management System (MERN)",
    image: Billing,
    alt: "Billing management system Screenshot",
    skills: ["Node.js", "React.js", "Express.js", "Firebase (Auth & Firestore)"],
    githubUrl: "https://github.com/ekallwin/billing-management-system",
    demoUrl: "https://ekallwin-bill-management-system.vercel.app"
  },
  {
    id: 1,
    title: "Voter's Services Portal (MERN)",
    image: NVSP,
    alt: "Voter's Services Portal Screenshot",
    skills: ["Node.js", "React.js", "Express.js", "MongoDB"],
    githubUrl: "https://github.com/ekallwin/nvsp",
    demoUrl: "https://ekallwin-nvsp.vercel.app"
  },
  {
    id: 2,
    title: "Railway Reservation Site (MERN)",
    image: Railway,
    alt: "Railway Reservation System Screenshot",
    skills: ["Node.js", "React.js", "Express.js", "MongoDB"],
    githubUrl: "https://github.com/ekallwin/railway_reservation",
    demoUrl: "https://railway-reservation-frontend.onrender.com"
  },
  {
    id: 3,
    title: "Instagram Clone (React.js)",
    image: Instagram,
    alt: "Instagram Clone Screenshot",
    skills: ["React.js", "Vite", "Rest API"],
    githubUrl: "https://github.com/ekallwin/instagram-clone",
    demoUrl: "https://instagram-clone-ekallwin.vercel.app"
  },
  {
    id: 4,
    title: "Food Ordering Website (Front-End)",
    image: Dine,
    alt: "Food Ordering Website Screenshot",
    skills: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/ekallwin/Dine",
    demoUrl: "https://ekallwin-dine.vercel.app/"
  }
];

function Projects() {
  const projectRefs = useRef([]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    projectRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      projectRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleLinkClick = (event, url) => {
    event.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer,width=900,height=900");
  };

  const handleImageError = (e) => {
    e.target.src = "";
    e.target.alt = "Project screenshot not available";
  };

  const getDelayStyle = (index) => ({
    transitionDelay: `${index * 0.08}s`
  });

  return (
    <>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          minHeight: "100vh",
          py: 4,
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", mt: { md: 0 }, mb: 2 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mt: 7,
              mb: 4,
              fontFamily: 'Times New Roman',
              color: 'white',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Projects
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end"
          }}
        >
          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="flex-end"
            sx={{
              width: "100%",
              pb: { xs: 4, md: 6 },
              px: { xs: 2, md: 0 }
            }}
          >
            {projects.map((project, index) => (
              <Grid
                key={project.id}
                size={{ xs: 12, md: 10 }}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  ref={(el) => (projectRefs.current[index] = el)}
                  className="project-card"
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    background: `
                      linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%),
                      rgba(18, 18, 28, 0.55)
                    `,
                    backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.12)",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 28px 64px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.18)"
                    },
                    ...getDelayStyle(index)
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '100%', md: '45%' },
                      minHeight: { xs: 220, md: 340 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(160deg, #f4f4f8 0%, #e7e7f0 100%)',
                      p: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={project.image}
                      alt={project.alt}
                      onError={handleImageError}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 2,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '55%' }, p: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', textAlign: "left", py: 3, px: { md: 4 } }}>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
                        {project.title}
                      </Typography>

                      <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.6)", mb: 1.5 }}>
                        Technologies Used
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent={{ xs: "flex-start", md: "flex-start" }}
                        flexWrap="wrap"
                        sx={{ gap: 1, mb: 2 }}
                      >
                        {project.skills.map((skill, i) => (
                          <Chip
                            key={i}
                            label={skill}
                            variant="outlined"
                            size="medium"
                            sx={{
                              fontSize: "0.95rem",
                              px: 1,
                              color: '#fff',
                              borderColor: 'rgba(255,255,255,0.3)',
                              background: 'rgba(255,255,255,0.06)',
                              backdropFilter: 'blur(6px)',
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>

                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-start" },
                        alignItems: "center",
                        gap: 2,
                        pb: 3,
                        px: { xs: 2, md: 4 }
                      }}
                    >
                      <Tooltip title="View source on GitHub" arrow>
                        <Button
                          disableRipple
                          variant="contained"
                          color="primary"
                          size="medium"
                          startIcon={<FontAwesomeIcon icon={faGithub} />}
                          onClick={(e) => handleLinkClick(e, project.githubUrl)}
                          aria-label={`Open ${project.title} on GitHub`}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 10,
                            whiteSpace: "nowrap",
                            minWidth: 120,
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
                          }}
                        >
                          GitHub
                        </Button>
                      </Tooltip>

                      <Tooltip title="Open live demo" arrow>
                        <Button
                          disableRipple
                          variant="contained"
                          color="secondary"
                          size="medium"
                          startIcon={<FontAwesomeIcon icon={faLink} />}
                          onClick={(e) => handleLinkClick(e, project.demoUrl)}
                          aria-label={`Open live demo of ${project.title}`}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 10,
                            whiteSpace: "nowrap",
                            minWidth: 120,
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
                          }}
                        >
                          Live Demo
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Footer />
    </>
  );
}

export default Projects;