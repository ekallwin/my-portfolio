import React, { useRef, useEffect, useState } from 'react';
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
        { name: 'HTML', percentage: 95, icon: <FaHtml5 color="#e34c26" title="HTML5" size={60} /> },
        { name: 'CSS', percentage: 95, icon: <FaCss3Alt color="#ebebeb" title="CSS3" size={60} /> },
        { name: 'JavaScript', percentage: 75, icon: <FaJs color="#f7df1e" title="JavaScript" size={60} /> },
        { name: 'React.js', percentage: 90, icon: <FaReact color="#61dafb" title="React.js" size={60} /> },
        { name: 'Node.js', percentage: 80, icon: <FaNodeJs color="#3c873a" title="Node.js" size={60} /> },
        { name: 'Express.js', percentage: 80, icon: <SiExpress color="#fff" title="Express.js" size={60} /> },
        { name: 'MongoDB', percentage: 80, icon: <SiMongodb color="#47A248" title="MongoDB" size={60} /> },
        { name: 'Git', percentage: 90, icon: <FaGitAlt color="#f34f29" title="Git" size={60} /> },
        
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const index = skillBoxRefs.current.findIndex(ref => ref === entry.target);
                    if (index !== -1) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        skillBoxRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            skillBoxRefs.current.forEach((el) => {
                if (el) try { observer.unobserve(el); } catch (e) { }
            });
        };
    }, []);

    const getDelayStyle = (index) => ({
        transitionDelay: `${index * 0.08}s`
    });

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
                component="h2"
                align="center"
                gutterBottom
                data-animate
                sx={{ mb: 6, mt: 2, fontFamily: 'serif', color: 'white', fontSize: { xs: '2rem', md: '3rem' } }}
            >
                Technical Skills
            </Typography>

            <Grid
                container
                spacing={isMobile ? 1 : 3}
                sx={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: isMobile ? '100%' : '100%',
                    borderRadius: 8,
                }}
            >
                {skillsData.map((skill, index) => (
                    <Grid
                        item
                        xs={4}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Tooltip title={skill.name} arrow placement="top">
                            <Card
                                className="skill-fade-in"
                                ref={el => {
                                    if (el) skillBoxRefs.current[index] = el;
                                }}
                                style={getDelayStyle(index)}
                                sx={{
                                    padding: '5px',
                                    width: isMobile ? '85px' : '120px',
                                    height: isMobile ? '85px' : '120px',
                                    maxWidth: '320px',
                                    backgroundColor: 'background.paper',
                                    transition: 'all 0.3s ease-in-out',
                                    opacity: 0,
                                    borderRadius: '100%',
                                    transform: 'translateY(20px)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(12px) saturate(160%)',
                                    WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&.show': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            >
                                <Box
                                    className="skill-icon-container"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '4rem',
                                        color: '#fff'
                                    }}
                                >
                                    {skill.icon}
                                </Box>
                            </Card>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Skills;
