import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";

import { FaLinkedin } from "react-icons/fa";
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";

import { useScrollToSection } from "./Scroll";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollToSection = useScrollToSection();

  const socials = [
    { icon: <FaFacebook fontSize="medium" size={25} />, label: "Facebook", href: "https://www.facebook.com/ekallwin" },
    { icon: <FaInstagram fontSize="medium" size={25} />, label: "Instagram", href: "https://www.instagram.com/ekallwin" },
    { icon: <FaSquareXTwitter fontSize="medium" size={25} />, label: "X (Twitter)", href: "https://www.twitter.com/ekallwin" },
    { icon: <FaThreads fontSize="medium" size={25} />, label: "Threads", href: "https://www.threads.net/@ekallwin" },
    { icon: <FaLinkedin fontSize="medium" size={25} />, label: "LinkedIn", href: "https://www.linkedin.com/in/ekallwin/" },
    { icon: <GitHubIcon fontSize="medium" size={25} />, label: "GitHub", href: "https://github.com/ekallwin" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: (theme) => theme.palette.mode === '#040B44' ? '#040B44' : '#040B44',
        color: "common.white",
        mt: "auto",
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="column" alignItems="center" spacing={2}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            My social medias
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0 }}>
            {socials.map((s) => (
              <IconButton
                key={s.label}
                aria-label={s.label}
                component={Link}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "transparent",
                  p: 1.25,
                  borderRadius: "50%",
                  transition: "all 0.22s ease",
                  color: 'inherit',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-3px)',
                    boxShadow: (theme) => `0 8px 28px ${theme.palette.mode === 'dark' ? 'rgba(31,38,135,0.18)' : 'rgba(0,0,0,0.12)'}`,
                    borderColor: (theme) => theme.palette.divider,
                  },
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Stack>

          <Typography
            variant="body2"
            align="center"
            sx={{ fontSize: 12, mt: 1 }}
          >
            &copy; {currentYear} Created, Developed and maintained by{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => scrollToSection("About")}
              sx={{
                textDecoration: "underline",
                color: "inherit",
                ml: 0.5,
                fontWeight: 600,
              }}
            >
              Allwin E K
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
