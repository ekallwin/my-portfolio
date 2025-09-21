import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// import { toast } from "react-toastify";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import './project.css';

import Railway from "./Project Images/Railway.png";
import Instagram from "./Project Images/Instagram.png";
import Dine from "./Project Images/Dine.png";

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

  const getDelayStyle = (index) => ({
    transitionDelay: `${index * 0.1}s`
  });

  const handleLinkClick = (event, url) => {
    event.preventDefault();
    window.open(url, "_blank", 'noopener,noreferrer,width=800,height=800');
  };

  const handleImageError = (e) => {
    e.target.src = Placeholder;
    e.target.alt = 'Project screenshot not available';
  };

  return (
    <>
      <Navbar />
      <div className="components-container">
        <h2 className="projects-title">Projects</h2>
        <div className="projects-container">
          <div className="projects-list">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card"
                ref={el => projectRefs.current[index] = el}
                style={getDelayStyle(index)}
              >
                <div className="project-image-container">
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="project-image"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>

                  <div className="project-skills">
                    <h3>Technologies Used</h3>
                    <ul className="skills-list">
                      {project.skills.map((skill, index) => (
                        <li key={index} className="skill-item">{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="project-links">
                    <button
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link github-link"
                      onClick={(e) => handleLinkClick(e, project.githubUrl)}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      <span>GitHub</span>
                    </button>

                    <button
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link demo-link"
                      onClick={(e) => handleLinkClick(e, project.demoUrl)}
                      aria-label={`View ${project.title} live demo`}
                    >
                      <FontAwesomeIcon icon={faLink} />
                      <span>Live Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Projects;