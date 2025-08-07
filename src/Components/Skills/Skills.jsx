import React, { useRef, useEffect } from 'react';
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

    const skillBoxRefs = useRef([]);

    useEffect(() => {
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

        skillBoxRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            skillBoxRefs.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

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
                            <span className="skill-percentage">{skill.percentage}%</span>
                        </div>
                        <div className="skill-bar">
                            <div
                                className="skill-progress"
                                style={{ width: `${skill.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;