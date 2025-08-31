import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef();
  const navigate = useNavigate();

  const toggleNavbar = () => setIsOpen(!isOpen);

  const closeNavbar = () => {
    setIsOpen(false);
    const toggler = document.querySelector(".navbar-toggler");
    const collapse = document.getElementById("navbarNav");
    if (collapse?.classList.contains("show")) {
      toggler?.click();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeNavbar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (e, to = null, isHash = false, sectionId = null) => {
    e.preventDefault();
    const link = e.currentTarget;
    link.classList.add("active");

    setTimeout(() => {
      link.classList.remove("active");
      closeNavbar();

      if (to && !isHash) {
        navigate(to);
        window.scrollTo(0, 0);
      }

      if (sectionId) {
        navigate("/");
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
      }
    }, 100);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-navbar px-3" ref={navbarRef}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold text-uppercase me-auto" to="/">
          ALLWIN'S PORTFOLIO
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          onClick={toggleNavbar}
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} size="xl" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-lg-4 text-start text-lg-center">
            <li className="nav-item">
              <Link to="/" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, null, true, "Home")}>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, null, true, "About")}>
                <span>About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, null, true, "Skills")}>
                <span>Skills</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, "/projects")}>
                <span>Projects</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/achievements" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, "/achievements")}>
                <span>Achievements</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link navbar-link" onClick={(e) => handleLinkClick(e, null, true, "Contact")}>
                <span>Contact me</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
