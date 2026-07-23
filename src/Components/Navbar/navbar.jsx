import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion } from "motion/react";

const navItems = [
  { label: 'Home', href: '#Home', isHash: true },
  { label: 'About', href: '#About', isHash: true },
  { label: 'Skills', href: '#Skills', isHash: true },
  { label: 'Achievements', href: '/achievements', isHash: false },
  { label: 'Projects', href: '/projects', isHash: false },
  { label: 'Contact me', href: '#contact', isHash: true },
];

const containerVariants = {
  hidden: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    x: -30, 
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: "easeIn"
    }
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
};

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
    <Box 
      onClick={handleDrawerToggle} 
      sx={{ 
        textAlign: 'center', 
        backgroundColor: 'rgba(15, 12, 41, 0.95)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        height: '100%',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          animation: 'shimmer 4s ease-in-out infinite',
          pointerEvents: 'none',
        }
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          my: 2, 
          color: '#fff', 
          fontWeight: 'bold', 
          fontFamily: 'serif', 
          fontSize: '1.3rem', 
          textTransform: 'capitalize',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '1px',
        }}
      >
        Allwin's Portfolio
      </Typography>
      <List
        component={motion.ul}
        variants={containerVariants}
        initial="hidden"
        animate={mobileOpen ? "visible" : "hidden"}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {navItems.map(({ label, href, isHash }) => (
          <ListItem
            key={href}
            component={motion.li}
            variants={itemVariants}
            disablePadding
            sx={{ px: 2, mb: 0.5 }}
          >
            <ListItemButton
              component={motion.div}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(139, 92, 246, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleClick(e, href, isHash)}
              sx={{
                justifyContent: 'center',
                color: '#fff',
                py: 1.2,
                px: 2,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }
              }}
            >
              <ListItemText 
                primary={label} 
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'serif',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }
                }}
              />
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
        background: 'rgba(15, 12, 41, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        fontFamily: 'serif',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.5) 50%, transparent 100%)',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 25px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'serif',
            fontSize: '1.3rem',
            textTransform: 'capitalize',
            letterSpacing: '1px',
          }}
        >
          Allwin's Portfolio
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '8px' }}>
          {navItems.map(({ label, href, isHash }) => (
            <Box
              key={href}
              component="a"
              href={href}
              onClick={(e) => handleClick(e, href, isHash)}
              sx={{
                color: '#fff',
                textDecoration: 'none',
                padding: '8px 0',
                fontFamily: 'serif',
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                margin: '0 12px',

                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 4,
                  width: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)',
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                },

                '&:hover': {
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                },

                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            display: { md: 'none', paddingRight: '1px' }, 
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              color: '#EC4899',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {mobileOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </IconButton>
      </Box>

      <Box component="div" sx={{ display: { xs: 'block', md: 'none' } }}>
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
              width: '75%',
              maxWidth: '320px',
              backgroundColor: 'transparent',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              boxShadow: 'none',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
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