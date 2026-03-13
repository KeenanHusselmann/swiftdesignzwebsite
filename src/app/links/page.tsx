"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Package,
  Briefcase,
  MessageSquare,
  FolderOpen,
  Phone,
  ArrowUpRight,
  Sparkles,
  Bot,
} from "lucide-react";

const LINKS = [
  {
    label: "Our Website",
    description: "Explore Swift Designz",
    href: "/",
    icon: Globe,
    highlight: false,
  },
  {
    label: "Services",
    description: "Web · Apps · E-Commerce · AI",
    href: "/services",
    icon: Briefcase,
    highlight: false,
  },
  {
    label: "Packages & Pricing",
    description: "Transparent pricing, no surprises",
    href: "/packages",
    icon: Package,
    highlight: false,
  },
  {
    label: "Get a Quote",
    description: "Start your project today",
    href: "/quote",
    icon: Sparkles,
    highlight: true,
  },
  {
    label: "Portfolio",
    description: "See our work in action",
    href: "/portfolio",
    icon: FolderOpen,
    highlight: false,
  },
  {
    label: "AI Training & PM Courses",
    description: "Upskill your team",
    href: "/services#training",
    icon: Bot,
    highlight: false,
  },
  {
    label: "Contact Us",
    description: "info@swiftdesignz.co.za",
    href: "/contact",
    icon: Phone,
    highlight: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function LinksPage() {
  return (
    <div className="links-page">
      {/* ── Background ── */}
      <div className="links-bg">
        <div className="links-grid" />
        <div className="links-orb links-orb-1" />
        <div className="links-orb links-orb-2" />
      </div>

      {/* ── Content ── */}
      <div className="links-inner">
        {/* Profile */}
        <motion.div
          className="links-profile"
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="links-avatar-ring">
            <Image
              src="/images/favicon.png"
              alt="Swift Designz Logo"
              width={80}
              height={80}
              className="links-avatar links-avatar--spin"
              priority
            />
          </div>
          <h1 className="links-name">Swift Designz</h1>
          <p className="links-tagline">
            Where ideas become digital reality.
          </p>
          <span className="links-handle">@swiftdesignz101</span>
        </motion.div>

        {/* Link buttons */}
        <motion.div
          className="links-list"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.href} variants={item}>
                <Link
                  href={link.href}
                  className={`links-card${link.highlight ? " links-card--highlight" : ""}`}
                >
                  <span className="links-card-icon">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="links-card-text">
                    <span className="links-card-label">{link.label}</span>
                    <span className="links-card-desc">{link.description}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="links-card-arrow"
                    strokeWidth={2}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="links-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          swiftdesignz.co.za
        </motion.p>
      </div>

      <style>{`
        .links-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #090d0d;
          padding: 48px 20px 40px;
          position: relative;
          overflow: hidden;
        }

        /* Hide the site navbar/footer on this page via layout slot if needed */

        .links-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .links-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(48,176,176,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(48,176,176,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .links-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }

        .links-orb-1 {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, #30B0B0 0%, transparent 70%);
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          animation: orbFloat 8s ease-in-out infinite alternate;
        }

        .links-orb-2 {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, #307070 0%, transparent 70%);
          bottom: -80px;
          right: -60px;
          opacity: 0.2;
          animation: orbFloat 11s ease-in-out infinite alternate-reverse;
        }

        @keyframes orbFloat {
          from { transform: translateX(-50%) translateY(0px); }
          to   { transform: translateX(-50%) translateY(30px); }
        }

        .links-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        /* ── Profile ── */
        .links-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .links-avatar-ring {
          width: 96px;
          height: 96px;
          margin-bottom: 4px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .links-avatar-ring::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(48,176,176,0.25) 0%, transparent 70%);
          filter: blur(12px);
          z-index: -1;
          animation: glowPulse 3s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {
          from { opacity: 0.5; transform: scale(0.95); }
          to   { opacity: 1;   transform: scale(1.05); }
        }

        .links-avatar {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: transparent;
          display: block;
        }

        .links-avatar--spin {
          animation: logoSpin 12s linear infinite;
          transform-origin: center;
        }

        .links-avatar--spin:hover {
          animation-duration: 3s;
        }

        @keyframes logoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .links-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin: 0;
        }

        .links-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.5;
        }

        .links-handle {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #30B0B0;
          border: 1px solid rgba(48,176,176,0.25);
          padding: 4px 14px;
          border-radius: 999px;
          margin-top: 4px;
        }

        /* ── Links list ── */
        .links-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .links-card {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #ffffff;
          text-decoration: none;
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .links-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(48,176,176,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.22s ease;
        }

        .links-card:hover {
          background: rgba(48,176,176,0.08);
          border-color: rgba(48,176,176,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(48,176,176,0.12);
        }

        .links-card:hover::before { opacity: 1; }

        .links-card:active {
          transform: translateY(0);
        }

        .links-card--highlight {
          background: rgba(48,176,176,0.12);
          border-color: rgba(48,176,176,0.4);
          box-shadow: 0 0 24px rgba(48,176,176,0.15);
        }

        .links-card--highlight:hover {
          background: rgba(48,176,176,0.2);
          border-color: rgba(48,176,176,0.6);
          box-shadow: 0 8px 40px rgba(48,176,176,0.25);
        }

        .links-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(48,176,176,0.1);
          color: #30B0B0;
          flex-shrink: 0;
        }

        .links-card--highlight .links-card-icon {
          background: rgba(48,176,176,0.2);
        }

        .links-card-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .links-card-label {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .links-card--highlight .links-card-label {
          color: #30B0B0;
        }

        .links-card-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .links-card-arrow {
          flex-shrink: 0;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .links-card:hover .links-card-arrow {
          color: #30B0B0;
          transform: translate(2px, -2px);
        }

        /* ── Footer ── */
        .links-footer {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
