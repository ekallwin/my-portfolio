import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faSquareGithub, faSquareXTwitter, faSquareInstagram, faSquareFacebook, faSquareThreads } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import './footer.css';
import moment from 'moment';

function Footer() {
  const currentYear = moment().format('YYYY');
  
  const Facebook = () => {
    toast.info('Redirecting to Facebook', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://www.facebook.com/ekallwin', '_blank');
    }, 2500);
  };
  const Instagram = () => {
    toast.info('Redirecting to Instagram', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://www.instagram.com/ekallwin', '_blank');
    }, 2500);
  };
  const Twitter = () => {
    toast.info('Redirecting to X (Twitter)', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://www.twitter.com/ekallwin', '_blank');
    }, 2500);
  };
  const Threads = () => {
    toast.info('Redirecting to Threads (by Instagram)', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://www.threads.net/@ekallwin', '_blank');
    }, 2500);
  };
  const LinkedIn = () => {
    toast.info('Redirecting to LinkedIn', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://www.linkedin.com/in/ekallwin/', '_blank');
    }, 2500);
  };
  const Github = () => {
    toast.info('Redirecting to GitHub', {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setTimeout(() => {
      window.open('https://github.com/ekallwin', '_blank');
    }, 2500);
  };

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
            <p>&copy; {currentYear} Created, Developed and maintained by <a href="#About">Allwin E K</a></p>
          </div>
        </div>
      </footer>
    </>
  )
}
export default Footer;