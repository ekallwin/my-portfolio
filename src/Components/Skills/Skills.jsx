import React, { useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    Tooltip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';

const Skills = () => {
    const skillsRef = useRef(null);
    const skillBoxRefs = useRef([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const skillsData = [
        { name: 'HTML', icon: <FaHtml5 color="#e34c26" size={60} /> },
        { name: 'CSS', icon: <FaCss3Alt color="#2965F1" size={60} /> },
        { name: 'JavaScript', icon: <FaJs color="#f7df1e" size={60} /> },
        { name: 'React.js', icon: <FaReact color="#61dafb" size={60} /> },
        { name: 'Node.js', icon: <FaNodeJs color="#3c873a" size={60} /> },
        { name: 'Express.js', icon: <SiExpress color="#fff" size={60} /> },
        { name: 'MongoDB', icon: <SiMongodb color="#47A248" size={60} /> },
        { name: 'Git', icon: <FaGitAlt color="#f34f29" size={60} /> }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        skillBoxRefs.current.forEach(el => el && observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <Box
            id="Skills"
            ref={skillsRef}
            sx={{
                py: 8,
                px: isMobile ? 2 : 4,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Typography
                variant="h2"
                align="center"
                sx={{
                    mb: 6,
                    fontFamily: 'serif',
                    color: 'white',
                    fontSize: { xs: '2rem', md: '3rem' }
                }}
            >
                Technical Skills
            </Typography>

            <Grid
                container={!isMobile}
                spacing={isMobile ? 0 : 3}
                justifyContent="center"
                sx={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    display: isMobile ? 'grid' : 'flex',
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'none',
                    justifyItems: 'center',
                    rowGap: isMobile ? 2 : 0
                }}
            >
                {skillsData.map((skill, index) => (
                    <Grid
                        key={index}
                        item={!isMobile}
                        xs={4}
                        sm={6}
                        md={4}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Tooltip title={skill.name} arrow>
                            <Card
                                ref={el => (skillBoxRefs.current[index] = el)}
                                sx={{
                                    width: isMobile ? 85 : 120,
                                    height: isMobile ? 85 : 120,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: 'all 0.1s ease',
                                    '&.show': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    },
                                    '&.show:hover': {
                                        transform: 'translateY(0) scale(1.12)',
                                        cursor: 'pointer'
                                    }
                                }}

                            >
                                {skill.icon}
                            </Card>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Skills;
