import React from "react";

export default function GreenTickSuccess({
  size = 120,
  stroke = 8,
  color = "#28A745",
  durationCircle = 0.8,
  durationCheck = 0.4,
}) {
  const fillDelay = 0.62;
  const checkDelay = 0.82;
  const bounceDelay = 1.05;

  const cssVars = {
    "--size": `${size}px`,
    "--stroke": stroke,
    "--green": color,
    "--white": "#ffffff",
    "--duration-circle": `${durationCircle}s`,
    "--duration-check": `${durationCheck}s`,
    "--fill-delay": `${fillDelay}s`,
    "--check-delay": `${checkDelay}s`,
    "--bounce-delay": `${bounceDelay}s`,
  };

  return (
    <div className="gtc-root" style={cssVars}>
      <div className="success">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="circle-fill" cx="60" cy="60" r="48" />
          <circle className="circle-stroke" cx="60" cy="60" r="48" />
          <path className="check" d="M40 62 L55 77 L82 50" />
        </svg>
      </div>

      <style>{`
        .gtc-root {
          display: grid;
          place-items: center;
        }

        .success {
          width: var(--size);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          animation:
            success-bounce 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.15)
            var(--bounce-delay) both;
        }

        .success svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .circle-fill {
          fill: var(--green);
          transform-origin: 50% 50%;
          transform: scale(0);
          animation:
            fill-pop 0.28s cubic-bezier(0.34, 1.3, 0.64, 1)
            var(--fill-delay) both;
        }

        .circle-stroke {
          fill: none;
          stroke: var(--green);
          stroke-width: var(--stroke);
          stroke-linecap: round;
          stroke-dasharray: 301.59;
          stroke-dashoffset: 301.59;
          animation:
            draw-circle var(--duration-circle)
            cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
        }

        .check {
          fill: none;
          stroke: var(--white);
          stroke-width: var(--stroke);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation:
            draw-check var(--duration-check)
            cubic-bezier(0.65, 0, 0.35, 1)
            var(--check-delay)
            forwards;
        }

        @keyframes draw-circle {
          from {
            stroke-dashoffset: 301.59;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fill-pop {
          0% {
            transform: scale(0.72);
            opacity: 0;
          }

          65% {
            transform: scale(1.05);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw-check {
          from {
            stroke-dashoffset: 100;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes success-bounce {
          0% {
            transform: scale(0.94);
          }

          50% {
            transform: scale(1.07);
          }

          72% {
            transform: scale(0.985);
          }

          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
