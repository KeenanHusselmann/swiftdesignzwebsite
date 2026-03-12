"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "typing" | "thinking" | "streaming" | "pausing";

const EXCHANGES = [
  {
    model: "GPT-4o",
    prompt: "Write a tagline for my handmade jewellery store.",
    response:
      '"Crafted with love, worn with pride — jewellery that tells your story."',
    tokens: 42,
  },
  {
    model: "Claude 3.5",
    prompt: "List 3 ways AI can save my business time today.",
    response:
      "1. Automate customer support with an AI chatbot\n2. Generate marketing copy in seconds\n3. Analyse sales data to spot trends instantly",
    tokens: 61,
  },
  {
    model: "Gemini 1.5",
    prompt: "Improve this subject line: 'Newsletter — March edition'",
    response:
      "\"What's new this March? Big updates inside 🚀\" — or try: \"You don't want to miss what happened this month.\"",
    tokens: 55,
  },
  {
    model: "GPT-4o",
    prompt: "Summarise this workflow and suggest an automation.",
    response:
      "Your workflow has 3 manual steps that could be automated: data entry, report generation, and email follow-ups — saving ~4 hours per week.",
    tokens: 74,
  },
];

const MODEL_COLORS: Record<string, string> = {
  "GPT-4o": "#34d399",
  "Claude 3.5": "#f472b6",
  "Gemini 1.5": "#60a5fa",
  "Copilot": "#30B0B0",
};

