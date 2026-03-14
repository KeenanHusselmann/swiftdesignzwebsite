"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, background: "#101010", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 16px",
          }}
        >
          {/* radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 440,
                height: 440,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,80,80,0.06) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: 520,
              width: "100%",
              textAlign: "center",
              background: "rgba(16,16,16,0.78)",
              border: "1px solid rgba(255,80,80,0.18)",
              borderRadius: 20,
              backdropFilter: "blur(20px)",
              padding: "52px 40px 44px",
            }}
          >
            {/* Animated glitch icon */}
            <motion.div
              animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              style={{ marginBottom: 20 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,80,80,0.09)",
                  border: "1px solid rgba(255,80,80,0.22)",
                }}
              >
                <span style={{ fontSize: 28 }}>💥</span>
              </div>
            </motion.div>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}
            >
              Something went sideways
            </h1>

            <p
              style={{
                color: "#a0a0a0",
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 6,
              }}
            >
              Our server had a moment. These things happen.
            </p>
            <p
              style={{
                color: "#555",
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              <em>It is definitely not your fault.</em> Try refreshing — if it keeps happening, we&apos;d love to know about it.
            </p>

            {/* Digest for debugging */}
            {error.digest && (
              <div
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  marginBottom: 28,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#444",
                  textAlign: "left",
                }}
              >
                <span style={{ color: "#666" }}>Error ref: </span>
                <span style={{ color: "#509090" }}>{error.digest}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
              }}
            >
              <button
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 26px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #30B0B0, #307070)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.2px",
                }}
              >
                <RefreshCw size={15} />
                Try Again
              </button>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 26px",
                  borderRadius: 10,
                  background: "rgba(48,176,176,0.06)",
                  border: "1px solid rgba(48,176,176,0.2)",
                  color: "#30B0B0",
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: "none",
                  letterSpacing: "0.2px",
                }}
              >
                <Home size={15} />
                Take me home
              </a>
            </div>

            <p style={{ color: "#333", fontSize: 11, marginTop: 28 }}>
              Swift Designz &mdash; we&apos;ll get this sorted
            </p>
          </motion.div>
        </section>
      </body>
    </html>
  );
}
