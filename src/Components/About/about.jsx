import Allwin from "../Images/Allwin.jpg";
import { toast } from "react-toastify";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCircleCheck, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './about.css';

function About() {
  const [buttonText, setButtonText] = useState(<>Download Resume <FontAwesomeIcon icon={faDownload} /></>);
  const hasDownloadedRef = useRef(false);
  const aboutRef = useRef(null);

  const handleDownload = () => {
    if (hasDownloadedRef.current) {
      toast.warning('You\'ve already initiated the resume download. Please check your Downloads folder!', {
        autoClose: 6000,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      return;
    }

    hasDownloadedRef.current = true;
    setButtonText(<>Download Processing <FontAwesomeIcon icon={faCircleNotch} spin /></>);


    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/Resume.pdf';
      link.download = 'Resume.pdf';

      link.addEventListener('click', () => {
        setTimeout(() => {
          toast.success('The resume has been downloaded!', {
            autoClose: 5000,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setButtonText(<>Download Successful <FontAwesomeIcon icon={faCircleCheck} /></>);
        }, 500);
      }, { once: true });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
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

    const aboutElement = aboutRef.current;

    if (aboutElement) {
      observer.observe(aboutElement);
    }

    return () => {
      if (aboutElement) {
        observer.unobserve(aboutElement);
      }
    };
  }, []);

  return (
    <>
      <div id="About" className="abt" >
        <h2 style={{ textAlign: 'center' }}>About</h2>
        <div className="About card fade-in" id="Abt" ref={aboutRef}>
          <figure>
            <img src={Allwin} alt="Allwin E K" onContextMenu={(e) => e.preventDefault()} draggable="false" style={{ userSelect: 'none' }} />
            <div className="about-icons">
              <a
                href="https://github.com/ekallwin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="icon-link github"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/ekallwin/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="icon-link linkedin"
              >
                <FaLinkedin />
              </a>
            </div>
            <figcaption>&emsp; I am <b>Allwin E K</b>, a passionate Web Developer. I have a solid foundation in Front End technologies like <b>HTML, CSS, JavaScript and React.js</b>, and I love creating user-friendly and responsive web interfaces. I'm currently pursuing a <b>B.E</b> in <b>Computer Science and Engineering</b> at <b>Ponjesly College of Engineering, Nagercoil</b>.
              <br /><br />
              &emsp;I strongly believe in continuous learning and improving myself, so I try my best to learn in any situation possible, unfavorable or not.
            </figcaption>
            <button className="button-download" id="down_btn" style={{ fontSize: '20px' }} onClick={handleDownload}>{buttonText}</button>
          </figure>
          
        </div>
      </div>
    </>
  )
}

export default About;