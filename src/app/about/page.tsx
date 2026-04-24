"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FallingBlocksCanvas from "@/app/components/ui/FallingBlocksCanvas";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

function StarfieldText({ children }: { children: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.offsetWidth || 320;
    const H = canvas.offsetHeight || 80;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const stars = Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * W * 4,
      y: (Math.random() - 0.5) * H * 4,
      z: Math.random() * 500,
    }));
    const CX = W / 2, CY = H / 2;
    let frame: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.z += 2.2;
        if (s.z > 500) { s.x = (Math.random() - 0.5) * W * 4; s.y = (Math.random() - 0.5) * H * 4; s.z = 1; }
        const scale = 160 / s.z;
        const px = CX + s.x * scale;
        const py = CY + s.y * scale;
        if (px < 0 || px > W || py < 0 || py > H) continue;
        const r = Math.max(0.15, 1.8 * (1 - s.z / 500));
        const opacity = 0.9 * (1 - s.z / 500);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        borderRadius: "8px",
        padding: "2px 14px 4px",
        fontSize: "1.25em",
        verticalAlign: "middle",
        overflow: "hidden",
        boxShadow: "0 0 18px rgba(48,176,176,0.2), inset 0 0 12px rgba(48,176,176,0.05)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #050d1a 0%, #0a0f1a 55%, #050d1a 100%)",
          borderRadius: "8px",
        }}
      />
      <span
        className="text-gradient"
        style={{ position: "relative", fontWeight: "inherit" }}
      >
        {children}
      </span>
    </span>
  );
}

const timeline = [
  {
    year: "Education",
    title: "Software Development Degree",
    desc: "Completed a comprehensive degree in Software Development, building a strong foundation in programming, architecture, and modern development practices.",
  },
  {
    year: "2+ Years",
    title: "Web Development & E-Commerce",
    desc: "Built custom websites and online stores for businesses across South Africa, delivering stunning designs that drive results.",
  },
  {
    year: "1+ Year",
    title: "Apps & Software Development",
    desc: "Expanded into mobile applications and custom software solutions, helping businesses streamline operations and reach more customers.",
  },
  {
    year: "Experience",
    title: "Project Management",
    desc: "Led and coordinated small agile teams of 5–7 members, driving projects from planning to delivery with clear communication, structured sprints, and a focus on quality outcomes.",
  },
];

const valueAccents: Record<string, { bar: string; badge: string; stroke: string; hover: string }> = {
  amber: {
    bar: "linear-gradient(90deg, #d97706, #92400e)",
    badge: "rgba(217,119,6,0.7)",
    stroke: "rgba(217,119,6,0.1)",
    hover: "rgba(217,119,6,",
  },
  teal: {
    bar: "linear-gradient(90deg, #30B0B0, #307070)",
    badge: "rgba(48,176,176,0.7)",
    stroke: "rgba(48,176,176,0.1)",
    hover: "rgba(48,176,176,",
  },
};

