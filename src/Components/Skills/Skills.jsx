import React from 'react';
import './Skills.css';

const Skills = () => {
    const skillsData = [
        { name: 'JavaScript', percentage: 80 },
        { name: 'React', percentage: 85 },
        { name: 'Node.js', percentage: 75 },
        { name: 'Express.js', percentage: 75 },
        { name: 'MongoDB', percentage: 70 },
        { name: 'HTML/CSS', percentage: 95 },
    ];

    return (
        <>
            <div className="skills-container">
                <h2 >Technical Skills</h2>
                <div className="skills-grid">
                    {skillsData.map((skill, index) => (
                        <div key={index} className="skill-box">
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
        </>
    );
};

export default Skills;