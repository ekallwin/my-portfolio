import React, { useState, useEffect } from "react";
import "./footer.css";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter, FaThreads } from "react-icons/fa6";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useScrollToSection } from "./Scroll";
import moment from "moment";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(moment().year());
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata");
        if (response.ok) {
          const data = await response.json();
          if (data.year) {
            setCurrentYear(data.year);
          }
        }
      } catch (error) {
      }
    };

    fetchYear();
  }, []);

  const socials = [
    { icon: <FaFacebook />, label: "Facebook", href: "https://www.facebook.com/ekallwin" },
    { icon: <FaInstagram />, label: "Instagram", href: "https://www.instagram.com/ekallwin" },
    { icon: <FaSquareXTwitter />, label: "X (Twitter)", href: "https://www.twitter.com/ekallwin" },
    { icon: <FaThreads />, label: "Threads", href: "https://www.threads.net/@ekallwin" },
    { icon: <FaLinkedin />, label: "LinkedIn", href: "https://www.linkedin.com/in/ekallwin/" },
    { icon: <GitHubIcon />, label: "GitHub", href: "https://github.com/ekallwin" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-header">
          <h3 className="footer-title">Connect with me</h3>
          <div className="footer-divider"></div>
        </div>

        <div className="social-links">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="footer-copyright">
          <p>
            &copy; {currentYear} Created & Maintained by{" "}
            <button
              className="footer-author-btn"
              onClick={() => scrollToSection("About")}
            >
              Allwin E K
            </button>
          </p>
        </div>

      </div>
    </footer>
  );
}
