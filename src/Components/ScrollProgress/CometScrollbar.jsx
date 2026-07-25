import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const HEAD_SIZE = 10;
const TAIL_HEIGHT = 50;

const CometScrollbar = () => {
  const location = useLocation();
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const isDragging = useRef(false);
  const lastScrollTop = useRef(0);
  const trackHeight = useRef(0);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const appShell = document.querySelector(".app-shell");
    const track = trackRef.current;
    if (!appShell || !track) return;

    const measureTrack = () => {
      trackHeight.current = track.getBoundingClientRect().height;
    };
    measureTrack();

    // Direct, synchronous DOM writes on every scroll event (same as before),
    // but moving the head with `transform: translateY()` instead of `top`.
    // `top` forces a layout recalculation on every single scroll event,
    // which is what caused the stutter/"buffering" on fast scrolling.
    // `transform` is compositor-only, so the browser can move the dot
    // without re-running layout — this is what actually fixes the jank.
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = appShell;
      const total = scrollHeight - clientHeight;
      const progress = total <= 0 ? 0 : scrollTop / total;

      if (headRef.current) {
        const travel = Math.max(0, trackHeight.current - HEAD_SIZE);
        headRef.current.style.transform = `translate(-50%, ${progress * travel}px)`;
      }

      if (tailRef.current) {
        const opacity = Math.min(1, progress * 10);
        tailRef.current.style.opacity = opacity;

        if (scrollTop > lastScrollTop.current) {
          tailRef.current.style.bottom = "100%";
          tailRef.current.style.top = "auto";
          tailRef.current.style.background =
            "linear-gradient(to top, var(--neon-color-2, #e81cff), transparent)";
        } else if (scrollTop < lastScrollTop.current) {
          tailRef.current.style.top = "100%";
          tailRef.current.style.bottom = "auto";
          tailRef.current.style.background =
            "linear-gradient(to bottom, var(--neon-color-2, #e81cff), transparent)";
        }
      }

      lastScrollTop.current = scrollTop;
    };

    appShell.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measureTrack);
    handleScroll();

    return () => {
      appShell.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measureTrack);
    };
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
        ref={headRef}
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: "50%",
          top: "0px",
          transform: "translate(-50%, 0px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "grab",
          willChange: "transform",
        }}
      >
        <div
          ref={tailRef}
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: `${TAIL_HEIGHT}px`,
            background:
              "linear-gradient(to top, var(--neon-color-2, #e81cff), transparent)",
            opacity: 0,
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