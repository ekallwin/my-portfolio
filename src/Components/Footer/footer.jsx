import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faSquareGithub, faSquareXTwitter, faSquareInstagram, faSquareFacebook, faSquareThreads } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import './footer.css';
import moment from 'moment';
import { useScrollToSection } from "./Scroll"
import Isp from '../Isp/Isp';

function Footer() {
  const currentYear = moment().format('YYYY');

  const Facebook = () => {
    window.open('https://www.facebook.com/ekallwin', '_blank');
  };
  const Instagram = () => {
    window.open('https://www.instagram.com/ekallwin', '_blank');
  };
  const Twitter = () => {
    window.open('https://www.twitter.com/ekallwin', '_blank');
  };
  const Threads = () => {
    window.open('https://www.threads.net/@ekallwin', '_blank');
  };
  const LinkedIn = () => {
    window.open('https://www.linkedin.com/in/ekallwin/', '_blank');
  };
  const Github = () => {
    window.open('https://github.com/ekallwin', '_blank');
  };

  const scrollToSection = useScrollToSection();

  return (
    <>
      <footer>
        <div className="footer-content">
          <h4>My social medias</h4>
        </div>
        <div className="footer-text">
          <div className="socials">
            <FontAwesomeIcon icon={faSquareFacebook} className="Social" size="xl" onClick={Facebook} />
            <FontAwesomeIcon icon={faSquareInstagram} className="Social" size="xl" onClick={Instagram} />
            <FontAwesomeIcon icon={faSquareXTwitter} className="Social" size="xl" onClick={Twitter} />
            <FontAwesomeIcon icon={faSquareThreads} className="Social" size="xl" onClick={Threads} />
            <FontAwesomeIcon icon={faLinkedin} className="Social" size="xl" onClick={LinkedIn} />
            <FontAwesomeIcon icon={faSquareGithub} className="Social" size="xl" onClick={Github} />
          </div>

          <div className="footer-copyright">
            {/* <p style={{ fontSize: '12px' }}><Isp /></p> */}
            <p>
              &copy; {currentYear} Created, Developed and maintained by
              <span
                className="about-link"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => scrollToSection("About")}
              >Allwin E K
              </span>
            </p>

          </div>

        </div>
      </footer>
    </>
  )
}
export default Footer;