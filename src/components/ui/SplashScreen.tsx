"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Cookies from "js-cookie";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const sliderWidth = 280;
  const thumbWidth = 64;
  const maxDrag = sliderWidth - thumbWidth;

  const backgroundOpacity = useTransform(x, [0, maxDrag], [0, 1]);
  const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const seen = Cookies.get("swift-splash-seen");
    if (!seen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= maxDrag * 0.85) {
      setUnlocked(true);
      Cookies.set("swift-splash-seen", "true", { expires: 1 }); // 1 day
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, 800);
    }
  };

  if (!mounted || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "var(--swift-black)" }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: "var(--swift-teal)",
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src="/images/logo.png"
              alt="Swift Designz"
              className="h-20 w-auto"
            />
          </motion.div>

          {/* Welcome text */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-light mb-2 tracking-wider"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Welcome to
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-3xl md:text-5xl font-bold mb-16 text-gradient"
          >
            Swift Designz
          </motion.h2>

          {/* Slide to unlock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="relative"
          >
            <div
              ref={constraintsRef}
              className="relative rounded-full overflow-hidden"
              style={{
                width: sliderWidth,
                height: thumbWidth,
                background: "rgba(48, 176, 176, 0.08)",
                border: "1px solid rgba(48, 176, 176, 0.2)",
              }}
            >
              {/* Fill background */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(48, 176, 176, 0.15), rgba(48, 176, 176, 0.3))",
                  opacity: backgroundOpacity,
                }}
              />

              {/* Text */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-sm tracking-[3px] uppercase select-none pointer-events-none"
                style={{
                  color: "rgba(48, 176, 176, 0.5)",
                  opacity: textOpacity,
                  paddingLeft: "40px",
                }}
              >
                Slide to enter
              </motion.span>

              {/* Thumb */}
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
                    boxShadow: "var(--neon-glow)",
                  }}
                >
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={unlocked ? { rotate: 0 } : {}}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </motion.svg>
                </div>
              </motion.div>
            </div>

            {/* Shimmer hint */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(48, 176, 176, 0.1) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["-200% 0", "200% 0"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </motion.div>

          {/* Unlocked animation */}
          <AnimatePresence>
            {unlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "var(--swift-black)" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-bold text-gradient"
                >
                  Let&apos;s Go
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
