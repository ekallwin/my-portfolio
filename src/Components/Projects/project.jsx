import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import "./project.css";

import Railway from "./Project Images/Railway.png";
import Instagram from "./Project Images/Instagram.png";
import Dine from "./Project Images/Dine.png";

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

const projects = [
  {
    id: 1,
    title: "Railway Reservation Site (MERN)",
    image: Railway,
    alt: "Railway Reservation System Screenshot",
    skills: ["Node.js", "React.js", "Express.js", "MongoDB"],
    githubUrl: "https://github.com/ekallwin/railway_reservation",
    demoUrl: "https://railway-reservation-frontend.onrender.com"
  },
  {
    id: 2,
    title: "Instagram Clone (React.js)",
    image: Instagram,
    alt: "Instagram Clone Screenshot",
    skills: ["React.js", "Vite"],
    githubUrl: "https://github.com/ekallwin/instagram-clone",
    demoUrl: "https://instagram-clone-ekallwin.vercel.app"
  },
  {
    id: 3,
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
      <Navbar />

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
              fontFamily: 'serif',
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
                item
                key={project.id}
                xs={12}
                sm={10}
                md={6}
                lg={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  ref={(el) => (projectRefs.current[index] = el)}
                  className="project-card"
                  sx={{
                    width: "100%",
                    maxWidth: 560,
                    borderRadius: 3,
                    overflow: "visible",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    boxShadow: 6,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 12
                    },
                    ...getDelayStyle(index)
                  }}
                >
                  <CardMedia
                    component="img"
                    image={project.image}
                    alt={project.alt}
                    onError={handleImageError}
                    loading="lazy"
                    sx={{
                      height: { xs: 260, sm: 300 },
                      objectFit: "contain",
                      backgroundColor: "#fff",
                      p: 1,
                      borderRadius: 2
                    }}
                  />


                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {project.title}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
                      Technologies Used
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      flexWrap="wrap"
                      sx={{ gap: 1, mb: 1 }}
                    >
                      {project.skills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          variant="outlined"
                          size="medium"
                          sx={{ fontSize: "0.95rem", px: 1 }}
                        />
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2 },
                      pb: 3,
                      position: "relative",
                      zIndex: 30,
                      flexDirection: { xs: "column", sm: "row" },
                      px: { xs: 2, sm: 0 }
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
                          width: { xs: "100%", sm: "auto" },
                          minWidth: { sm: 140 },
                          px: { xs: 2, sm: 3 }
                        }}
                      >
                        GITHUB
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
                          width: { xs: "100%", sm: "auto" },
                          minWidth: { sm: 140 },
                          px: { xs: 2, sm: 3 }
                        }}
                      >
                        LIVE DEMO
                      </Button>
                    </Tooltip>
                  </CardActions>
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