export default function AiChatSim() {
  const [exchangeIdx, setExchangeIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [streamedResponse, setStreamedResponse] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  const [history, setHistory] = useState<{ prompt: string; response: string; model: string }[]>([]);

  const phaseRef = useRef<Phase>("typing");
  const clearRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = (t: ReturnType<typeof setTimeout>) => clearRefs.current.push(t);

  useEffect(() => {
    return () => clearRefs.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    clearRefs.current.forEach(clearTimeout);
    clearRefs.current = [];

    const ex = EXCHANGES[exchangeIdx];
    setTypedPrompt("");
    setStreamedResponse("");
    setTokenCount(0);
    phaseRef.current = "typing";
    setPhase("typing");

    // Phase 1: type the prompt
    let charIdx = 0;
    const typeChar = () => {
      if (charIdx < ex.prompt.length) {
        charIdx++;
        setTypedPrompt(ex.prompt.slice(0, charIdx));
        clear(setTimeout(typeChar, 35));
      } else {
        // Phase 2: thinking
        phaseRef.current = "thinking";
        setPhase("thinking");
        clear(
          setTimeout(() => {
            // Move prompt to chat, start streaming
            setHistory((h) => {
              const last = h[h.length - 1];
              if (last?.prompt === ex.prompt) return h;
              return [...h.slice(-1), { prompt: ex.prompt, response: "", model: ex.model }];
            });
            setTypedPrompt("");
            phaseRef.current = "streaming";
            setPhase("streaming");

            // Phase 3: stream response word by word
            const words = ex.response.split(" ");
            let wIdx = 0;
            setTokenCount(0);
            const streamWord = () => {
              if (wIdx < words.length) {
                const w = wIdx;
                wIdx++;
                setStreamedResponse((prev) => (prev ? prev + " " + words[w] : words[w]));
                setTokenCount((n) => n + 1);
                clear(setTimeout(streamWord, 80));
              } else {
                // Phase 4: pause then next
                phaseRef.current = "pausing";
                setPhase("pausing");
                clear(
                  setTimeout(() => {
                    setExchangeIdx((i) => (i + 1) % EXCHANGES.length);
                  }, 2200)
                );
              }
            };
            clear(setTimeout(streamWord, 80));
          }, 900)
        );
      }
    };
    clear(setTimeout(typeChar, 300));
  }, [exchangeIdx]);

  const ex = EXCHANGES[exchangeIdx];
  const modelColor = MODEL_COLORS[ex.model] ?? "#30B0B0";

  const lastHistory = history[history.length - 1];

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        fontSize: "12px",
        background: "#0a0f1a",
        minHeight: "22rem",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 shrink-0"
        style={{ background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        <span style={{ color: "#7d8590", fontSize: "11px", marginLeft: "8px" }}>
          AI Workspace — Prompt Studio
        </span>
        {/* Model chips */}
        <div className="flex gap-1.5 ml-auto">
          {Object.keys(MODEL_COLORS).map((m) => (
            <span
              key={m}
              style={{
                padding: "2px 7px",
                borderRadius: "9999px",
                fontSize: "8px",
                fontWeight: m === ex.model ? 700 : 400,
                background: m === ex.model ? `${MODEL_COLORS[m]}22` : "rgba(255,255,255,0.04)",
                color: m === ex.model ? MODEL_COLORS[m] : "#3d444d",
                border: m === ex.model ? `1px solid ${MODEL_COLORS[m]}44` : "1px solid transparent",
                transition: "all 0.3s",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: "14rem", maxHeight: "14rem" }}>
        {/* Previous exchange (faded) */}
        {lastHistory && (
          <div className="flex flex-col gap-2" style={{ opacity: 0.4 }}>
            {/* User */}
            <div className="flex justify-end">
              <div
                style={{
                  background: "rgba(48,176,176,0.12)",
                  border: "1px solid rgba(48,176,176,0.2)",
                  borderRadius: "12px 12px 2px 12px",
                  padding: "7px 11px",
                  color: "#d4d4d4",
                  maxWidth: "80%",
                  fontSize: "11px",
                  lineHeight: "1.5",
                }}
              >
                {lastHistory.prompt}
              </div>
            </div>
            {/* AI */}
            <div className="flex gap-2.5">
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: `${MODEL_COLORS[lastHistory.model] ?? "#30B0B0"}22`,
                  border: `1px solid ${MODEL_COLORS[lastHistory.model] ?? "#30B0B0"}44`,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                }}
              >
                <span style={{ fontSize: "9px", color: MODEL_COLORS[lastHistory.model] ?? "#30B0B0" }}>AI</span>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "2px 12px 12px 12px",
                  padding: "7px 11px",
                  color: "#d4d4d4",
                  maxWidth: "85%",
                  fontSize: "11px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                }}
              >
                {lastHistory.response}
              </div>
            </div>
          </div>
        )}

        {/* Current user message (shown once prompt is submitted) */}
        {(phase === "thinking" || phase === "streaming" || phase === "pausing") && (
          <div className="flex justify-end">
            <div
              style={{
                background: "rgba(48,176,176,0.12)",
                border: "1px solid rgba(48,176,176,0.2)",
                borderRadius: "12px 12px 2px 12px",
                padding: "7px 11px",
                color: "#d4d4d4",
                maxWidth: "80%",
                fontSize: "11px",
                lineHeight: "1.5",
              }}
            >
              {ex.prompt}
            </div>
          </div>
        )}

        {/* Thinking dots */}
        {phase === "thinking" && (
          <div className="flex gap-2.5 items-start">
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: `${modelColor}22`,
                border: `1px solid ${modelColor}44`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "9px", color: modelColor }}>AI</span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "2px 12px 12px 12px",
                padding: "10px 14px",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: modelColor,
                    display: "inline-block",
                    animation: `aiDot 1.1s ease-in-out ${i * 0.2}s infinite`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Streaming / completed response */}
        {(phase === "streaming" || phase === "pausing") && streamedResponse && (
          <div className="flex gap-2.5 items-start">
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: `${modelColor}22`,
                border: `1px solid ${modelColor}44`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2px",
              }}
            >
              <span style={{ fontSize: "9px", color: modelColor }}>AI</span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "2px 12px 12px 12px",
                padding: "7px 11px",
                color: "#d4d4d4",
                maxWidth: "85%",
                fontSize: "11px",
                lineHeight: "1.6",
                whiteSpace: "pre-line",
              }}
            >
              {streamedResponse}
              {phase === "streaming" && (
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "12px",
                    background: modelColor,
                    marginLeft: "2px",
                    verticalAlign: "middle",
                    animation: "aiCursor 0.7s step-end infinite",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex-1 flex items-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${phase === "typing" ? `${modelColor}55` : "rgba(255,255,255,0.07)"}`,
            borderRadius: "8px",
            padding: "6px 10px",
            transition: "border-color 0.3s",
            minHeight: "30px",
          }}
        >
          <span style={{ color: "#7d8590", fontSize: "10px", flex: 1 }}>
            {phase === "typing" ? (
              <>
                {typedPrompt}
                <span
                  style={{
                    display: "inline-block",
                    width: "1.5px",
                    height: "11px",
                    background: modelColor,
                    marginLeft: "1px",
                    verticalAlign: "middle",
                    animation: "aiCursor 0.7s step-end infinite",
                  }}
                />
              </>
            ) : (
              <span style={{ opacity: 0.35 }}>Ask anything about AI tools, prompts, or automation…</span>
            )}
          </span>
        </div>
        {/* Send button */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: phase === "typing" ? modelColor : "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke={phase === "typing" ? "#000" : "#3d444d"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Token counter */}
        <span style={{ color: "#3d444d", fontSize: "8px", minWidth: "50px", textAlign: "right" }}>
          {tokenCount > 0 ? `~${tokenCount} tokens` : ""}
        </span>
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between px-4 py-1"
        style={{ background: "#161422", borderTop: "1px solid rgba(48,176,176,0.1)", fontSize: "8px", color: "#3d444d" }}
      >
        <span style={{ color: modelColor }}>{ex.model}</span>
        <span>Swift Designz AI Training</span>
        <span style={{ color: "#34d399" }}>Prompt Engineering ✓</span>
      </div>

      <style>{`
        @keyframes aiDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes aiCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
