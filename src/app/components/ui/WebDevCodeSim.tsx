"use client";

import { useEffect, useRef, useState } from "react";

type Seg = { t: string; c: string };

// VSCode-inspired syntax colours
const K = "#569cd6";  // tag brackets / keywords (blue)
const T = "#4ec9b0";  // tag names (teal-green)
const A = "#9cdcfe";  // attribute names (light blue)
const S = "#ce9178";  // strings (peach/orange)
const X = "#d4d4d4";  // plain text (light grey)
const C = "#7c8593";  // comments / doctype (grey)

const LINES: Seg[][] = [
  [{ t: "<!DOCTYPE html>", c: C }],
  [{ t: "<", c: K }, { t: "html", c: T }, { t: " lang=", c: A }, { t: '"en"', c: S }, { t: ">", c: K }],
  [{ t: "  <", c: K }, { t: "head", c: T }, { t: ">", c: K }],
  [{ t: "    <", c: K }, { t: "meta", c: T }, { t: " charset=", c: A }, { t: '"UTF-8"', c: S }, { t: " />", c: K }],
  [{ t: "    <", c: K }, { t: "title", c: T }, { t: ">", c: K }, { t: "Swift Designz", c: S }, { t: "</", c: K }, { t: "title", c: T }, { t: ">", c: K }],
  [{ t: "    <", c: K }, { t: "link", c: T }, { t: " rel=", c: A }, { t: '"stylesheet"', c: S }, { t: " href=", c: A }, { t: '"styles.css"', c: S }, { t: " />", c: K }],
  [{ t: "  </", c: K }, { t: "head", c: T }, { t: ">", c: K }],
  [{ t: "  <", c: K }, { t: "body", c: T }, { t: ">", c: K }],
  [{ t: "    <", c: K }, { t: "section", c: T }, { t: " class=", c: A }, { t: '"hero"', c: S }, { t: ">", c: K }],
  [{ t: "      <", c: K }, { t: "h1", c: T }, { t: " class=", c: A }, { t: '"heading"', c: S }, { t: ">", c: K }, { t: "Build Something Amazing", c: X }, { t: "</", c: K }, { t: "h1", c: T }, { t: ">", c: K }],
  [{ t: "      <", c: K }, { t: "p", c: T }, { t: " class=", c: A }, { t: '"subtitle"', c: S }, { t: ">", c: K }],
  [{ t: "        Crafting digital excellence", c: X }],
  [{ t: "      </", c: K }, { t: "p", c: T }, { t: ">", c: K }],
  [{ t: "      <", c: K }, { t: "button", c: T }, { t: " class=", c: A }, { t: '"neon-btn"', c: S }, { t: ">", c: K }, { t: "Get Started", c: X }, { t: "</", c: K }, { t: "button", c: T }, { t: ">", c: K }],
  [{ t: "    </", c: K }, { t: "section", c: T }, { t: ">", c: K }],
  [{ t: "  </", c: K }, { t: "body", c: T }, { t: ">", c: K }],
  [{ t: "</", c: K }, { t: "html", c: T }, { t: ">", c: K }],
];

function lineLen(line: Seg[]) {
  return line.reduce((s, g) => s + g.t.length, 0);
}

function getVisible(line: Seg[], n: number): Seg[] {
  const out: Seg[] = [];
  let rem = n;
  for (const g of line) {
    if (rem <= 0) break;
    out.push({ t: g.t.slice(0, rem), c: g.c });
    rem -= g.t.length;
  }
  return out;
}

export default function WebDevCodeSim() {
  const [ln, setLn] = useState(0);
  const [ch, setCh] = useState(0);
  const [blink, setBlink] = useState(true);
  const state = useRef({ ln: 0, ch: 0, paused: false });
  const codeRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll to show current line
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [ln]);

  // Typing engine
  useEffect(() => {
    const t = setInterval(() => {
      const s = state.current;
      if (s.paused) return;

      const total = lineLen(LINES[s.ln]);
      // Empty line — advance immediately
      if (total === 0) {
        if (s.ln + 1 < LINES.length) {
          s.ln++;
          s.ch = 0;
          setLn(s.ln);
          setCh(0);
        }
        return;
      }

      if (s.ch < total) {
        s.ch = Math.min(s.ch + 3, total);
        setCh(s.ch);
      } else if (s.ln + 1 < LINES.length) {
        s.ln++;
        s.ch = 0;
        setLn(s.ln);
        setCh(0);
      } else {
        // All lines typed — pause, then loop
        s.paused = true;
        setTimeout(() => {
          s.ln = 0;
          s.ch = 0;
          s.paused = false;
          setLn(0);
          setCh(0);
        }, 2500);
      }
    }, 28);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontSize: "12.5px",
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "#161b22",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        <span style={{ color: "#7d8590", fontSize: "11px", marginLeft: "12px" }}>
          index.html
        </span>
        <span
          style={{
            color: "#30B0B0",
            fontSize: "10px",
            marginLeft: "auto",
            letterSpacing: "0.5px",
          }}
        >
          ● EDITING
        </span>
      </div>

      {/* ── Editor body ── */}
      <div className="flex" style={{ background: "#0d1117" }}>
        {/* Line numbers */}
        <div
          className="py-4 px-3 select-none text-right"
          style={{
            borderRight: "1px solid rgba(255,255,255,0.05)",
            minWidth: "2.5rem",
          }}
        >
          {LINES.slice(0, ln + 1).map((_, i) => (
            <div
              key={i}
              style={{
                lineHeight: "1.75",
                color: i === ln ? "#6e7681" : "#3d444d",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <div
          ref={codeRef}
          className="py-4 px-4 flex-1"
          style={{
            minHeight: "20rem",
            maxHeight: "20rem",
            overflowY: "hidden",
          }}
        >
          {LINES.map((line, i) => {
            if (i > ln) return null;
            const segs = i === ln ? getVisible(line, ch) : line;
            return (
              <div key={i} style={{ lineHeight: "1.75", whiteSpace: "pre" }}>
                {segs.map((g, j) => (
                  <span key={j} style={{ color: g.c }}>
                    {g.t}
                  </span>
                ))}
                {i === ln && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      background: blink ? "#30B0B0" : "transparent",
                      verticalAlign: "text-bottom",
                      marginLeft: "1px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{
          background: "#161422",
          borderTop: "1px solid rgba(48,176,176,0.1)",
          fontSize: "10px",
          color: "#7d8590",
        }}
      >
        <span style={{ color: "#30B0B0" }}>HTML</span>
        <span>
          Ln {ln + 1}, Col {ch + 1}
        </span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
