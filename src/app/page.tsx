"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
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
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Parcels prepared for fast delivery",
  },
  {
    title: "Creative Design",
    stat: "100%",
    counter: { prefix: "", from: 0, to: 100, suffix: "%", decimals: 0 },
    statLabel: "custom crafted",
    barWidth: "90%",
    desc: "Unique, eye-catching designs that make your brand stand out.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Design team collaborating around a creative workspace",
  },
  {
    title: "Dedicated Support",
    stat: "24/7",
    counter: { prefix: "", from: 0, to: 24, suffix: "/7", decimals: 0 },
    statLabel: "always here",
    barWidth: "65%",
    desc: "Ongoing support and communication throughout your project.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Support specialist assisting a client",
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
    }, 30);
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

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
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
            {/* "Excellence" — appears after the letters, in sophisticated font */}
            <motion.span
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                revealStep > totalLetters
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.9 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-gradient inline-block font-normal leading-[1.35] pt-3 pb-2 md:pt-4 md:pb-3"
              style={{ fontFamily: excellenceFonts[fontIndex], fontWeight: 400 }}
            >
              {t("hero.line3")}
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/packages" className="neon-btn-filled neon-btn w-full sm:w-auto justify-center">
              {t("hero.viewPackages")}
              <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className="neon-btn w-full sm:w-auto justify-center">
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
                {/* ── Full-bleed image ── */}
                <div className="relative h-[200px] overflow-hidden">
                  {/* Parallax zoom via CSS group-hover */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEklEQVR42mMQkJD4jw8zjAwFAMjAT8EeYpgGAAAAAElFTkSuQmCC"
                      className="object-cover"
                    />
                  </div>

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
                <Link href="/contact" className="neon-btn-filled neon-btn">
                  {t("home.ctaStart")}
                  <ArrowRight size={18} />
                </Link>
                <Link href="/packages" className="neon-btn">
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
