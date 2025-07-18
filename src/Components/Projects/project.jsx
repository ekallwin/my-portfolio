import { useEffect } from "react";
import Dine from "./Project Images/Dine.png";
import Railway from "./Project Images/Railway.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import './project.css';
function Projects() {
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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
    }, 2500);
  };

  return (
    <>
      <Navbar />
      <div className="Projects">
        <h2 id="Projects">Projects</h2>

        <div className="Project">
          <img src={Railway} alt='Railway' className='Pro-img'></img>
          <div className="Project-info">
            <h4>Railway Reservation Site (MERN)</h4>
            <ul>
              <legend>Skills used</legend>
              <li>Node.js</li>
              <li>React.js</li>
              <li>Express.js</li>
              <li>Mongodb</li>
            </ul>
          </div>
          <div className="Project-links">
            <a href="https://github.com/ekallwin/railway_reservation" target="_blank" rel="noopener noreferrer" className="pro-icon" onClick={(e) => handleLinkClick(e, 'https://github.com/ekallwin/railway_reservation', 'Redirecting to GitHub')}>
              <FontAwesomeIcon icon={faGithub} size="xl" />
              <span>GitHub</span>
            </a>
            <a href="https://railway-reservation-frontend.onrender.com" target="_blank" rel="noopener noreferrer" className="pro-icon" onClick={(e) => handleLinkClick(e, 'https://railway-reservation-frontend.onrender.com', 'Redirecting to Live Demo')}>
              <FontAwesomeIcon icon={faLink} size='xl' />
              <span>Live Demo</span>
            </a>
          </div>
        </div>



        <div className="Project">
          <img src={Dine} alt='Dine' className='Pro-img'></img>
          <div className="Project-info">
            <h4>Food ordering website (Front-End)</h4>
            <ul>
              <legend>Skills used</legend>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
          </div>
          <div className="Project-links">
            <a href="https://github.com/ekallwin/Dine" target="_blank" rel="noopener noreferrer" className="pro-icon" onClick={(e) => handleLinkClick(e, 'https://github.com/ekallwin/Dine', 'Redirecting to GitHub')}>
              <FontAwesomeIcon icon={faGithub} size="xl" />
              <span>GitHub</span>
            </a>
            <a href="https://ekallwin-dine.vercel.app/" target="_blank" rel="noopener noreferrer" className="pro-icon" onClick={(e) => handleLinkClick(e, 'https://ekallwin-dine.vercel.app/', 'Redirecting to Live Demo')}>
              <FontAwesomeIcon icon={faLink} size='xl' />
              <span>Live Demo</span>
            </a>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
export default Projects;