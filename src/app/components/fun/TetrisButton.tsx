"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";

export default function TetrisButton() {
  const [mounted, setMounted] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [visible, setVisible] = useState(true);
  const dirRef = useRef({ dx: 1.1, dy: 0.7 });
  const posRef = useRef({ x: 120, y: 300 });
  const frameRef = useRef<number | null>(null);
  const btnWrapRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);
  const navIndexRef = useRef(0);
  const navPages = ["/about#lets-build", "/portfolio", "/packages", "/services#custom-solution", "/contact"];
  const [showHireCard, setShowHireCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set random start position directly on DOM — no React state
    const startX = Math.random() * (window.innerWidth - 80);
    const startY = Math.random() * (window.innerHeight - 80);
    posRef.current = { x: startX, y: startY };
    if (btnWrapRef.current) {
      btnWrapRef.current.style.transform = `translate(${startX}px, ${startY}px)`;
    }
    startTransition(() => setMounted(true));

    const SPEED = 0.55;
    const SIZE = 58;

    function step() {
      const { x, y } = posRef.current;
      let { dx, dy } = dirRef.current;
      const W = window.innerWidth;
      const H = window.innerHeight;

      let nx = x + dx * SPEED;
      let ny = y + dy * SPEED;

      if (nx <= 0 || nx >= W - SIZE) {
        dx = -dx;
        nx = Math.max(0, Math.min(nx, W - SIZE));
      }
      if (ny <= 0 || ny >= H - SIZE) {
        dy = -dy;
        ny = Math.max(0, Math.min(ny, H - SIZE));
      }

      dirRef.current = { dx, dy };
      posRef.current = { x: nx, y: ny };
      // Direct DOM update — zero React re-renders per frame
      if (btnWrapRef.current) {
        btnWrapRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }
      frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // ? button toggles visibility every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current % 2 === 0) {
      setShowHireCard(true);
      setTimeout(() => setShowHireCard(false), 4500);
    } else {
      const page = navPages[navIndexRef.current % navPages.length];
      navIndexRef.current += 1;
      router.push(page);
    }
  };

  if (!mounted) return null;

  const warpLines = Array.from({ length: 20 }, (_, i) => i);

  return (
    <>
      {/* Bouncing ? button */}
      <div
        ref={btnWrapRef}
        className="fixed z-[90] select-none cursor-pointer"
        style={{
          left: 0,
          top: 0,
          willChange: "transform",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onClick={handleClick}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.88 }}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 28%, rgba(252,211,77,0.55) 0%, rgba(217,119,6,0.45) 50%, rgba(146,64,14,0.55) 100%), rgba(20,10,0,0.35)",
            backdropFilter: "blur(12px) saturate(1.6)",
            WebkitBackdropFilter: "blur(12px) saturate(1.6)",
            border: "1.5px solid rgba(245,158,11,0.55)",
            boxShadow: "0 0 12px rgba(217,119,6,0.4), 0 0 28px rgba(217,119,6,0.2), inset 0 1px 0 rgba(252,211,77,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          animate={{
            boxShadow: [
              "0 0 8px rgba(217,119,6,0.28), 0 0 20px rgba(217,119,6,0.13), inset 0 1px 0 rgba(252,211,77,0.25)",
              "0 0 18px rgba(217,119,6,0.52), 0 0 36px rgba(217,119,6,0.26), inset 0 1px 0 rgba(252,211,77,0.4)",
              "0 0 8px rgba(217,119,6,0.28), 0 0 20px rgba(217,119,6,0.13), inset 0 1px 0 rgba(252,211,77,0.25)",
            ],
          }}
          transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#fff8e7",
              textShadow: "0 0 8px rgba(252,211,77,0.7), 0 1px 2px rgba(92,40,0,0.6)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            ?
          </span>
        </motion.div>

        {/* Tooltip */}
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 mb-2 whitespace-nowrap text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-lg pointer-events-none"
            style={{
              transform: "translateX(-50%)",
              background: "rgba(15,8,0,0.9)",
              border: "1px solid rgba(217,119,6,0.35)",
              color: "#d97706",
            }}
          >
            click to discover magic
          </motion.div>
        )}
      </div>

      {/* Hire card splash — fires on every 2nd click */}
      <AnimatePresence>
        {showHireCard && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: "rgba(6,4,0,0.75)" }}
            onClick={() => setShowHireCard(false)}
          >
            {/* Amber warp streaks */}
            {warpLines.map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  height: "1.5px",
                  originX: 0,
                  originY: 0.5,
                  marginTop: "-0.75px",
                  rotate: (i / warpLines.length) * 360,
                  background: "linear-gradient(90deg, rgba(217,119,6,0.88), transparent)",
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: ["0px", "58vw"], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.7, ease: "easeIn", delay: i * 0.012 }}
              />
            ))}

            {/* Central amber flash */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,119,6,0.5) 0%, transparent 70%)" }}
              initial={{ width: 0, height: 0, opacity: 0.85 }}
              animate={{ width: "72vw", height: "72vw", opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />

            {/* Glass card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative z-10 max-w-sm w-full mx-6 rounded-2xl px-8 py-10 text-center"
              style={{
                background: "rgba(10,5,0,0.82)",
                backdropFilter: "blur(28px) saturate(1.5)",
                WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                border: "1px solid rgba(245,158,11,0.45)",
                boxShadow: "0 0 55px rgba(217,119,6,0.16), 0 28px 72px rgba(0,0,0,0.55), inset 0 1px 0 rgba(252,211,77,0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div style={{ width: 52, height: 3, background: "linear-gradient(90deg, transparent, #d97706, #f59e0b, transparent)", margin: "0 auto 18px", borderRadius: 2 }} />

              {/* Warning label */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.42)", borderRadius: 6, padding: "4px 13px", marginBottom: 20, color: "#f87171", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                ⚠&nbsp; Compulsive Clicking Warning
              </div>

              {/* Watermark ? */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{ fontSize: 180, fontWeight: 900, color: "rgba(217,119,6,0.04)", lineHeight: 1, fontFamily: "Georgia, serif" }}
              >
                ?
              </div>

              <p className="text-2xl font-bold leading-snug" style={{ color: "#fcd34d", fontFamily: "Georgia, serif" }}>
                All this clicking on stuff
              </p>
              <p className="text-xl font-semibold mt-2 leading-snug" style={{ color: "#fff8e7" }}>
                will make you want to hire us!
              </p>

              <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(217,119,6,0.5), transparent)", margin: "26px auto 20px" }} />

              <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(217,119,6,0.55)" }}>
                click anywhere to dismiss
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
