"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { trackEvent } from "@/lib/analytics";
import TestimonialCard from "@/components/sections/TestimonialCard";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";

function DisneyStarAnimation() {
  const [iter, setIter] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIter((k) => k + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const path = "M -80 600 C 100 200, 400 -60, 820 120";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 740 700"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "hidden" }}
    >
      <defs>
        <filter id="sd-starGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sd-trailGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="sd-trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
          <stop offset="55%" stopColor="#fcd34d" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* key on <g> forces SMIL to restart cleanly each interval */}
      <g key={iter}>
        {/* Trail — pathLength=1 lets us use dashoffset 1→0 to draw it */}
        <path
          d={path}
          fill="none"
          stroke="url(#sd-trailGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          filter="url(#sd-trailGlow)"
          opacity="0"
        >
          <animate attributeName="stroke-dashoffset" from="1" to="0"
            dur="2.2s" begin="0s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.85;0.85;0"
            keyTimes="0;0.05;0.68;1" dur="2.2s" begin="0s" fill="freeze" />
        </path>

        {/* Main star dot */}
        <circle r="5" fill="#fde68a" filter="url(#sd-starGlow)" opacity="0">
          <animateMotion dur="2.2s" begin="0s" path={path} rotate="auto" fill="freeze" />
          <animate attributeName="opacity" values="0;1;1;0"
            keyTimes="0;0.05;0.85;1" dur="2.2s" begin="0s" fill="freeze" />
        </circle>

        {/* Sparkle trailing behind at 0.18s delay */}
        <circle r="2.5" fill="#fcd34d" filter="url(#sd-starGlow)" opacity="0">
          <animateMotion dur="2.2s" begin="0.18s" path={path} rotate="auto" fill="freeze" />
          <animate attributeName="opacity" values="0;0.85;0"
            keyTimes="0;0.2;1" dur="1.9s" begin="0.18s" fill="freeze" />
        </circle>

        {/* Sparkle trailing at 0.34s delay */}
        <circle r="2" fill="#fbbf24" filter="url(#sd-starGlow)" opacity="0">
          <animateMotion dur="2.2s" begin="0.34s" path={path} rotate="auto" fill="freeze" />
          <animate attributeName="opacity" values="0;0.65;0"
            keyTimes="0;0.2;1" dur="1.7s" begin="0.34s" fill="freeze" />
        </circle>
      </g>
    </svg>
  );
}

const services = [
  {
    title: "Web Development",
    tag: "Website",
    num: "01",
    desc: "Custom websites built with modern frameworks, optimised for speed, SEO, and stunning design.",
    href: "/services#web",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=70",
  },
  {
    title: "E-Commerce Stores",
    tag: "Store",
    num: "02",
    desc: "Online stores and digital catalogues that showcase your products beautifully and drive sales.",
    href: "/services#ecommerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70",
  },
  {
    title: "Apps & Software",
    tag: "Mobile",
    num: "03",
    desc: "Custom mobile applications and software solutions tailored to your business needs.",
    href: "/services#apps",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=70",
  },
  {
    title: "Project Management Training",
    tag: "Training",
    num: "04",
    desc: "Equip your team with the skills and methodologies to deliver projects on time and on budget.",
    href: "/services#training",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=70",
  },
  {
    title: "AI Training",
    tag: "AI",
    num: "05",
    desc: "Learn how to leverage artificial intelligence to automate workflows and boost productivity.",
    href: "/services#ai",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=70",
  },
  {
    title: "Support & Maintenance",
    tag: "Support",
    num: "06",
    desc: "Reliable ongoing support, bug fixes, updates, and performance monitoring to keep your product running at its best.",
    href: "/services#support",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=70",
  },
];

