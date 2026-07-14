import React, { useState, useEffect } from "react";
import "./footer.css";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter, FaThreads } from "react-icons/fa6";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useScrollToSection } from "./Scroll";
import moment from "moment";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IP from "../Isp/Isp";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(moment().year());
  const scrollToSection = useScrollToSection();

  const [connectionOpen, setConnectionOpen] = useState(false);

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

        <div className="footer-connection">
          <button className="footer-connection-btn" onClick={() => setConnectionOpen(true)}>
            Show Connection Details
          </button>
        </div>

      </div>

      <Dialog
        open={connectionOpen}
        onClose={() => setConnectionOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(20, 20, 30, 0.85)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1, color: "#fff" }}>
         Your connection details
          <IconButton
            onClick={() => setConnectionOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "rgba(255,255,255,0.7)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {connectionOpen && <IP />}
        </DialogContent>
      </Dialog>
    </footer>
  );
}