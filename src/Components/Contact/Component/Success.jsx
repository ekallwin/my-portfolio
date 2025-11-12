import React from "react";

export default function GreenTickSuccess({
  size = 120,
  stroke = 8,
  color = "#28A745",
  durationCircle = 0.6,
  durationCheck = 0.4,
}) {
  const cssVars = {
    "--size": `${size}px`,
    "--stroke": stroke,
    "--green": color,
    "--white": "#ffffff",
    "--duration-circle": `${durationCircle}s`,
    "--duration-check": `${durationCheck}s`,
  };

  return (
    <div className="gtc-root" style={cssVars}>
      <div className="success">
        <svg viewBox="0 0 120 120" aria-hidden>
          <circle className="circle-fill" cx="60" cy="60" r="50" />
          <circle className="circle-stroke" cx="60" cy="60" r="48" />
          <path className="check" d="M40 62 L55 77 L82 50" />
        </svg>
      </div>

      <style>{`
        .gtc-root {  display: grid; place-items: center; }
        .success {
          width: var(--size);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          animation: bounce 0.5s ease-out 0.9s both;
        }
        v.success svg { width: 100%; height: 100%; overflow: visible; display: block; }
        .circle-fill {
          fill: var(--green);
          transform-origin: 50% 50%;
          scale: 0;
          animation: puff 450ms ease-out 0.6s both;
        }
        .circle-stroke {
          fill: none;
          stroke: var(--green);
          stroke-width: var(--stroke);
          stroke-linecap: round;
          stroke-dasharray: 301.59;
          stroke-dashoffset: 301.59;
          animation: draw-circle var(--duration-circle) ease-out forwards;
        }
        .check {
          fill: none;
          stroke: var(--white);
          stroke-width: var(--stroke);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-check var(--duration-check) ease-out 0.6s forwards;
        }
        @keyframes draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes draw-check { to { stroke-dashoffset: 0; } }
        @keyframes puff { 0% { scale: .7 } 100% { scale: 1 } }
        @keyframes bounce {
          0% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}