const highlights = [
  {
    title: "Fast Delivery",
    stat: "< 48h",
    counter: { prefix: "< ", from: 72, to: 48, suffix: "h", decimals: 0 },
    statLabel: "response time",
    barWidth: "75%",
    desc: "Quick turnaround without compromising on quality.",
    visual: "deploy",
  },
  {
    title: "Creative Design",
    stat: "100%",
    counter: { prefix: "", from: 0, to: 100, suffix: "%", decimals: 0 },
    statLabel: "custom crafted",
    barWidth: "90%",
    desc: "Unique, eye-catching designs that make your brand stand out.",
    visual: "design",
  },
  {
    title: "Dedicated Support",
    stat: "24/7",
    counter: { prefix: "", from: 0, to: 24, suffix: "/7", decimals: 0 },
    statLabel: "always here",
    barWidth: "65%",
    desc: "Ongoing support and communication throughout your project.",
    visual: "support",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function DeployVisual() {
  const lines = [
    { text: "$ git push origin main", delay: 0, color: "#e0e0e0" },
    { text: "Compiling... ████████ 100%", delay: 0.6, color: "#30B0B0" },
    { text: "Running tests... ✓ passed", delay: 1.2, color: "#4ade80" },
    { text: "Deploying to production...", delay: 1.8, color: "#e0e0e0" },
    { text: "✓ Live in 38 seconds", delay: 2.4, color: "#30B0B0" },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center px-4 py-3" style={{ background: "rgba(6,10,10,0.95)", fontFamily: "'Courier New', monospace" }}>
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
        <span className="text-[10px] text-[#555] ml-2">swift-designz ~ deploy</span>
      </div>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: l.delay, duration: 0.3, repeat: Infinity, repeatDelay: 3.5 }}
          className="text-[11px] leading-6"
          style={{ color: l.color }}
        >
          {l.text}
        </motion.div>
      ))}
    </div>
  );
}

function DesignVisual() {
  const steps = [0, 1, 2, 3, 4];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, []);

  const elements = [
    { x: 18, y: 28, w: 64, h: 10, label: "Header", color: "#30B0B0", appear: 1 },
    { x: 18, y: 48, w: 44, h: 7, label: "Body text", color: "#509090", appear: 2 },
    { x: 18, y: 64, w: 28, h: 9, label: "Button", color: "#30B0B0", appear: 3, isBtn: true },
    { x: 70, y: 44, w: 22, h: 22, label: "Image", color: "#307070", appear: 4, isImg: true },
  ];

  const cursorPositions = [
    { x: "72%", y: "18%" },
    { x: "20%", y: "30%" },
    { x: "20%", y: "50%" },
    { x: "20%", y: "67%" },
    { x: "71%", y: "52%" },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: "#080d0d" }}>
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#30B0B0" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* Canvas frame */}
      <div className="absolute inset-4 rounded-lg overflow-hidden"
        style={{ border: "1px solid rgba(48,176,176,0.2)", background: "rgba(12,18,18,0.9)" }}>

        {/* Toolbar strip */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b" style={{ borderColor: "rgba(48,176,176,0.12)", background: "rgba(6,10,10,0.8)" }}>
          {["#30B0B0","#509090","#307070","#e0e0e0","#101010"].map((c,i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, opacity: step >= 1 ? 1 : 0.3, transition: "opacity 0.4s" }} />
          ))}
          <div className="ml-auto text-[9px] font-mono" style={{ color: "rgba(48,176,176,0.5)" }}>swift.fig</div>
        </div>

        {/* Design area */}
        <div className="relative" style={{ height: "calc(100% - 28px)" }}>
          {elements.map((el, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: step >= el.appear ? 1 : 0, scale: step >= el.appear ? 1 : 0.85 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute flex items-center justify-center"
              style={{
                left: `${el.x}%`, top: `${el.y}%`,
                width: `${el.w}%`, height: `${el.h}%`,
                background: el.isBtn
                  ? el.color
                  : el.isImg
                  ? `repeating-linear-gradient(45deg, rgba(48,176,176,0.08) 0px, rgba(48,176,176,0.08) 4px, transparent 4px, transparent 8px)`
                  : `rgba(48,176,176,0.07)`,
                border: `1px solid ${el.color}55`,
                borderRadius: el.isBtn ? "4px" : el.isImg ? "6px" : "3px",
              }}
            >
              {el.isImg ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={el.color} strokeWidth="1.5" opacity="0.6">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                </svg>
              ) : (
                <span className="text-[8px] font-mono truncate px-1" style={{ color: el.isBtn ? "#080d0d" : el.color, fontWeight: el.isBtn ? 700 : 400, opacity: 0.9 }}>{el.label}</span>
              )}
            </motion.div>
          ))}

          {/* Selection box on active element */}
          {step >= 1 && step <= 4 && (() => {
            const el = elements[step - 1];
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute pointer-events-none"
                style={{
                  left: `calc(${el.x}% - 2px)`, top: `calc(${el.y}% - 2px)`,
                  width: `calc(${el.w}% + 4px)`, height: `calc(${el.h}% + 4px)`,
                  border: "1.5px solid #30B0B0",
                  borderRadius: "4px",
                  boxShadow: "0 0 6px rgba(48,176,176,0.5)",
                }}
              >
                {["-1px -1px","calc(100% - 2px) -1px","-1px calc(100% - 2px)","calc(100% - 2px) calc(100% - 2px)"].map((pos, i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-sm bg-white border border-[#30B0B0]"
                    style={{ left: pos.split(" ")[0], top: pos.split(" ")[1] }} />
                ))}
              </motion.div>
            );
          })()}

          {/* Cursor */}
          <motion.div
            className="absolute pointer-events-none z-10"
            animate={{ left: cursorPositions[step].x, top: cursorPositions[step].y }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ position: "absolute" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l4.5 11 2-4.5L12 5.5z" fill="white" stroke="#30B0B0" strokeWidth="0.8"/>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SupportVisual() {
  const messages = [
    { text: "Hey! I need help with my site.", mine: false, delay: 0 },
    { text: "On it! What's the issue?", mine: true, delay: 0.8 },
    { text: "The checkout page is broken 😬", mine: false, delay: 1.6 },
    { text: "Fixed & deployed ✓", mine: true, delay: 2.6 },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-end px-3 py-3 gap-1.5" style={{ background: "rgba(6,10,10,0.95)" }}>
      <div className="flex items-center gap-2 mb-1 pb-1.5 border-b border-white/5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(48,176,176,0.2)", color: "#30B0B0" }}>SD</div>
        <span className="text-[11px] text-[#888]">Swift Designz Support</span>
        <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </div>
      {messages.map((m, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: m.delay, duration: 0.3, repeat: Infinity, repeatDelay: 3.5 }}
          className={`text-[10.5px] px-2.5 py-1.5 rounded-xl max-w-[80%] ${m.mine ? "self-end" : "self-start"}`}
          style={{
            background: m.mine ? "rgba(48,176,176,0.22)" : "rgba(255,255,255,0.07)",
            color: m.mine ? "#30B0B0" : "#ccc",
            border: m.mine ? "1px solid rgba(48,176,176,0.3)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {m.text}
        </motion.div>
      ))}
    </div>
  );
}

