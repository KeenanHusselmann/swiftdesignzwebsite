"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

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

interface AuroraWave {
  id: number;
  yCenter: number;
  amplitude: number;
  wavelength: number;
  duration: number;
  opacity: number;
  hue: number;
}

export default function BackgroundEffects() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [glowDots, setGlowDots] = useState<GlowDot[]>([]);
  const [auroraWaves, setAuroraWaves] = useState<AuroraWave[]>([]);

  // Generate scattered glow dots on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    setGlowDots(
      Array.from({ length: 12 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      }))
    );
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

  const spawnAurora = useCallback(() => {
    const id = Math.floor(Date.now() + Math.random() * 10000);
    const yCenter = 15 + Math.random() * 60;
    const amplitude = 30 + Math.random() * 50;
    const wavelength = 250 + Math.random() * 200;
    const duration = 14 + Math.random() * 10;
    const opacity = 0.12 + Math.random() * 0.12;
    const hue = Math.random() > 0.5 ? 180 : 170 + Math.random() * 20;
    setAuroraWaves((prev) => [...prev.slice(-1), { id, yCenter, amplitude, wavelength, duration, opacity, hue }]);
    setTimeout(() => {
      setAuroraWaves((prev) => prev.filter((w) => w.id !== id));
    }, (duration + 3) * 1000);
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
      spawnAurora();
      auroraTimeout = setTimeout(tick, 10000 + Math.random() * 8000);
    };
    let auroraTimeout = setTimeout(tick, 800);
    return () => clearTimeout(auroraTimeout);
  }, [spawnAurora]);

  // Memoize aurora SVG paths so they don't recalculate on every render
  const auroraData = useMemo(() => {
    return auroraWaves.map((wave) => {
      const kf = `aurora${wave.id}`;
      const steps = 12;
      const w = 2000;
      const points: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const y = 150 + Math.sin((i / steps) * Math.PI * (w / wave.wavelength)) * wave.amplitude;
        points.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
      }
      const pathUp = points.join(" ");
      const pathDown: string[] = [];
      for (let i = steps; i >= 0; i--) {
        const x = (i / steps) * w;
        const y = 150 + Math.sin((i / steps) * Math.PI * (w / wave.wavelength) + 0.6) * wave.amplitude + 40;
        pathDown.push(`L${x},${y}`);
      }
      const fullPath = pathUp + " " + pathDown.join(" ") + " Z";
      return { ...wave, kf, fullPath };
    });
  }, [auroraWaves]);

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

        {/* Aurora waves */}
        {auroraData.map((wave) => (
          <div key={wave.id}>
            <style>{`
              @keyframes ${wave.kf} {
                0% { transform: translateX(-2000px); opacity: 0; }
                8% { opacity: 1; }
                85% { opacity: 1; }
                100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
              }
            `}</style>
            <div
              className="absolute"
              style={{
                top: `${wave.yCenter - 10}%`,
                left: 0,
                width: 2000,
                height: 300,
                animation: `${wave.kf} ${wave.duration}s ease-in-out forwards`,
              }}
            >
              <svg width="2000" height="300" viewBox="0 0 2000 300" fill="none">
                <defs>
                  <linearGradient id={`ag${wave.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={`hsla(${wave.hue}, 60%, 50%, 0)`} />
                    <stop offset="25%" stopColor={`hsla(${wave.hue}, 60%, 50%, ${wave.opacity * 0.6})`} />
                    <stop offset="50%" stopColor={`hsla(${wave.hue}, 65%, 55%, ${wave.opacity})`} />
                    <stop offset="75%" stopColor={`hsla(${wave.hue}, 60%, 50%, ${wave.opacity * 0.6})`} />
                    <stop offset="100%" stopColor={`hsla(${wave.hue}, 60%, 50%, 0)`} />
                  </linearGradient>
                  <filter id={`ab${wave.id}`}>
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>
                <path
                  d={wave.fullPath}
                  fill={`url(#ag${wave.id})`}
                  filter={`url(#ab${wave.id})`}
                />
              </svg>
            </div>
          </div>
        ))}

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
