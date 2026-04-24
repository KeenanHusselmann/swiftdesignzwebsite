"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, startTransition } from "react";

interface Spark {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  zapLines: { angle: number; width: number }[];
}

interface GlowDot {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface CloudBundle {
  id: number;
  y: number;
  size: number;
  duration: number;
  opacity: number;
  hue: number;
}

// Continuous aurora: 4 seamless sine cycles across 3840px — loops via translateX(-50%) on a 200%-wide div
const CONT_AURORA_PATH = (() => {
  const steps = 64, W = 3840, yC = 100, amp = 42, wl = 960;
  const up = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * W;
    const y = yC + Math.sin((x / wl) * Math.PI * 2) * amp;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const down = Array.from({ length: steps + 1 }, (_, i) => {
    const j = steps - i;
    const x = (j / steps) * W;
    const y = yC + Math.sin((x / wl) * Math.PI * 2 + 0.45) * amp + 38;
    return `L${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return [...up, ...down, "Z"].join(" ");
})();

export default function BackgroundEffects() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [glowDots, setGlowDots] = useState<GlowDot[]>([]);
  const [cloudBundles, setCloudBundles] = useState<CloudBundle[]>([]);

  // Generate scattered glow dots on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    startTransition(() => setGlowDots(
      Array.from({ length: 12 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      }))
    ));
  }, []);

  const spawnSpark = useCallback(() => {
    const id = Date.now() + Math.random();
    const startX = 10 + Math.random() * 80;
    const startY = 10 + Math.random() * 80;
    const angle = Math.random() * Math.PI * 2;
    const dist = 15 + Math.random() * 25;
    const endX = Math.max(5, Math.min(95, startX + Math.cos(angle) * dist));
    const endY = Math.max(5, Math.min(95, startY + Math.sin(angle) * dist));
    const duration = 1.2 + Math.random() * 1.3;
    const zapLines = Array.from({ length: 3 }, () => ({
      angle: Math.floor(Math.random() * 360),
      width: 10 + Math.random() * 14,
    }));
    setSparks((prev) => [...prev.slice(-1), { id, startX, startY, endX, endY, duration, zapLines }]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, (duration + 1.5) * 1000);
  }, []);

  const spawnCloud = useCallback(() => {
    const id = Math.floor(Date.now() + Math.random() * 10000);
    const y = 8 + Math.random() * 65;
    const size = 80 + Math.random() * 110;
    const duration = 38 + Math.random() * 28;
    const opacity = 0.055 + Math.random() * 0.07;
    const hue = 172 + Math.random() * 16;
    setCloudBundles((prev) => [...prev.slice(-2), { id, y, size, duration, opacity, hue }]);
    setTimeout(() => {
      setCloudBundles((prev) => prev.filter((c) => c.id !== id));
    }, (duration + 4) * 1000);
  }, []);

  useEffect(() => {
    const tick = () => {
      spawnSpark();
      timeout = setTimeout(tick, 1200 + Math.random() * 2800);
    };
    let timeout = setTimeout(tick, 1000);
    return () => clearTimeout(timeout);
  }, [spawnSpark]);

  useEffect(() => {
    const tick = () => {
      spawnCloud();
      cloudTimeout = setTimeout(tick, 14000 + Math.random() * 12000);
    };
    let cloudTimeout = setTimeout(tick, 1800);
    return () => clearTimeout(cloudTimeout);
  }, [spawnCloud]);

  return (
    <>
      {/* ── Static ambient layers ── behind content at z-[-1] */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {/* Hero area light */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 18%, rgba(48, 176, 176, 0.18) 0%, transparent 55%), " +
              "radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.06) 0%, transparent 35%), " +
              "radial-gradient(ellipse 70% 40% at 50% 15%, rgba(48, 176, 176, 0.1) 0%, transparent 50%)",
          }}
        />
        {/* Card section lights */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 35% at 50% 55%, rgba(48, 176, 176, 0.12) 0%, transparent 55%), " +
              "radial-gradient(ellipse 60% 30% at 30% 70%, rgba(48, 112, 112, 0.1) 0%, transparent 50%), " +
              "radial-gradient(ellipse 60% 30% at 75% 65%, rgba(48, 176, 176, 0.08) 0%, transparent 50%), " +
              "radial-gradient(ellipse 50% 25% at 50% 85%, rgba(48, 176, 176, 0.1) 0%, transparent 50%)",
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(255, 255, 255, 0.05) 0%, transparent 55%)",
            animation: "specularDrift 15s ease-in-out infinite",
          }}
        />
        {/* Glossy sheen */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, transparent 25%, transparent 65%, rgba(255,255,255,0.02) 100%)",
          }}
        />
        {/* Sun glow */}
        <div
          className="absolute"
          style={{
            top: "-8%",
            right: "-6%",
            width: "45vw",
            height: "45vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,220,80,0.10) 0%, rgba(255,180,40,0.06) 25%, rgba(255,120,0,0.03) 45%, transparent 70%)",
            boxShadow:
              "0 0 80px 40px rgba(255,200,60,0.06), 0 0 160px 80px rgba(255,160,30,0.03)",
          }}
        />
        {/* Sun corona pulse */}
        <motion.div
          className="absolute"
          style={{
            top: "-5%",
            right: "-3%",
            width: "30vw",
            height: "30vw",
            maxWidth: 420,
            maxHeight: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,240,180,0.08) 0%, rgba(255,200,80,0.04) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating Orbs */}
        <motion.div
          className="orb orb-teal hidden md:block"
          style={{ width: 400, height: 400, top: "10%", left: "-5%" }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="orb orb-deep hidden md:block"
          style={{ width: 300, height: 300, top: "60%", right: "-5%" }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="orb orb-teal hidden sm:block"
          style={{ width: 150, height: 150, bottom: "10%", left: "30%" }}
          animate={{ x: [0, 60, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Dynamic effects ── visible over content at z-[1] */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {/* Glow dots */}
        {glowDots.map((dot, i) => (
          <div
            key={`glow-${i}`}
            className="absolute"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: "rgba(48, 176, 176, 0.5)",
              boxShadow:
                "0 0 6px 2px rgba(48, 176, 176, 0.3), 0 0 12px 4px rgba(48, 176, 176, 0.1)",
              animation: `glowPulse ${dot.duration}s ${dot.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Continuous aurora wave — one seamless flowing ribbon */}
        <div className="absolute overflow-hidden pointer-events-none" style={{ top: "16%", left: 0, right: 0, height: 200 }}>
          <style>{`
            @keyframes contAuroraFlow {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div style={{ width: "200%", animation: "contAuroraFlow 52s linear infinite" }}>
            <svg width="100%" height="200" viewBox="0 0 3840 200" preserveAspectRatio="none" fill="none">
              <defs>
                <linearGradient id="cag" x1="0" y1="0" x2="3840" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="hsla(176, 55%, 52%, 0)" />
                  <stop offset="10%"  stopColor="hsla(176, 60%, 52%, 0.07)" />
                  <stop offset="28%"  stopColor="hsla(180, 65%, 56%, 0.13)" />
                  <stop offset="50%"  stopColor="hsla(176, 60%, 52%, 0.08)" />
                  <stop offset="72%"  stopColor="hsla(180, 65%, 56%, 0.13)" />
                  <stop offset="90%"  stopColor="hsla(176, 60%, 52%, 0.07)" />
                  <stop offset="100%" stopColor="hsla(176, 55%, 52%, 0)" />
                </linearGradient>
                <filter id="cab">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>
              <path d={CONT_AURORA_PATH} fill="url(#cag)" filter="url(#cab)" />
            </svg>
          </div>
        </div>

        {/* Drifting cloud bundles */}
        {cloudBundles.map((cloud) => {
          const kf = `cloud${cloud.id}`;
          const s = cloud.size;
          const col = `hsla(${cloud.hue}, 50%, 62%, ${cloud.opacity})`;
          const blur = `blur(${Math.round(s * 0.13)}px)`;
          return (
            <div key={cloud.id}>
              <style>{`
                @keyframes ${kf} {
                  0%   { transform: translateX(-${Math.ceil(s * 3.5)}px); opacity: 0; }
                  8%   { opacity: 1; }
                  88%  { opacity: 1; }
                  100% { transform: translateX(calc(100vw + ${Math.ceil(s * 3.5)}px)); opacity: 0; }
                }
              `}</style>
              <div
                className="absolute"
                style={{
                  top: `${cloud.y}%`,
                  left: 0,
                  width: s * 3.2,
                  height: s * 1.6,
                  animation: `${kf} ${cloud.duration}s linear forwards`,
                }}
              >
                {/* Main elongated body */}
                <div style={{ position: "absolute", width: s * 2.2, height: s * 0.72, left: 0, top: s * 0.56, borderRadius: "50%", background: col, filter: blur }} />
                {/* Left bump */}
                <div style={{ position: "absolute", width: s * 0.78, height: s * 0.78, left: s * 0.22, top: s * 0.14, borderRadius: "50%", background: col, filter: blur }} />
                {/* Center bump (tallest) */}
                <div style={{ position: "absolute", width: s * 0.9, height: s * 0.9, left: s * 0.72, top: 0, borderRadius: "50%", background: col, filter: blur }} />
                {/* Right bump */}
                <div style={{ position: "absolute", width: s * 0.72, height: s * 0.72, left: s * 1.28, top: s * 0.1, borderRadius: "50%", background: col, filter: blur }} />
                {/* Far-right small bump */}
                <div style={{ position: "absolute", width: s * 0.52, height: s * 0.52, left: s * 1.68, top: s * 0.24, borderRadius: "50%", background: col, filter: blur }} />
              </div>
            </div>
          );
        })}

        {/* Sparks with trails */}
        {sparks.map((spark) => {
          const trailCount = 8;
          return (
            <div key={spark.id}>
              {Array.from({ length: trailCount }, (_, i) => {
                const t = i / trailCount;
                const x = spark.startX + (spark.endX - spark.startX) * t;
                const y = spark.startY + (spark.endY - spark.startY) * t;
                const delay = spark.duration * t;
                const isBig = i % 4 === 0;
                const dotSize = isBig ? 5 + Math.random() * 3 : 2 + Math.random() * 2;
                const trailOpacity = isBig ? 0.85 : 0.55 - i * 0.04;
                return (
                  <motion.div
                    key={`trail-${spark.id}-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, trailOpacity, trailOpacity * 0.6, 0],
                      scale: [0, 1.1, 0.7, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      delay,
                      ease: "easeOut",
                    }}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: dotSize,
                      height: dotSize,
                      borderRadius: "50%",
                      background: isBig
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(48, 176, 176, 0.8)",
                      boxShadow: isBig
                        ? "0 0 10px 4px rgba(48, 176, 176, 0.7), 0 0 20px 8px rgba(48, 176, 176, 0.3)"
                        : "0 0 6px 2px rgba(48, 176, 176, 0.5), 0 0 12px 4px rgba(48, 176, 176, 0.2)",
                    }}
                  />
                );
              })}

              {/* Main spark head */}
              <motion.div
                initial={{
                  left: `${spark.startX}%`,
                  top: `${spark.startY}%`,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  left: `${spark.endX}%`,
                  top: `${spark.endY}%`,
                  opacity: [0, 1, 1, 0.8, 0],
                  scale: [0, 1, 1.1, 0.9, 0],
                }}
                transition={{ duration: spark.duration, ease: "easeInOut" }}
                className="absolute"
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow:
                      "0 0 8px 3px rgba(48, 176, 176, 0.9), 0 0 20px 6px rgba(48, 176, 176, 0.4), 0 0 40px 10px rgba(48, 176, 176, 0.15)",
                  }}
                />
                {spark.zapLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: line.width,
                      height: 1,
                      background:
                        "linear-gradient(90deg, rgba(48, 176, 176, 0.8), transparent)",
                      transformOrigin: "0% 50%",
                      transform: `rotate(${line.angle}deg)`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}
