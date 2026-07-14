import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const HEAD_SIZE = 10;
const TAIL_HEIGHT = 50;

const CometScrollbar = () => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const lastScrollTop = useRef(0);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const appShell = document.querySelector(".app-shell");
    if (!appShell) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = appShell;
      const total = scrollHeight - clientHeight;
      setScrollProgress(total <= 0 ? 0 : scrollTop / total);

      if (scrollTop > lastScrollTop.current) {
        setScrollDirection("down");
      } else if (scrollTop < lastScrollTop.current) {
        setScrollDirection("up");
      }
      lastScrollTop.current = scrollTop;
    };

    appShell.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => appShell.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  if (!isHomePage) return null;

  const handleTrackClick = (e) => {
    const track = trackRef.current;
    const appShell = document.querySelector(".app-shell");
    if (!track || !appShell) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const pct = Math.max(0, Math.min(1, clickY / rect.height));
    const { scrollHeight, clientHeight } = appShell;
    appShell.scrollTop = pct * (scrollHeight - clientHeight);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    e.preventDefault();

    const onMove = (ev) => {
      if (!isDragging.current) return;
      const track = trackRef.current;
      const appShell = document.querySelector(".app-shell");
      if (!track || !appShell) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      const { scrollHeight, clientHeight } = appShell;
      appShell.scrollTop = pct * (scrollHeight - clientHeight);
    };

    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const tailOpacity = Math.min(1, scrollProgress * 10);
  const headTopCSS = `calc(${scrollProgress} * (100% - ${HEAD_SIZE}px))`;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      style={{
        position: "fixed",
        right: "3px",
        top: "10vh",
        width: "15px",
        height: "90%",
        zIndex: 9999,
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "100%",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "1px",
        }}
      />

      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: headTopCSS,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "grab",
        }}
      >
        <div
          style={{
            position: "absolute",
            [scrollDirection === "down" ? "bottom" : "top"]: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: `${TAIL_HEIGHT}px`,
            background:
              scrollDirection === "down"
                ? "linear-gradient(to top, var(--neon-color-2, #e81cff), transparent)"
                : "linear-gradient(to bottom, var(--neon-color-2, #e81cff), transparent)",
            opacity: tailOpacity,
            borderRadius: "1.5px",
            transition: "opacity 0.2s ease",
          }}
        />

        <div
          style={{
            width: `${HEAD_SIZE}px`,
            height: `${HEAD_SIZE}px`,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: `
              0 0 6px #ffffff,
              0 0 14px var(--neon-color-2, #e81cff),
              0 0 24px var(--neon-color-1, #8900F9)
            `,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
};

export default CometScrollbar;