const values = [
  {
    num: "01",
    accent: "amber" as const,
    title: "Ownership",
    desc: "Every project is treated as if it were our own. We take full responsibility from concept to delivery.",
    highlight: "full responsibility",
  },
  {
    num: "02",
    accent: "teal" as const,
    title: "Passion",
    desc: "We genuinely love what we do. That passion shows in every pixel, every line of code, and every interaction.",
    highlight: "every pixel",
  },
  {
    num: "03",
    accent: "amber" as const,
    title: "Innovation",
    desc: "We stay ahead of the curve, using the latest technologies and design trends to give your brand an edge.",
    highlight: "latest technologies",
  },
  {
    num: "04",
    accent: "teal" as const,
    title: "Collaboration",
    desc: "Your vision drives the project. We work closely with you, ensuring every detail aligns with your goals.",
    highlight: "Your vision",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function TimelineConnector({ index }: { index: number }) {
  const leftCurve = index % 2 === 0;
  const cp1x = leftCurve ? 70 : 230;
  const cp2x = leftCurve ? 230 : 70;
  const path = `M 150 0 C ${cp1x} 22, ${cp2x} 38, 150 60`;
  const connId = `tc-path-${index}`;

  return (
    <div className="flex justify-center" style={{ height: 60 }}>
      <svg width="300" height="60" viewBox="0 0 300 60" style={{ overflow: "visible" }}>
        {/* Static dim track */}
        <path
          id={connId}
          d={path}
          stroke="rgba(217,119,6,0.15)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Animated electrical dashes */}
        <path
          d={path}
          stroke="rgba(217,119,6,0.85)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 13"
          style={{
            animation: "electricFlow 0.85s linear infinite",
            animationDelay: `${index * 0.35}s`,
          }}
        />
        {/* Secondary faint arc for depth */}
        <path
          d={path}
          stroke="rgba(252,211,77,0.3)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 20"
          style={{
            animation: "electricFlow 1.4s linear infinite",
            animationDelay: `${index * 0.2}s`,
            filter: "blur(2px)",
          }}
        />
        {/* Traveling glow orb */}
        <circle
          r="4"
          fill="rgba(217,119,6,1)"
          style={{ filter: "drop-shadow(0 0 7px rgba(252,180,0,1))" }}
        >
          <animateMotion dur="1.8s" repeatCount="indefinite" calcMode="linear">
            <mpath href={`#${connId}`} />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      {/* Hero */}
      <section className="section pt-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("about.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("about.title")}{" "}<br></br>
              
              <StarfieldText>{t("about.titleHighlight")}</StarfieldText>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("about.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="pb-2">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden px-5 py-4 flex items-center gap-4 max-w-xl mx-auto"
            style={{
              background: "linear-gradient(120deg, rgba(217,119,6,0.1) 0%, rgba(180,83,9,0.06) 100%)",
              border: "1px solid rgba(217,119,6,0.25)",
              boxShadow: "0 4px 28px rgba(217,119,6,0.08)",
            }}
          >
          

            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[3px] mb-0.5"
                style={{ color: "#d97706" }}
              >
                {t("about.dykLabel")}
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {t("about.dykText1")}{" "}
                <span className="text-white font-semibold">{t("about.dykHighlight")}</span>{t("about.dykText2")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
                {t("about.missionEyebrow")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                {t("about.missionTitle")} <span className="text-gradient">{t("about.missionHighlight")}</span>
              </h2>
              <div className="section-divider" />
              <p className="text-gray-400 mt-6 mb-4 leading-relaxed">
                {t("about.missionP1")}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t("about.missionP2")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-6 md:p-8 relative overflow-hidden"
            >
              <div className="scan-line absolute inset-0 pointer-events-none" />
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#d97706", textShadow: "0 0 14px rgba(217,119,6,0.6)" }}>3+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {t("about.statsYears")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#d97706", textShadow: "0 0 14px rgba(217,119,6,0.6)" }}>BSc</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {t("about.statsDegree")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#d97706", textShadow: "0 0 14px rgba(217,119,6,0.6)" }}>7+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {t("about.statsProjects")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#d97706", textShadow: "0 0 14px rgba(217,119,6,0.6)" }}>100%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {t("about.statsSatisfaction")}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("about.timelineEyebrow")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              {t("about.timelineTitle")} <span className="text-gradient">{t("about.timelineHighlight")}</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {timeline.map((item, i) => (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="glass glass-hover p-5 md:p-8 relative"
                >
                  <span className="text-xs text-[var(--swift-teal)] tracking-[2px] uppercase font-semibold">
                    {t(`about.t${i+1}Year`)}
                  </span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">{t(`about.t${i+1}Title`)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t(`about.t${i+1}Desc`)}</p>
                </motion.div>
                {i < timeline.length - 1 && <TimelineConnector index={i} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("about.valuesEyebrow")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              {t("about.valuesTitle")} <span className="text-gradient">{t("about.valuesHighlight")}</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {values.map((value, i) => {
              const ac = valueAccents[value.accent];
              return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative overflow-hidden rounded-2xl p-6 md:p-8 group"
                style={{
                  background: "linear-gradient(135deg, rgba(16,20,30,0.9) 0%, rgba(24,36,44,0.85) 100%)",
                  border: `1px solid ${ac.hover}0.15)`,
                  boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ac.hover}0.5)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 48px ${ac.hover}0.18), 0 0 0 1px ${ac.hover}0.2)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ac.hover}0.15)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(0,0,0,0.3)";
                }}
              >
                {/* Large watermark number */}
                <span
                  className="absolute -top-3 -right-2 text-[3.5rem] md:text-[7rem] font-black leading-none select-none pointer-events-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${ac.stroke}`,
                    transition: "opacity 0.3s",
                  }}
                >
                  {value.num}
                </span>
                {/* Top accent bar */}
                <div
                  className="w-10 h-[3px] rounded-full mb-5"
                  style={{ background: ac.bar }}
                />
                {/* Number badge */}
                <span
                  className="text-xs font-bold tracking-[3px] uppercase mb-3 block"
                  style={{ color: ac.badge }}
                >
                  {value.num}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{t(`about.v${i+1}Name`)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t(`about.v${i+1}Desc`).split(t(`about.v${i+1}Highlight`)).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <span style={{ color: ac.badge }} className="font-semibold">{t(`about.v${i+1}Highlight`)}</span>
                      )}
                    </span>
                  ))}
                </p>
                {/* Bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${ac.hover}0.8), transparent)`,
                    transition: "opacity 0.4s",
                  }}
                />
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="lets-build" className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-strong p-8 md:p-12 lg:p-16 text-center rounded-3xl overflow-hidden"
          >
            <FallingBlocksCanvas />
            {/* Dark overlay so text stays readable */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "rgba(6,10,18,0.45)" }}
            />
            <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.ctaTitle")} <span className="text-gradient">{t("about.ctaHighlight")}</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              {t("about.ctaDesc")}
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              {t("about.ctaBtn")}
              <ArrowRight size={18} />
            </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
