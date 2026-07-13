import React, { useState, useEffect, useRef } from 'react';
import './Education.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import Footer from '../Footer/footer';

const Education = () => {
    const [educationData, setEducationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const educationRef = useRef(null);

    useEffect(() => {
        fetch('/education.json')
            .then((response) => response.json())
            .then((data) => {
                setEducationData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching education data:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || educationData.length === 0) return;

        const container = educationRef.current;
        if (!container) return;

        const targets = Array.from(container.querySelectorAll('[data-animate]'));

        const baseDelay = 0.08;
        const duration = 0.75;

        targets.forEach((el, i) => {
            const delay = (i * baseDelay).toFixed(2) + 's';
            el.style.setProperty('--delay', delay);
            el.style.setProperty('--duration', `${duration}s`);
            if (!el.classList.contains('animate-child')) el.classList.add('animate-child');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
        );

        targets.forEach(t => observer.observe(t));

        return () => observer.disconnect();
    }, [loading, educationData]);

    if (loading) {
        return <div className="text-center text-white mt-5">Loading education details...</div>;
    }

    return (
        <>
            <Container ref={educationRef} className="education-section mt-5 pt-3">
                <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    data-animate
                    sx={{
                        fontWeight: 700,
                        mt: 3,
                        mb: 4,
                        fontFamily: 'Times New Roman',
                        color: "white",
                        fontSize: { xs: "2rem", md: "3rem" },
                    }}
                >
                    Education
                </Typography>
                <div className="education-timeline">
                    {educationData.map((edu, index) => (
                        <div key={index} className="education-card-wrapper" data-animate>
                            <Card className="education-card custom-card">
                                <Row className="g-0 align-items-center">
                                    <Col md={3} className="text-center p-3">
                                        <div className="edu-img-container">
                                            <Card.Img
                                                src={edu.image}
                                                alt={edu.institution}
                                                className="edu-img"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={9}>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                                                    <Card.Title className="edu-degree mb-1" style={{ fontFamily: 'Times New Roman' }}>{edu.course}</Card.Title>
                                                    <Card.Subtitle className="edu-institution mb-2">{edu.institution}</Card.Subtitle>
                                                    {edu.university && <Card.Text className="edu-uni mb-2">{edu.university}</Card.Text>}
                                                </div>
                                                <div className="edu-year-badge" style={{ flexShrink: 0 }}>
                                                    <span>{edu.year}</span>
                                                </div>
                                            </div>
                                            <Card.Text className="edu-percentage mt-3">
                                                <strong>Score:</strong> {edu.percentage}
                                            </Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default Education;
