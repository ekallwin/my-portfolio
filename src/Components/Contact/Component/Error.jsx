import React from "react";

export default function RedXFailure({
  size = 120,
  stroke = 8,
  color = "#DA3544",
}) {
  const cssVars = {
    "--size": `${size}px`,
    "--stroke": stroke,
    "--red": color,
    "--white": "#ffffff",
  };

  return (
    <div className="gtc-root" style={cssVars}>
      <div className="failure">
        <svg viewBox="0 0 120 120" aria-hidden>
          <circle className="circle-fill" cx="60" cy="60" r="50" />
          <circle className="circle-stroke" cx="60" cy="60" r="48" />
          <path className="x-mark" d="M45 45 L75 75 M75 45 L45 75" />
        </svg>
      </div>
      <style>{`
        .gtc-root {  display: grid; place-items: center; }
        .failure {
          width: var(--size);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
        }
        .failure svg { width: 100%; height: 100%; overflow: visible; display: block; }
        .circle-fill {
          fill: var(--red);
        }
        .circle-stroke {
          fill: none;
          stroke: var(--red);
          stroke-width: var(--stroke);
          stroke-linecap: round;
        }
        .x-mark {
          fill: none;
          stroke: var(--white);
          stroke-width: var(--stroke);
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </div>
  );
}