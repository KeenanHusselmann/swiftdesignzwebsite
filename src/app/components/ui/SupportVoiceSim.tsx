"use client";

import { useEffect, useState } from "react";

const QUESTIONS = [
  "My website went down — can you help?",
  "How do I update my product listings?",
  "The contact form stopped sending emails.",
  "Can you add a new page to my site?",
  "Our checkout is throwing an error.",
  "I need a security audit done ASAP.",
  "How do I check my site's performance?",
  "Can we schedule a maintenance window?",
];

const STATUS_CYCLE = [
  { label: "Listening…",    color: "#30B0B0", dot: true  },
  { label: "Processing…",   color: "#fbbf24", dot: true  },
  { label: "Response sent", color: "#34d399", dot: false },
];

export default function SupportVoiceSim() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [statusIdx, setStatusIdx]     = useState(0);
  const [visible, setVisible]         = useState(true);
  const [ring, setRing]               = useState(0); // 0 | 1 | 2

  // Cycle questions every 3 s with a fade transition
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuestionIdx((i) => (i + 1) % QUESTIONS.length);
        setStatusIdx((s) => (s + 1) % STATUS_CYCLE.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Animate the ripple rings on a staggered loop
  useEffect(() => {
    const t = setInterval(() => setRing((r) => (r + 1) % 3), 600);
    return () => clearInterval(t);
  }, []);

  const status = STATUS_CYCLE[statusIdx];

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: "#0a0f1a",
        minHeight: "22rem",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 shrink-0"
        style={{ background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        <span style={{ color: "#7d8590", fontSize: "11px", marginLeft: "8px" }}>
          Support Centre — Live Assistance
        </span>
        <span
          className="ml-auto flex items-center gap-1.5"
          style={{ fontSize: "9px", color: "#34d399" }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#34d399",
              display: "inline-block",
              animation: "supportBlink 1.2s ease-in-out infinite",
            }}
          />
          ONLINE
        </span>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">

        {/* Mic + ripple rings */}
        <div className="relative flex items-center justify-center" style={{ width: "120px", height: "120px" }}>
          {/* Rings */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: `${70 + i * 22}px`,
                height: `${70 + i * 22}px`,
                borderRadius: "50%",
                border: `1px solid rgba(48,176,176,${ring === i ? 0.55 : 0.12})`,
                transition: "border-color 0.4s ease",
                animation: `supportRing ${1.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}

          {/* Mic button */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(48,176,176,0.25), rgba(48,176,176,0.08))",
              border: "1.5px solid rgba(48,176,176,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(48,176,176,0.2)",
              animation: "supportPulse 2s ease-in-out infinite",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Mic SVG */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="11" rx="3" fill="#30B0B0" opacity="0.9" />
              <path
                d="M5 10a7 7 0 0 0 14 0"
                stroke="#30B0B0"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <line x1="12" y1="17" x2="12" y2="21" stroke="#30B0B0" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9"  y1="21" x2="15" y2="21" stroke="#30B0B0" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: `${status.color}14`,
            border: `1px solid ${status.color}33`,
            transition: "all 0.4s ease",
          }}
        >
          {status.dot && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: status.color,
                display: "inline-block",
                animation: "supportBlink 0.9s ease-in-out infinite",
              }}
            />
          )}
          <span style={{ color: status.color, fontSize: "10px", fontWeight: 600 }}>
            {status.label}
          </span>
        </div>

        {/* Cycling question */}
        <div
          style={{
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
            textAlign: "center",
            padding: "0 8px",
          }}
        >
          <p style={{ color: "#d4d4d4", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>
            &ldquo;{QUESTIONS[questionIdx]}&rdquo;
          </p>
        </div>

        {/* Sound wave bars */}
        <div className="flex items-end gap-1" style={{ height: "28px" }}>
          {[3, 7, 12, 18, 22, 18, 12, 7, 3, 7, 12, 18, 22, 18, 12, 7, 3].map((h, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: `${h}px`,
                borderRadius: "2px",
                background: `rgba(48,176,176,${0.3 + (h / 22) * 0.55})`,
                animation: `supportWave 1.1s ease-in-out ${i * 0.06}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex justify-around px-4 py-3 shrink-0"
        style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {[
          { label: "Avg Response", value: "< 2 hrs" },
          { label: "Resolved",     value: "98.4%"   },
          { label: "Uptime",       value: "99.9%"   },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div style={{ color: "#30B0B0", fontSize: "13px", fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: "#3d444d", fontSize: "8px", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-1"
        style={{ background: "#161422", borderTop: "1px solid rgba(48,176,176,0.1)", fontSize: "8px", color: "#3d444d" }}
      >
        <span style={{ color: "#30B0B0" }}>Swift Designz Support</span>
        <span>24 / 7 availability</span>
        <span style={{ color: "#34d399" }}>Always in your corner ✓</span>
      </div>

      <style>{`
        @keyframes supportPulse {
          0%, 100% { box-shadow: 0 0 24px rgba(48,176,176,0.2); }
          50%       { box-shadow: 0 0 40px rgba(48,176,176,0.45); }
        }
        @keyframes supportRing {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1;   }
        }
        @keyframes supportBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes supportWave {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
