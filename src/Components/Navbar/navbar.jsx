import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";

const navItems = [
  { label: 'Home', href: '#Home', isHash: true },
  { label: 'About', href: '#About', isHash: true },
  { label: 'Skills', href: '#Skills', isHash: true },
  { label: 'Achievements', href: '/achievements', isHash: false },
  { label: 'Projects', href: '/projects', isHash: false },
  { label: 'Contact me', href: '#contact', isHash: true }
];

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (e, href, isHash) => {
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
    setMobileOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', height: '100%' }}>
      <Typography variant="h6" sx={{ my: 2, marginLeft: -2, color: '#fff', fontWeight: 'bold', fontFamily: 'serif', fontSize: '1.2rem', textTransform: 'capitalize' }}>
        Allwin's Portfolio
      </Typography>
      <List>
        {navItems.map(({ label, href, isHash }) => (
          <ListItem key={href} >
            <ListItemButton
              onClick={(e) => handleClick(e, href, isHash)}
              sx={{
                justifyContent: 'center',
                color: '#fff',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      className="modal-navbar"
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1200,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'serif',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'serif',
            fontSize: '1.2rem',
            textTransform: 'capitalize'
          }}
        >
          Allwin's Portfolio
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
          {navItems.map(({ label, href, isHash }) => (
            <Box
              key={href}
              component="a"
              href={href}
              onClick={(e) => handleClick(e, href, isHash)}
              sx={{
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 10px',
                paddingTop: '20px',
                fontFamily: 'serif',
                fontSize: '1.2rem',
                transition: 'color 0.3s ease',
                display: 'inline-block',
                position: 'relative',

                '& span': {
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    width: 0,
                    height: '2px',
                    backgroundColor: '#fff',
                    transform: 'translateX(-50%)',
                    transition: 'width 0.3s ease',
                  },
                },

                '&:hover span::after': {
                  width: '100%',
                },
              }}
            >
              <span>{label}</span>
            </Box>
          ))}
        </Box>


        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none', paddingRight: '1px' }, color: '#fff' }}
        >
          {mobileOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </IconButton>
      </Box>

      <Box component="div" sx={{ display: { xs: 'block', md: 'none', padding: '5px' } }}>
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '70%',
              backgroundColor: 'transparent',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: 'none',
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;