import React, { useRef, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    LinearProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';

const Skills = () => {
    const skillsData = [
        { name: 'HTML/CSS', percentage: 95, icon: <><FaHtml5 color="#e34c26" title="HTML5" size={28} style={{ marginRight: 2 }} /><FaCss3Alt color="#1572B6" title="CSS3" size={28} /></> },
        { name: 'JavaScript', percentage: 75, icon: <FaJs color="#f7df1e" title="JavaScript" size={28} /> },
        { name: 'React.js', percentage: 85, icon: <FaReact color="#61dafb" title="React.js" size={28} /> },
        { name: 'Node.js', percentage: 70, icon: <FaNodeJs color="#3c873a" title="Node.js" size={28} /> },
        { name: 'Express.js', percentage: 70, icon: <SiExpress color="#000" title="Express.js" size={28} /> },
        { name: 'MongoDB', percentage: 70, icon: <SiMongodb color="#47A248" title="MongoDB" size={28} /> },
        { name: 'Git', percentage: 75, icon: <FaGitAlt color="#f34f29" title="Git" size={28} /> },
    ];

    const [animatedPercentages, setAnimatedPercentages] = useState(skillsData.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(skillsData.map(() => false));

    const skillsRef = useRef(null);
    const skillBoxRefs = useRef([]);
    const animationRefs = useRef([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const index = skillBoxRefs.current.findIndex(ref => ref === entry.target);
                    if (index === -1) {
                        observer.unobserve(entry.target);
                        return;
                    }

                    if (!hasAnimated[index]) {
                        entry.target.classList.add("show");
                        animatePercentage(index);
                    }

                    observer.unobserve(entry.target);
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
            animationRefs.current.forEach(raf => raf && cancelAnimationFrame(raf));
        };
    }, []);

    const animatePercentage = (index) => {
        if (hasAnimated[index]) return;

        const duration = 1800;
        const startTime = performance.now();
        const endValue = skillsData[index].percentage;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(easeOutQuart * endValue);

            setAnimatedPercentages(prev => {
                if (prev[index] === currentValue) return prev;
                const copy = [...prev];
                copy[index] = currentValue;
                return copy;
            });

            if (progress < 1) {
                animationRefs.current[index] = requestAnimationFrame(step);
            } else {
                setHasAnimated(prev => {
                    const copy = [...prev];
                    copy[index] = true;
                    return copy;
                });
                animationRefs.current[index] = null;
            }
        };

        animationRefs.current[index] = requestAnimationFrame(step);
    };

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
                spacing={3}
                sx={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    justifyContent: 'center',
                    width: isMobile ? '320px' : '100%',
                    borderRadius: 8,
                }}
            >
                {skillsData.map((skill, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Card
                            className="skill-fade-in"
                            ref={el => {
                                if (el) skillBoxRefs.current[index] = el;
                            }}
                            style={getDelayStyle(index)}
                            sx={{
                                p: 3,
                                width: isMobile ? '320px' : '500px',
                                maxWidth: '320px',
                                backgroundColor: 'background.paper',
                                transition: 'all 0.3s ease-in-out',
                                opacity: 0,
                                borderRadius: 2,
                                transform: 'translateY(20px)',
                                '&.show': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                },
                                '&:hover': {
                                    transform: isMobile ? 'none' : 'translateY(-5px)',
                                    boxShadow: isMobile ? 2 : 6
                                }
                            }}
                        >
                            <Box
                                className="skill-info"
                                title={skill.name}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    {skill.icon}
                                </Box>
                                <Typography
                                    variant="h6"
                                    component="span"
                                    sx={{
                                        flexGrow: 1,
                                        fontWeight: 'medium',
                                        color: 'text.primary'
                                    }}
                                >
                                    {skill.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'primary.main',
                                        minWidth: '48px',
                                        textAlign: 'right'
                                    }}
                                >
                                    {animatedPercentages[index]}%
                                </Typography>
                            </Box>

                            <Box className="skill-bar" sx={{ width: '100%' }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={animatedPercentages[index]}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'grey.800',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            transition: 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }
                                    }}
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Skills;
