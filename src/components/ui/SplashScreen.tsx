"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Cookies from "js-cookie";
import Image from "next/image";

type Phase = "disclaimers" | "warp" | "main" | "unlocked";

const WARP_DELAYS = Array.from({ length: 24 }, () => Math.random() * 0.3);

const STARS = Array.from({ length: 40 }, () => ({
  w: Math.random() * 2.5 + 0.5,
  h: Math.random() * 2.5 + 0.5,
  l: Math.random() * 100,
  t: Math.random() * 100,
  o: Math.random() * 0.5 + 0.1,
  dur: Math.random() * 4 + 2,
  del: Math.random() * 4,
}));

const BURST_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  w: Math.random() * 6 + 3,
  h: Math.random() * 6 + 3,
  x: Math.cos((i / 16) * Math.PI * 2) * (120 + Math.random() * 80),
  y: Math.sin((i / 16) * Math.PI * 2) * (120 + Math.random() * 80),
}));

const DISCLAIMERS = [
  {
    num: "1 of 3",
    color: "#30B0B0",
    glow: "rgba(48,176,176,0.25)",
    border: "rgba(48,176,176,0.4)",
    title: "HEALTH WARNING",
    body: [
      "This website contains dangerously good design.",
      "Side effects include spontaneous rebranding,",
      "an uncontrollable urge to hire us immediately,",
      "and permanent dissatisfaction with mediocre websites.",
    ],
    cta: "I'll Take My Chances →",
  },
  {
    num: "2 of 3",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.2)",
    border: "rgba(239,68,68,0.4)",
    title: "CAUTION: DESIGN HAZARD",
    body: [
      "We accept no liability for:",
      "• Sudden clarity about your brand identity",
      "• Inexplicable urge to fire your current web developer",
      "• Realising your old website was a digital war crime",
    ],
    cta: "Understood. Proceed →",
  },
  {
    num: "3 of 3",
    color: "#30B0B0",
    glow: "rgba(48,176,176,0.2)",
    border: "rgba(48,176,176,0.4)",
    title: "TERMS & CONDITIONS (ABRIDGED)",
    body: [
      "By entering, you acknowledge that:",
      "→  Your design standards are about to permanently level up",
      "→  You may never look at Comic Sans the same way again",
      "→  We warned you. You chose this.",
    ],
    cta: "Enter At Your Own Risk →",
  },
];

