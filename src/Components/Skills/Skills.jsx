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
import { SiExpress, SiMongodb, SiFirebase } from 'react-icons/si';

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
        { name: 'Firebase', icon: <SiFirebase color="#F5820D" size={60} /> },
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
            { threshold: 0.3, rootMargin: '0px 0px -15% 0px' }
        );

        skillBoxRefs.current.forEach(el => el && observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <Box
            id="Skills"
            ref={skillsRef}
            sx={{
                py: 4,
                px: isMobile ? 2 : 4,
                scrollMarginTop: '85px',
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
                    flexWrap: !isMobile ? 'wrap' : undefined,
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'none',
                    justifyItems: 'center',
                    rowGap: isMobile ? 2 : 5,
                    columnGap: isMobile ? 0 : undefined
                }}
            >
                {skillsData.map((skill, index) => (
                    <Grid
                        key={index}
                        size={!isMobile ? { xs: 4, sm: 6, md: 4 } : undefined}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Tooltip title={skill.name} arrow>
                            <Card
                                ref={el => (skillBoxRefs.current[index] = el)}
                                sx={{
                                    position: 'relative',
                                    width: isMobile ? 85 : 120,
                                    height: isMobile ? 85 : 120,
                                    borderRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    isolation: 'isolate',
                                    overflow: 'hidden',
                                    background: `
                                        radial-gradient(circle at 30% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 24%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0) 60%),
                                        linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 100%)
                                    `,
                                    backdropFilter: 'blur(18px) saturate(160%)',
                                    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                                    border: '1px solid rgba(255,255,255,0.22)',
                                    boxShadow: `
                                        0 8px 24px rgba(0,0,0,0.35),
                                        inset 0 1px 1px rgba(255,255,255,0.35),
                                        inset 0 -6px 12px rgba(255,255,255,0.04),
                                        inset 0 0 14px rgba(255,255,255,0.03)
                                    `,
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease, background 0.35s ease, border-color 0.2s ease',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '8%',
                                        left: '16%',
                                        width: '32%',
                                        height: '16%',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0))',
                                        filter: 'blur(3px)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '100%',
                                        background: 'linear-gradient(200deg, rgba(255,255,255,0) 60%, rgba(255,255,255,0.06) 100%)',
                                        pointerEvents: 'none'
                                    },
                                    '& svg': {
                                        position: 'relative',
                                        zIndex: 2,
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'
                                    },
                                    '&.show': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    },
                                    '&.show:hover': {
                                        transform: 'translateY(-4px) scale(1.12)',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.38)',
                                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease',
                                        boxShadow: `
                                            0 14px 32px rgba(0,0,0,0.4),
                                            inset 0 1px 1px rgba(255,255,255,0.45),
                                            inset 0 -6px 14px rgba(255,255,255,0.05),
                                            inset 0 0 16px rgba(255,255,255,0.05)
                                        `
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