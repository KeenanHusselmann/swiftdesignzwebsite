"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Mail, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24">
      {/* Glow blob */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          style={{
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(48,176,176,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 max-w-xl w-full text-center"
        style={{
          background: "rgba(16,16,16,0.72)",
          border: "1px solid rgba(48,176,176,0.18)",
          borderRadius: 20,
          backdropFilter: "blur(18px)",
          padding: "56px 40px 48px",
        }}
      >
        {/* Glitchy 404 */}
        <motion.div
          animate={{ opacity: [1, 0.85, 1, 0.9, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          style={{
            fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
            fontSize: "clamp(96px, 20vw, 144px)",
            lineHeight: 1,
            letterSpacing: "0.04em",
            background: "linear-gradient(135deg, #30B0B0 0%, #509090 50%, #307070 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          404
        </motion.div>

        <h1
          className="text-white font-semibold mb-3"
          style={{ fontSize: "clamp(18px, 4vw, 24px)", letterSpacing: "-0.01em" }}
        >
          Page Not Found
        </h1>

        <p className="mb-2" style={{ color: "#a0a0a0", fontSize: 15, lineHeight: 1.7 }}>
          Looks like this page packed up and left.{" "}
          <span style={{ color: "#30B0B0" }}>Probably found a better URL.</span>
        </p>
        <p className="mb-8" style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>
          Don&apos;t panic — the rest of the site is alive and well. Here&apos;s how to get back on track:
        </p>

        {/* Terminal-style hint */}
        <div
          className="text-left mb-8"
          style={{
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(48,176,176,0.12)",
            borderRadius: 10,
            padding: "14px 18px",
            fontFamily: "monospace",
            fontSize: 12,
            color: "#30B0B0",
          }}
        >
          <span style={{ color: "#509090" }}>$ </span>
          <span style={{ color: "#ccc" }}>cd </span>
          <span style={{ color: "#30B0B0" }}>/ </span>
          <span style={{ color: "#666" }}># back to safety</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all"
            style={{
              padding: "11px 24px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #30B0B0, #307070)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <Home size={15} />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all"
            style={{
              padding: "11px 24px",
              borderRadius: 10,
              background: "rgba(48,176,176,0.06)",
              border: "1px solid rgba(48,176,176,0.22)",
              color: "#30B0B0",
              textDecoration: "none",
            }}
          >
            <Mail size={15} />
            Contact Us
          </Link>
        </div>

        <p className="mt-8" style={{ color: "#444", fontSize: 11 }}>
          Swift Designz &mdash; crafting digital excellence, one page at a time
        </p>
      </motion.div>
    </section>
  );
}
