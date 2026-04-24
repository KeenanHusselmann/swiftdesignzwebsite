"use client";

import { CSSProperties, ReactNode } from "react";

/**
 * ElectricBorderCard
 *
 * Cross-browser electric spinning border using transform:rotate on a large
 * conic-gradient div clipped by overflow:hidden — no @property / Houdini required.
 *
 * The 600×600px square spinner is centred on the card. As it rotates, the arc of
 * the conic gradient sweeps around the card perimeter creating the electric effect.
 */
export default function ElectricBorderCard({
  children,
  color = "teal",
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  color?: "teal" | "gold";
  className?: string;
  /** Extra classes applied to the inner content div (e.g. "p-6 flex flex-col") */
  innerClassName?: string;
}) {
  const c1 = color === "gold" ? "#f59e0b" : "#30B0B0";
  const c2 = color === "gold" ? "#fde68a" : "#7ef5f5";

  // Conic gradient: one bright arc (~110°) surrounded by transparent
  const gradient = `conic-gradient(from 0deg,
    transparent 0deg,
    transparent 125deg,
    ${c1} 150deg,
    ${c2} 180deg,
    ${c1} 210deg,
    transparent 235deg,
    transparent 360deg)`;

  const spinnerStyle: CSSProperties = {
    position: "absolute",
    width: "600px",
    height: "600px",
    top: "50%",
    left: "50%",
    marginTop: "-300px",
    marginLeft: "-300px",
    background: gradient,
    animation: "spinElectric 3s linear infinite",
  };

  return (
    <div
      className={`relative h-full ${className}`}
      style={{ borderRadius: "1rem" }}
    >
      {/* ── Glow halo (blurred, slightly larger clip region) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "1.25rem",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            ...spinnerStyle,
            filter: "blur(16px)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* ── Sharp border arc ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "1.1rem",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div style={spinnerStyle} />
      </div>

      {/* ── Inner card content ── */}
      <div
        className={innerClassName || "h-full"}
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "calc(1rem - 2px)",
          background:
            "linear-gradient(160deg, rgba(14,18,28,0.98) 0%, rgba(10,13,20,0.99) 100%)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