function WarpAnimation() {
  const lines = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Star streaks shooting outward */}
      {lines.map((i) => {
        const angle = (i / lines.length) * 360;
        return (
          <motion.div
            key={i}
            className="absolute origin-left"
            style={{
              left: "50%",
              top: "50%",
              height: "1.5px",
              background: "linear-gradient(90deg, rgba(48,176,176,0.9), transparent)",
              transformOrigin: "left center",
              rotate: angle,
              marginTop: "-0.75px",
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: ["0px", "60vw"], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeIn", delay: WARP_DELAYS[i] }}
          />
        );
      })}
      {/* Central flash */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: "radial-gradient(circle, rgba(48,176,176,0.8) 0%, transparent 70%)" }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: "120vw", height: "120vw", opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
}

function CloudLayer({ onDone }: { onDone: () => void }) {
  const clouds = [
    { x: "-20%", y: "10%", w: 500, h: 200, delay: 0 },
    { x: "60%", y: "5%", w: 400, h: 160, delay: 0.2 },
    { x: "-10%", y: "70%", w: 450, h: 180, delay: 0.1 },
    { x: "55%", y: "65%", w: 380, h: 150, delay: 0.3 },
    { x: "20%", y: "40%", w: 600, h: 220, delay: 0.05 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: c.x,
            top: c.y,
            width: c.w,
            height: c.h,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(180,220,255,0.12) 0%, rgba(48,176,176,0.06) 50%, transparent 80%)`,
            filter: "blur(32px)",
          }}
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 1.6, y: i % 2 === 0 ? -120 : 120 }}
          transition={{ duration: 1.8, delay: c.delay + 0.3, ease: "easeIn" }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        />
      ))}
    </div>
  );
}

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("disclaimers");
  const [disclaimerIdx, setDisclaimerIdx] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const x = useMotionValue(0);
  const sliderWidth = windowWidth < 400 ? 220 : 280;
  const thumbWidth = windowWidth < 400 ? 52 : 64;
  const maxDrag = sliderWidth - thumbWidth;
  const backgroundOpacity = useTransform(x, [0, maxDrag], [0, 1]);
  const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      setWindowWidth(window.innerWidth);
    });
    const seen = Cookies.get("swift-splash-seen");
    if (!seen) {
      startTransition(() => setShow(true));
      document.body.style.overflow = "hidden";
    }
  }, []);

  const advanceDisclaimer = () => {
    if (disclaimerIdx < DISCLAIMERS.length - 1) {
      setDisclaimerIdx((i) => i + 1);
    } else {
      setPhase("warp");
      setTimeout(() => setPhase("main"), 1800);
    }
  };

  const handleDragEnd = () => {
    if (x.get() >= maxDrag * 0.85) {
      setPhase("unlocked");
      Cookies.set("swift-splash-seen", "true", { expires: 1 });
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, 4800);
    }
  };

  if (!mounted || !show) return null;

  const disc = DISCLAIMERS[disclaimerIdx];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#060a10" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Zooming background grid */}
          <motion.div
            className="absolute inset-[-15%] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(48,176,176,0.055) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
            animate={{ scale: [1, 1.38, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Starfield backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {STARS.map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: star.w,
                  height: star.h,
                  left: `${star.l}%`,
                  top: `${star.t}%`,
                  background: "white",
                  opacity: star.o,
                }}
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{ duration: star.dur, repeat: Infinity, delay: star.del }}
              />
            ))}
          </div>

          {/* ───── DISCLAIMER PHASE ───── */}
          <AnimatePresence mode="wait">
            {phase === "disclaimers" && (
              <motion.div
                key={`disc-${disclaimerIdx}`}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.96 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center px-4 w-full max-w-md"
              >
                {/* Brand header */}
                <motion.div
                  className="flex items-center gap-2 mb-5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Image
                    src="/images/favicon.png"
                    alt="Swift Designz"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(48,176,176,0.7))" }}
                  />
                  <span
                    className="text-sm font-bold tracking-[3px] uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Swift Designz
                  </span>
                </motion.div>

                {/* Board */}
                <div
                  className="w-full rounded-2xl p-8"
                  style={{
                    background: "rgba(8,14,24,0.95)",
                    border: `2px solid ${disc.border}`,
                    boxShadow: `0 0 40px ${disc.glow}, inset 0 0 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Badge top */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-xs uppercase tracking-[3px]"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {disc.num}
                    </span>
                  </div>

                  {/* Intro text on first card only */}
                  {disclaimerIdx === 0 && (
                    <p className="text-xs mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                      Before entering the Swift Designz experience, please take a moment to review the following important notices from our legal department (it&apos;s just Keenan).
                    </p>
                  )}

                  {/* Title */}
                  <h2
                    className="text-xl font-black uppercase tracking-widest mb-5"
                    style={{ color: disc.color }}
                  >
                    {disc.title}
                  </h2>

                  {/* Body */}
                  <div className="space-y-2 mb-8">
                    {disc.body.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="text-sm text-gray-300 leading-relaxed"
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-2 mb-6">
                    {DISCLAIMERS.map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === disclaimerIdx ? 24 : 8,
                          height: 8,
                          background: i <= disclaimerIdx ? disc.color : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>

                  {/* CTA button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={advanceDisclaimer}
                    className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${disc.color}22, ${disc.color}44)`,
                      border: `1px solid ${disc.border}`,
                      color: disc.color,
                      boxShadow: `0 0 20px ${disc.glow}`,
                    }}
                  >
                    {disc.cta}
                  </motion.button>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center italic">
                  {disclaimerIdx === 0 && "No designers were harmed in the making of this website."}
                  {disclaimerIdx === 1 && "Side effects are considered features, not bugs."}
                  {disclaimerIdx === 2 && "Swift Designz Legal Dept. (it's just Keenan) approves this message."}
                </p>
              </motion.div>
            )}

            {/* ───── WARP PHASE ───── */}
            {phase === "warp" && (
              <motion.div
                key="warp"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WarpAnimation />
              </motion.div>
            )}

            {/* ───── MAIN PHASE ───── */}
            {phase === "main" && (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center px-4 w-full"
              >
                {/* Clouds parting */}
                <CloudLayer onDone={() => {}} />

                {/* Spinning favicon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-8"
                >
                  <motion.img
                    src="/images/favicon.png"
                    alt="Swift Designz"
                    className="w-28 h-28 md:w-36 md:h-36"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ filter: "drop-shadow(0 0 16px rgba(48,176,176,0.5)) drop-shadow(0 0 32px rgba(48,176,176,0.25))" }}
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl md:text-3xl font-light mb-2 tracking-wider text-center"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Slide to enter
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl md:text-5xl font-bold mb-12 text-center"
                  style={{
                    background: "linear-gradient(135deg, #fff 0%, var(--swift-teal) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Swift Designz
                </motion.h2>

                {/* Slider */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <div
                    ref={constraintsRef}
                    className="relative rounded-full overflow-hidden"
                    style={{
                      width: sliderWidth,
                      height: thumbWidth,
                      background: "rgba(48,176,176,0.08)",
                      border: "1px solid rgba(48,176,176,0.2)",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, rgba(48,176,176,0.15), rgba(48,176,176,0.3))",
                        opacity: backgroundOpacity,
                      }}
                    />
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center text-xs tracking-[3px] uppercase select-none pointer-events-none"
                      style={{ color: "rgba(48,176,176,0.5)", opacity: textOpacity, paddingLeft: "40px" }}
                    >
                      Slide to enter
                    </motion.span>
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: maxDrag }}
                      dragElastic={0}
                      dragMomentum={false}
                      onDragEnd={handleDragEnd}
                      style={{ x }}
                      className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: thumbWidth,
                          height: thumbWidth,
                          background: "linear-gradient(135deg, var(--swift-teal), var(--swift-deep))",
                          boxShadow: "0 0 20px rgba(48,176,176,0.5)",
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(48,176,176,0.1) 50%, transparent 100%)", backgroundSize: "200% 100%" }}
                    animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* ───── UNLOCKED PHASE ───── */}
            {phase === "unlocked" && (
              <motion.div
                key="unlocked"
                className="absolute inset-0 flex flex-col items-center justify-center px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ background: "#060a10" }}
              >
                {/* Burst particles */}
                {BURST_PARTICLES.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: p.w,
                      height: p.h,
                      background: i % 2 === 0 ? "var(--swift-teal)" : "white",
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                ))}

                <motion.img
                  src="/images/favicon.png"
                  alt=""
                  className="w-24 h-24 mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                  style={{ filter: "drop-shadow(0 0 20px rgba(48,176,176,0.8))" }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs uppercase tracking-[4px] text-[var(--swift-teal)] mb-4"
                >
                  Welcome to
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  className="text-2xl md:text-3xl font-bold text-center mb-3 leading-snug"
                  style={{
                    background: "linear-gradient(135deg, #fff 0%, var(--swift-teal) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  The Magical Design World
                </motion.h2>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 150 }}
                  className="text-3xl md:text-4xl font-black text-center"
                  style={{
                    background: "linear-gradient(135deg, var(--swift-teal), #7ef5f5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  of Swift Designz
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
