import React, { useRef, useEffect, useState } from 'react';
import './Skills.css';

const Skills = () => {
    const skillsData = [
        { name: 'HTML/CSS', percentage: 95 },
        { name: 'JavaScript', percentage: 75 },
        { name: 'React.js', percentage: 85 },
        { name: 'Node.js', percentage: 70 },
        { name: 'Express.js', percentage: 70 },
        { name: 'MongoDB', percentage: 70 },
        { name: 'Git', percentage: 75 },
    ];

    const [animatedPercentages, setAnimatedPercentages] = useState(skillsData.map(() => 0));
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
            { threshold: 0.1 }
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
            <div className="skills-grid">
                {skillsData.map((skill, index) => (
                    <div
                        key={index}
                        className="skill-box"
                        ref={el => skillBoxRefs.current[index] = el}
                        style={getDelayStyle(index)}
                    >
                        <div className="skill-info">
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