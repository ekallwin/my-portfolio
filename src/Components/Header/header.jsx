import Typewriter from './Typewriter';
import { useEffect, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import './header.css';
import moment from 'moment';
import ShinyText from '../ShinyText/ShinyText';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Tooltip from "@mui/material/Tooltip";


function Header() {
  const theme = useTheme();
  const buttonRef = useRef(null);

  const LinkedIn = () => {
    window.open('https://www.linkedin.com/in/ekallwin/', '_blank');
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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

    const buttonElement = buttonRef.current;

    if (buttonElement) {
      observer.observe(buttonElement);
    }

    return () => {
      if (buttonElement) {
        observer.unobserve(buttonElement);
      }
    };
  }, []);

  const currentHour = moment().hour();

  let greeting = '';
  if (currentHour >= 0 && currentHour < 12) {
    greeting = 'Morning';
  } else if (currentHour >= 12 && currentHour < 16) {
    greeting = 'Afternoon';
  } else {
    greeting = 'Evening';
  }

  return (
    <>
      <h1 id="Home">Allwin E K</h1>
      <div className="item-name" >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="titlename">Good {greeting}!</h2>

          <h3 className="titlename font-semibold header-text text-2xl mb-8 inline-flex items-center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              I'm Allwin E K
              <Tooltip title="Official Personal Website" arrow>
                <RiVerifiedBadgeFill
                  className="ml-2 relative top-[2px] cursor-pointer"
                  color="#1DA1F2"
                  size={30}
                />
              </Tooltip>
            </div>
          </h3>

        </div>
        <div className="typing-effect" style={{ display: 'flex', flexDirection: 'column', color: 'white', marginLeft: '10px' }}>
          <h2 className="typewritter"><Typewriter
            options={{
              strings: ["MERN stack Developer", "Designer", "Freelancer"],
              autoStart: true,
              loop: true,
              deleteSpeed: 80,
              delay: 100,
            }}
          />
          </h2>
        </div>
        <button
          className="button"
          onClick={handleContactClick}
          ref={buttonRef}
          style={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          }}
        >
          Let's connect
        </button>
      </div>
    </>
  )
}

export default Header;