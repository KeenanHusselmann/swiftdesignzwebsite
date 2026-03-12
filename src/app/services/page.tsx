"use client";

import { motion } from "framer-motion";
import {
  Code2,
  ShoppingBag,
  Smartphone,
  GraduationCap,
  BrainCircuit,
  ArrowRight,
  Check,
  Layout,
  Search,
  Palette,
  Database,
  Shield,
  Gauge,
  Megaphone,
  BarChart3,
  Cpu,
  Cloud,
  Workflow,
  Target,
  Lightbulb,
  Headphones,
  Wrench,
  RefreshCw,
  Activity,
  Clock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WebDevCodeSim from "@/components/ui/WebDevCodeSim";
import EcommerceCheckoutSim from "@/components/ui/EcommerceCheckoutSim";
import BudgetingAppSim from "@/components/ui/BudgetingAppSim";
import ProjectTrackingSheetSim from "@/components/ui/ProjectTrackingSheetSim";
import AiChatSim from "@/components/ui/AiChatSim";
import SupportVoiceSim from "@/components/ui/SupportVoiceSim";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

function SimWrapper({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const { t } = useI18n();
  return (
    <div className="relative cursor-pointer" onClick={() => setRevealed(true)}>
      {children}
      {!revealed && (
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
          style={{ background: "rgba(10,15,26,0.55)", backdropFilter: "blur(2px)", pointerEvents: "none" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "8px" }}>
            <circle cx="12" cy="12" r="10" stroke="#30B0B0" strokeWidth="1.5" />
            <path d="M10 8l6 4-6 4V8z" fill="#30B0B0" />
          </svg>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.3px" }}>
            {t("servicesPage.tapDemo")}
          </span>
          <span style={{ color: "rgba(48,176,176,0.8)", fontSize: "10px", marginTop: "4px" }}>
            {t("servicesPage.interactiveDemo")}
          </span>
        </div>
      )}
    </div>
  );
}

const services = [
  {
    id: "web",
    icon: Code2,
    hideIcon: true,
    title: "Web Development",
    subtitle: "Custom websites that reflect You",
    description:
      "We build modern, responsive websites using the latest frameworks and technologies. Every site is crafted to reflect your brand identity, optimised for performance, and designed to convert visitors into customers.",
    features: [
      { icon: Layout, text: "Responsive Design" },
      { icon: Search, text: "SEO Optimised" },
      { icon: Palette, text: "Custom UI/UX Design" },
      { icon: Gauge, text: "Performance Optimised" },
      { icon: Shield, text: "Security Best Practices" },
      { icon: Code2, text: "Clean, Maintainable Code" },
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    hideIcon: true,
    title: "E-Commerce Stores",
    subtitle: "Showcase your products beautifully",
    description:
      "From simple product catalogues to full-featured online stores, we create e-commerce experiences that showcase your products and make it easy for customers to browse, enquire, and buy.",
    features: [
      { icon: ShoppingBag, text: "Product Catalogues" },
      { icon: Database, text: "Inventory Management" },
      { icon: Palette, text: "Custom Storefront Design" },
      { icon: Search, text: "Product Search & Filters" },
      { icon: Megaphone, text: "Marketing Integration" },
      { icon: Gauge, text: "Fast Loading Times" },
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "apps",
    icon: Smartphone,
    hideIcon: true,
    title: "Apps & Software",
    subtitle: "Custom solutions for your business",
    description:
      "Need a mobile app or custom software? We develop tailored solutions that streamline your operations, engage your users, and scale with your business. From MVPs to enterprise-grade systems.",
    features: [
      { icon: Smartphone, text: "Mobile Applications" },
      { icon: Cpu, text: "Custom Software" },
      { icon: Cloud, text: "Cloud Integration" },
      { icon: Database, text: "Database Design" },
      { icon: Shield, text: "Secure Architecture" },
      { icon: Workflow, text: "API Development" },
    ],
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
  },
  {
    id: "training",
    icon: GraduationCap,
    hideIcon: true,
    title: "Project Management Training",
    subtitle: "Empower your team",
    description:
      "Equip your team with proven project management methodologies and tools. Our training covers Agile, Scrum, and traditional PM approaches, tailored to your organisation's needs and maturity level.",
    features: [
      { icon: BarChart3, text: "Agile & Scrum" },
      { icon: Workflow, text: "Process Optimisation" },
      { icon: GraduationCap, text: "Team Workshops" },
      { icon: Target, text: "Goal Setting" },
      { icon: Check, text: "Best Practices" },
      { icon: Megaphone, text: "Communication Skills" },
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: "ai",
    icon: BrainCircuit,
    hideIcon: true,
    title: "AI Training",
    subtitle: "Harness the power of AI",
    description:
      "Artificial intelligence is transforming business. Our AI training helps you understand and leverage AI tools to automate processes, generate content, analyse data, and gain competitive advantages.",
    features: [
      { icon: BrainCircuit, text: "AI Fundamentals" },
      { icon: Cpu, text: "Prompt Engineering" },
      { icon: Workflow, text: "Workflow Automation" },
      { icon: BarChart3, text: "Data Analysis" },
      { icon: Cloud, text: "AI Tools & Platforms" },
      { icon: Lightbulb, text: "Practical Applications" },
    ],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
  {
    id: "support",
    icon: Headphones,
    hideIcon: true,
    title: "Support & Maintenance",
    subtitle: "Always in your corner",
    description:
      "Your product doesn't stop after launch — and neither do we. We provide reliable ongoing support, proactive maintenance, security updates, and performance monitoring to keep your digital assets running at their best.",
    features: [
      { icon: Wrench, text: "Bug Fixes & Patches" },
      { icon: RefreshCw, text: "Software Updates" },
      { icon: Activity, text: "Performance Monitoring" },
      { icon: Shield, text: "Security Audits" },
      { icon: Clock, text: "24/7 Availability" },
      { icon: MessageSquare, text: "Dedicated Communication" },
    ],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
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

export default function ServicesPage() {
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
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              {t("servicesPage.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("servicesPage.title")} <span className="text-gradient">{t("servicesPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("servicesPage.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, i) => (
        <section key={service.id} id={service.id} className="section">
          <div className="container">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={i % 2 === 1 ? "lg:order-2" : ""}
              >
                <div className="flex items-center gap-3 mb-4">
                  {!service.hideIcon && (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(48, 176, 176, 0.1)" }}
                    >
                      <service.icon size={20} color="var(--swift-teal)" />
                    </div>
                  )}
                  <span className="text-xs tracking-[3px] uppercase text-[var(--swift-teal)] font-semibold">
                    {t(`servicesPage.s${i+1}Sub`)}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t(`servicesPage.s${i+1}Title`)}</h2>
                <div className="section-divider" />
                <p className="text-gray-400 mt-6 mb-8 leading-relaxed">{t(`servicesPage.s${i+1}Desc`)}</p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-3 mb-8"
                >
                  {service.features.map((feature, j) => (
                    <motion.div
                      key={j}
                      variants={itemVariants}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <feature.icon size={14} color="var(--swift-teal)" />
                      {feature.text}
                    </motion.div>
                  ))}
                </motion.div>

                <Link href="/packages" className="neon-btn">
                  {t("servicesPage.viewPackages")} <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                {service.id === "web" ? (
                  <WebDevCodeSim />
                ) : service.id === "ecommerce" ? (
                  <EcommerceCheckoutSim />
                ) : service.id === "apps" ? (
                  <SimWrapper><BudgetingAppSim /></SimWrapper>
                ) : service.id === "training" ? (
                  <SimWrapper><ProjectTrackingSheetSim /></SimWrapper>
                ) : service.id === "ai" ? (
                  <SimWrapper><AiChatSim /></SimWrapper>
                ) : service.id === "support" ? (
                  <SupportVoiceSim />
                ) : (
                  <div className="glass p-3 rounded-2xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={t(`servicesPage.s${i+1}Title`)}
                      width={600}
                      height={320}
                      className="w-full h-64 md:h-80 object-cover rounded-xl"
                    />
                  </div>
                )}
                {/* Decorative glow */}
                <div
                  className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] opacity-20"
                  style={{ background: "var(--swift-teal)" }}
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Custom Solution CTA */}
      <section id="custom-solution" className="section overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
            style={{ padding: "clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)" }}
          >
            {/* ── Animated background ── */}
            {/* Deep base */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #040d14 0%, #071a1a 50%, #040d14 100%)" }} />

            {/* Rotating conic spotlight */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, transparent 60deg, rgba(48,176,176,0.18) 120deg, transparent 180deg, rgba(80,144,144,0.12) 240deg, transparent 300deg, rgba(48,176,176,0.1) 360deg)",
                animation: "ctaSpin 18s linear infinite",
                borderRadius: "inherit",
              }}
            />

            {/* Radial core glow */}
            <div
              className="absolute"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%", height: "70%",
                background: "radial-gradient(ellipse, rgba(48,176,176,0.13) 0%, transparent 70%)",
                animation: "ctaPulseGlow 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* Corner accent — top-left */}
            <div
              className="absolute top-0 left-0 opacity-60"
              style={{
                width: "280px", height: "280px",
                background: "radial-gradient(circle at 0% 0%, rgba(48,176,176,0.22) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            {/* Corner accent — bottom-right */}
            <div
              className="absolute bottom-0 right-0 opacity-60"
              style={{
                width: "280px", height: "280px",
                background: "radial-gradient(circle at 100% 100%, rgba(80,144,144,0.2) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />

            {/* Floating grid dots */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              style={{ pointerEvents: "none" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="ctaDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#30B0B0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaDots)" />
            </svg>

            {/* Horizontal scan line */}
            <div
              className="absolute left-0 right-0 h-px opacity-40 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(48,176,176,0.6) 30%, rgba(48,176,176,0.9) 50%, rgba(48,176,176,0.6) 70%, transparent)",
                animation: "ctaScan 6s ease-in-out infinite",
                top: "0%",
              }}
            />

            {/* Border glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: "1px solid rgba(48,176,176,0.25)",
                boxShadow: "inset 0 0 60px rgba(48,176,176,0.04), 0 0 80px rgba(48,176,176,0.08)",
                animation: "ctaBorderPulse 3.5s ease-in-out infinite",
              }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 text-center">
              {/* Top label */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#30B0B0] opacity-60" />
                <span style={{ color: "#30B0B0", fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase" }}>
                  {t("servicesPage.ctaEyebrow")}
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#30B0B0] opacity-60" />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                {t("servicesPage.ctaTitle")}{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #7ef5f5 0%, #30B0B0 50%, #509090 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t("servicesPage.ctaHighlight")}
                </span>
                ?
              </h2>

              <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontSize: "clamp(14px, 2vw, 17px)" }}>
                {t("servicesPage.ctaDesc")}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2.5 justify-center mb-10">
                {[
                  t("servicesPage.ctaFreeConsult"),
                  t("servicesPage.ctaFixed"),
                  t("servicesPage.ctaRemote"),
                  t("servicesPage.ctaFast"),
                  t("servicesPage.ctaSupport"),
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "9999px",
                      background: "rgba(48,176,176,0.08)",
                      border: "1px solid rgba(48,176,176,0.2)",
                      color: "#7dd3d3",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link href="/contact" className="neon-btn-filled neon-btn" style={{ fontSize: "15px", padding: "14px 36px" }}>
                {t("servicesPage.ctaBtn")} <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes ctaSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes ctaPulseGlow {
            0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
            50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes ctaScan {
            0%   { top: 0%;   opacity: 0;   }
            10%  { opacity: 0.4; }
            90%  { opacity: 0.4; }
            100% { top: 100%; opacity: 0;   }
          }
          @keyframes ctaBorderPulse {
            0%, 100% { box-shadow: inset 0 0 60px rgba(48,176,176,0.04), 0 0 80px rgba(48,176,176,0.08); }
            50%       { box-shadow: inset 0 0 80px rgba(48,176,176,0.08), 0 0 120px rgba(48,176,176,0.16); }
          }
        `}</style>
      </section>
    </>
  );
}
