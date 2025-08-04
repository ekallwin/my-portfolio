import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
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
    demoUrl: "https://railway-reservation-frontend.onrender.com",
    githubMessage: "Redirecting to Railway Reservation GitHub",
    demoMessage: "Redirecting to Railway Reservation Live Demo"
  },
  {
    id: 2,
    title: "Instagram Clone (React.js)",
    image: Instagram,
    alt: "Instagram Clone Screenshot",
    skills: ["React.js", "Vite"],
    githubUrl: "https://github.com/ekallwin/instagram-clone",
    demoUrl: "https://instagram-clone-ekallwin.vercel.app",
    githubMessage: "Redirecting to Instagram Clone GitHub",
    demoMessage: "Redirecting to Instagram Clone Live Demo"
  },
  {
    id: 3,
    title: "Food Ordering Website (Front-End)",
    image: Dine,
    alt: "Food Ordering Website Screenshot",
    skills: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/ekallwin/Dine",
    demoUrl: "https://ekallwin-dine.vercel.app/",
    githubMessage: "Redirecting to Dine GitHub",
    demoMessage: "Redirecting to Dine Live Demo"
  }
];

function Projects() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLinkClick = (event, url, message) => {
    event.preventDefault();
    toast.info(message, {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 2000);
  };

  const handleImageError = (e) => {
    e.target.src = Placeholder;
    e.target.alt = 'Project screenshot not available';
  };

  return (
    <>
      <Navbar />

      <h2 className="projects-title">Projects</h2>
      <div className="projects-container">
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
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
                    onClick={(e) => handleLinkClick(e, project.githubUrl, project.githubMessage)}
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
                    onClick={(e) => handleLinkClick(e, project.demoUrl, project.demoMessage)}
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
      <Footer />
    </>
  );
}

export default Projects;