function HighlightVisual({ visual }: { visual: string }) {
  if (visual === "deploy") return <DeployVisual />;
  if (visual === "design") return <DesignVisual />;
  return <SupportVisual />;
}

function CounterStat({
  prefix, from, to, suffix, decimals, duration = 1.8, delay = 0,
}: {
  prefix: string; from: number; to: number; suffix: string; decimals: number; duration?: number; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame: number;
    const totalMs = duration * 1000;
    const startDelay = delay * 1000;
    const run = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start - startDelay;
      if (elapsed < 0) { frame = requestAnimationFrame(run); return; }
      const progress = Math.min(elapsed / totalMs, 1);
      // ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(run);
      else setDisplay(to);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [inView, from, to, duration, delay]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [revealStep, setRevealStep] = useState(0);
  const testimonialSectionRef = useRef<HTMLDivElement>(null);
  const testimonialSectionInView = useInView(testimonialSectionRef, { once: true });
  const [activeTIdx, setActiveTIdx] = useState(-1);
  const { t } = useI18n();

  useEffect(() => {
    if (testimonialSectionInView && activeTIdx === -1) setActiveTIdx(0);
  }, [testimonialSectionInView, activeTIdx]);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const line1 = t("hero.line1");
  const line2 = t("hero.line2");
  const totalLetters = line1.length + line2.length;

  const excellenceFonts = [
    "var(--font-playfair), serif",
    "var(--font-cinzel), serif",
    "var(--font-cormorant), serif",
    "var(--font-bebas), sans-serif",
    "var(--font-lobster), cursive",
    "var(--font-abril), serif",
    "var(--font-orbitron), sans-serif",
    "var(--font-raleway), sans-serif",
  ];

  const [fontIndex, setFontIndex] = useState(0);
  const [excellenceRevealed, setExcellenceRevealed] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealStep(i);
      if (i >= totalLetters + 2) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [totalLetters]);

  useEffect(() => {
    if (revealStep > totalLetters) {
      setExcellenceRevealed(true);
    }
  }, [revealStep, totalLetters]);

  useEffect(() => {
    if (!excellenceRevealed) return;
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % excellenceFonts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [excellenceRevealed, excellenceFonts.length]);

  return (
    <>
      {/* ======= HERO ======= */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Starfield background */}
        <StarfieldCanvas />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(6,10,18,0.45)" }} />

        {/* Disney shooting star */}
        <DisneyStarAnimation />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container text-center relative z-10">
          {/* Rotating favicon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-[9.5rem] h-[9.5rem] md:w-48 md:h-48 relative"
            >
              <Image
                src="/images/favicon.png"
                alt="Swift Designz"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>

          <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.15] md:leading-[1.2]">
            {/* Line 1: "Crafting" — Tetris blocks building up */}
            <span className="inline-block">
              {line1.split("").map((char, i) => {
                const isVisible = revealStep > i;
                return (
                  <motion.span
                    key={`l1-${i}`}
                    initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }}
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }
                        : { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }
                    }
                    transition={{
                      duration: 0.45,
                      ease: [0.0, 0.0, 0.2, 1],
                      clipPath: { duration: 0.45, ease: [0.0, 0.0, 0.2, 1] },
                    }}
                    className="inline-block origin-bottom"
                    style={{ minWidth: char === " " ? "0.3em" : undefined }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {" "}
            {/* Line 2: "Digital" — Tetris blocks building up */}
            <span className="inline-block">
              {line2.split("").map((char, i) => {
                const globalIndex = line1.length + i;
                const isVisible = revealStep > globalIndex;
                return (
                  <motion.span
                    key={`l2-${i}`}
                    initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }}
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }
                        : { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }
                    }
                    transition={{
                      duration: 0.45,
                      ease: [0.0, 0.0, 0.2, 1],
                      clipPath: { duration: 0.45, ease: [0.0, 0.0, 0.2, 1] },
                    }}
                    className="inline-block origin-bottom"
                    style={{ minWidth: char === " " ? "0.3em" : undefined }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            <br />
            {/* "Excellence" — reserve height immediately to avoid layout shift */}
            <span className="inline-block min-h-[1.5em] md:min-h-[1.6em]">
            <motion.span
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                revealStep > totalLetters
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.9 }
              }
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-gradient inline-block font-normal leading-[1.35] pt-3 pb-2 md:pt-4 md:pb-3"
              style={{ fontFamily: excellenceFonts[fontIndex], fontWeight: 400 }}
            >
              {t("hero.line3")}
            </motion.span>
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
            {t("hero.description")}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/packages" onClick={() => trackEvent("view_packages_click", "hero_cta")} className="neon-btn-filled neon-btn w-full sm:w-auto justify-center">
              {t("hero.viewPackages")}
              <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" onClick={() => trackEvent("see_work_click", "hero_cta")} className="neon-btn w-full sm:w-auto justify-center">
              {t("hero.seeWork")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ======= HIGHLIGHTS ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("home.highlightsEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              {t("home.highlightsTitle1")} <span className="text-gradient">{t("home.highlightsHighlight")}</span> {t("home.highlightsTitle2")}
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 0 40px rgba(217,119,6,0.22), 0 12px 48px rgba(0,0,0,0.55)",
                  borderColor: "rgba(217,119,6,0.5)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" as const }}
                className="relative overflow-hidden rounded-3xl group cursor-default"
                style={{
                  background: "rgba(12, 12, 14, 0.92)",
                  border: "1px solid rgba(217, 119, 6, 0.2)",
                  boxShadow: "0 0 28px rgba(217,119,6,0.14), 0 4px 32px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* ── Animated visual ── */}
                <div className="relative h-[200px] overflow-hidden">
                  <HighlightVisual visual={item.visual} />

                  {/* Cinematic overlay — image fades into card body */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(12,12,14,0.05) 0%, rgba(12,12,14,0.12) 55%, rgba(12,12,14,0.94) 100%)",
                    }}
                  />

                  {/* Teal scan-line sweep */}
                  <motion.div
                    className="absolute left-0 right-0 h-[1.5px] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 5%, rgba(48,176,176,0.85) 50%, transparent 95%)",
                    }}
                    animate={{ top: ["0%", "105%"], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      ease: "linear" as const,
                      repeat: Infinity,
                      repeatDelay: 2 + i * 0.8,
                    }}
                  />

                  {/* Glowing stat badge */}
                  <div
                    className="absolute top-4 right-4 text-right select-none px-3 py-1.5 rounded-xl"
                    style={{
                      background: "rgba(4, 10, 10, 0.78)",
                      border: "1px solid rgba(48,176,176,0.18)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <motion.div
                      className="text-3xl md:text-4xl font-bold"
                      style={{
                        color: "var(--swift-teal)",
                        textShadow:
                          "0 0 12px rgba(48,176,176,0.6), 0 0 24px rgba(48,176,176,0.25)",
                        letterSpacing: "-0.02em",
                      }}
                      animate={{ opacity: [0.75, 1, 0.75] }}
                      transition={{
                        duration: 2.5 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                      }}
                    >
                      <CounterStat
                        prefix={item.counter.prefix}
                        from={item.counter.from}
                        to={item.counter.to}
                        suffix={item.counter.suffix}
                        decimals={item.counter.decimals}
                        duration={1.6}
                        delay={0.3 + i * 0.15}
                      />
                    </motion.div>
                    <div className="text-[9px] uppercase tracking-[0.18em] text-gray-500 mt-0.5">
                      {t(`home.h${i+1}Stat`)}
                    </div>
                  </div>

                  {/* Top-left circuit corner bracket */}
                  <div
                    className="absolute top-0 left-0 w-7 h-7 pointer-events-none"
                    style={{
                      borderTop: "2px solid rgba(48,176,176,0.65)",
                      borderLeft: "2px solid rgba(48,176,176,0.65)",
                      borderTopLeftRadius: "14px",
                    }}
                  />
                </div>

                {/* ── Card body ── */}
                <div className="relative px-6 pb-6 pt-4">
                  {/* Teal hairline divider */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(48,176,176,0.4), transparent)",
                    }}
                  />

                  <h3 className="text-lg font-semibold mb-1.5 group-hover:text-[var(--swift-teal)] transition-colors duration-300">
                    {t(`home.h${i+1}Title`)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t(`home.h${i+1}Desc`)}</p>

                  {/* Animated progress bar */}
                  <div
                    className="mt-4 h-[2px] rounded-full overflow-hidden"
                    style={{ background: "rgba(48,176,176,0.08)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--swift-teal), var(--swift-muted))",
                      }}
                      initial={{ width: "0%" }}
                      whileInView={{ width: item.barWidth }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.4,
                        delay: 0.3 + i * 0.15,
                        ease: "easeOut" as const,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom-right circuit corner bracket */}
                <div
                  className="absolute bottom-0 right-0 w-7 h-7 pointer-events-none"
                  style={{
                    borderBottom: "2px solid rgba(48,176,176,0.25)",
                    borderRight: "2px solid rgba(48,176,176,0.25)",
                    borderBottomRightRadius: "14px",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======= SERVICES OVERVIEW ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("home.servicesEyebrow")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              {t("home.servicesTitle")} <span className="text-gradient">{t("home.servicesHighlight")}</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow:
                    "0 0 0 1px rgba(48,176,176,0.45), 0 8px 40px rgba(48,176,176,0.14), 0 20px 60px rgba(0,0,0,0.5)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="relative rounded-2xl overflow-hidden group"
                style={{
                  background: "rgba(10, 12, 14, 0.9)",
                  border: "1px solid rgba(48, 176, 176, 0.12)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Faint themed background image */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src={service.image}
                      alt={t(`home.s${i+1}Title`)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={70}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEklEQVR42mMQkJD4jw8zjAwFAMjAT8EeYpgGAAAAAElFTkSuQmCC"
                      className="object-cover opacity-[0.35] group-hover:opacity-[0.5] transition-opacity duration-500"
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(40,40,40,0.82) 0%, rgba(32,32,32,0.75) 60%, rgba(24,24,24,0.68) 100%)",
                    }}
                  />
                </div>

                {/* Animated left accent border */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, var(--swift-teal), transparent)",
                    boxShadow: "0 0 8px rgba(48,176,176,0.6)",
                  }}
                />

                <Link href={service.href} className="block relative z-10 p-6 md:p-8">
                  {/* Top row: tag chip + watermark number */}
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-[10px] uppercase tracking-[3px] px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: "rgba(180, 83, 9, 0.07)",
                        border: "1px solid rgba(180, 83, 9, 0.22)",
                        color: "#b45309",
                      }}
                    >
                      {t(`home.s${i+1}Tag`)}
                    </span>
                    <span
                      className="text-5xl font-black leading-none select-none transition-colors duration-300"
                      style={{ color: "rgba(255,255,255,0.04)" }}
                    >
                      {service.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 group-hover:text-[var(--swift-teal)] transition-colors duration-300">
                    {t(`home.s${i+1}Title`)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                    {t(`home.s${i+1}Desc`)}
                  </p>

                  {/* Explore row */}
                  <div
                    className="flex items-center gap-2 text-xs font-semibold tracking-wide"
                    style={{ color: "var(--swift-teal)" }}
                  >
                    <span>{t("home.servicesExplore")}</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                        delay: i * 0.3,
                      }}
                      className="flex items-center"
                    >
                      <ArrowRight size={13} />
                    </motion.span>
                  </div>
                </Link>

                {/* Bottom sweep line on viewport enter */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, var(--swift-teal), transparent)",
                    }}
                    initial={{ x: "-110%" }}
                    whileInView={{ x: "110%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.3,
                      delay: 0.4 + i * 0.15,
                      ease: "easeInOut" as const,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======= TESTIMONIAL PREVIEW ======= */}
      <section className="section" ref={testimonialSectionRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("home.testimonialsEyebrow")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              {t("home.testimonialsTitle")} <span className="text-gradient">{t("home.testimonialsHighlight")}</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <TestimonialCard
              quote="The banner, overall look and feel, font and clean flowing state of the site is STUNNING. User Experience pleasant, calm and inviting. The way I see it you've done a lot of research than what was probably provided. I am very proud of what you've produced."
              name="Satisfied Client"
              role="Business Owner"
              delay={0}
              isActive={activeTIdx === 0}
              isPending={activeTIdx >= 0 && activeTIdx < 1}
              onDone={() => setActiveTIdx(1)}
            />
            <TestimonialCard
              quote="From my experience working with many developers across various projects, you should be proud of yourself. You take ownership, and your work ethic truly stands out. Your work clearly reflects your passion, dedication, and skill."
              name="Industry Professional"
              role="Project Manager - Ambrose Isaacs"
              delay={0.1}
              isActive={activeTIdx === 1}
              isPending={activeTIdx >= 0 && activeTIdx < 2}
              onDone={() => setActiveTIdx(2)}
            />
            <TestimonialCard
              quote="This is soooo beautiful. I am speechless. The colours, the feel — you got it all. I love this now... it speaks of hope, new mercies in the morning. You are truly blessed with a great gift."
              name="Ruth Gwasira"
              role="Client — Ruby's Faith Jewellery"
              delay={0.2}
              isActive={activeTIdx === 2}
              isPending={activeTIdx >= 0 && activeTIdx < 3}
              onDone={() => setActiveTIdx(3)}
            />
            <TestimonialCard
              quote="Ek kan nie glo dis my shop nie. Alles is baie smart. Dis 'n great 'shoppers' website! Baie dankie vir die goeie navorsing wat jy gedoen het by die beskrywings. Ek is oorweldig!"
              name="Yvonne Steenkamp"
              role="Client — Fryse"
              delay={0.3}
              isActive={activeTIdx === 3}
              isPending={activeTIdx >= 0 && activeTIdx < 4}
              onDone={() => setActiveTIdx(4)}
            />
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong p-8 md:p-12 lg:p-16 text-center rounded-3xl relative overflow-hidden"
          >
            {/* Animated starfield background */}
            <StarfieldCanvas />

            {/* Dark overlay so text stays readable */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "rgba(6,10,18,0.55)" }}
            />

            {/* Decorative border glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: "1px solid rgba(48, 176, 176, 0.25)",
                boxShadow: "inset 0 1px 0 rgba(48, 176, 176, 0.15)",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("home.ctaTitle")}{" "}
                <span className="text-gradient">{t("home.ctaHighlight")}</span>?
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto mb-8">
                {t("home.ctaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" onClick={() => trackEvent("contact_click", "bottom_cta")} className="neon-btn-filled neon-btn">
                  {t("home.ctaStart")}
                  <ArrowRight size={18} />
                </Link>
                <Link href="/packages" onClick={() => trackEvent("view_packages_click", "bottom_cta")} className="neon-btn">
                  {t("home.ctaPricing")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
