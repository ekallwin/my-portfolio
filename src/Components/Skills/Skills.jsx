
import React, { useRef, useEffect, useState } from 'react';
import './Skills.css';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';

const Skills = () => {
    const skillsData = [
        { name: 'HTML/CSS', percentage: 95, icon: <><FaHtml5 color="#e34c26" title="HTML5" size={28} style={{ marginRight: 2 }} /><FaCss3Alt color="#1572B6" title="CSS3" size={28} /></> },
        { name: 'JavaScript', percentage: 75, icon: <FaJs color="#f7df1e" title="JavaScript" size={28} /> },
        { name: 'React.js', percentage: 85, icon: <FaReact color="#61dafb" title="React.js" size={28} /> },
        { name: 'Node.js', percentage: 70, icon: <FaNodeJs color="#3c873a" title="Node.js" size={28} /> },
        { name: 'Express.js', percentage: 70, icon: <SiExpress color="#ffffffff" title="Express.js" size={28} /> },
        { name: 'MongoDB', percentage: 70, icon: <SiMongodb color="#47A248" title="MongoDB" size={28} /> },
        { name: 'Git', percentage: 75, icon: <FaGitAlt color="#f34f29" title="Git" size={28} /> },
    ];

    const [animatedPercentages, setAnimatedPercentages] = useState(skillsData.map(() => 0));
    const skillsRef = useRef(null);
    const skillBoxRefs = useRef([]);
    const animationRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        const index = skillBoxRefs.current.indexOf(entry.target);
                        if (index !== -1) {
                            animatePercentage(index);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillBoxRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            skillBoxRefs.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
            animationRefs.current.forEach(raf => cancelAnimationFrame(raf));
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.3 }
        );

        const skillsElement = skillsRef.current;
        if (skillsElement) {
            observer.observe(skillsElement);
        }

        return () => {
            if (skillsElement) {
                observer.unobserve(skillsElement);
            }
        };
    }, []);

    const animatePercentage = (index) => {
        const duration = 1500;
        const startTime = performance.now();
        const startValue = 0;
        const endValue = skillsData[index].percentage;

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.floor(progress * endValue);

            setAnimatedPercentages(prev => {
                const newPercentages = [...prev];
                newPercentages[index] = currentValue;
                return newPercentages;
            });

            if (progress < 1) {
                animationRefs.current[index] = requestAnimationFrame(animate);
            }
        };

        animationRefs.current[index] = requestAnimationFrame(animate);
    };

    const getDelayStyle = (index) => ({
        transitionDelay: `${index * 0.1}s`
    });

    return (
        <div className="skills-container" id='Skills'>
            <h2>Technical Skills</h2>
            <div className="skills-grid" >
                {skillsData.map((skill, index) => (
                    <div
                        key={index}
                        className="skill-box skill-fade-in"
                        ref={el => {
                            skillBoxRefs.current[index] = el;
                            if (skillsRef) skillsRef.current = el;
                        }}
                        style={getDelayStyle(index)}
                    >
                        <div className="skill-info">
                            <span className="skill-icon">{skill.icon}</span>
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percentage">{animatedPercentages[index]}%</span>
                        </div>
                        <div className="skill-bar">
                            <div
                                className="skill-progress"
                                style={{ width: `${animatedPercentages[index]}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;