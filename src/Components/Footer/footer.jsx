import React, { useState, useEffect } from "react";
import "./footer.css";
import { FaLinkedin, FaFacebook, FaInstagram, FaAngleRight } from "react-icons/fa";
import { FaSquareXTwitter, FaThreads } from "react-icons/fa6";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useScrollToSection } from "./Scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../Navbar/navItems";
import moment from "moment";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(moment().year());
  const scrollToSection = useScrollToSection();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, href, isHash) => {
    e.preventDefault();

    if (isHash) {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          const checkEl = () => {
            const el = document.getElementById(href.substring(1));

            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              setTimeout(checkEl, 100);
            }
          };

          checkEl();
        }, 400);
      } else {
        scrollToSection(href.substring(1));
      }
    } else {
      navigate(href);
    }
  };

  useEffect(() => {
    const fetchYear = async () => {
      const timeApiUrl = import.meta.env.TIME_API_URL;

      if (!timeApiUrl) {
        return;
      }

      try {
        const response = await fetch(timeApiUrl);

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (typeof data.year === "number") {
          setCurrentYear(data.year);
        }
      } catch (error) {}
    };

    fetchYear();
  }, []);

  const socials = [
    {
      icon: <FaFacebook />,
      label: "Facebook",
      href: "https://www.facebook.com/ekallwin",
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      href: "https://www.instagram.com/ekallwin",
    },
    {
      icon: <FaSquareXTwitter />,
      label: "X (Twitter)",
      href: "https://www.twitter.com/ekallwin",
    },
    {
      icon: <FaThreads />,
      label: "Threads",
      href: "https://www.threads.net/@ekallwin",
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ekallwin/",
    },
    {
      icon: <GitHubIcon />,
      label: "GitHub",
      href: "https://github.com/ekallwin",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-quick-links">
            <h3 className="footer-section-title">Quick links</h3>

            <nav className="footer-nav" aria-label="Footer navigation">
              {navItems.map(({ label, href, isHash }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href, isHash)}
                  className="footer-nav-link"
                >
                  <FaAngleRight />
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-social">
            <div className="footer-header">
              <h3 className="footer-title">Connect with me</h3>
              <div className="footer-divider" />
            </div>

            <div className="social-links">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
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