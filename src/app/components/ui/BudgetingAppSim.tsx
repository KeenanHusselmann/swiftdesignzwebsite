"use client";

import { useEffect, useState } from "react";

type Transaction = {
  icon: string;
  label: string;
  amount: number;
  category: "expense" | "income";
  color: string;
};

const TRANSACTIONS: Transaction[] = [
  { icon: "🏠", label: "Rent", amount: -8500, category: "expense", color: "#f87171" },
  { icon: "🛒", label: "Groceries", amount: -1240, category: "expense", color: "#fb923c" },
  { icon: "💼", label: "Salary", amount: 32000, category: "income", color: "#34d399" },
  { icon: "⚡", label: "Electricity", amount: -680, category: "expense", color: "#fb923c" },
  { icon: "📱", label: "Freelance", amount: 5500, category: "income", color: "#34d399" },
  { icon: "🎬", label: "Netflix", amount: -199, category: "expense", color: "#a78bfa" },
  { icon: "🚗", label: "Transport", amount: -950, category: "expense", color: "#fb923c" },
  { icon: "💊", label: "Medical", amount: -430, category: "expense", color: "#f87171" },
];

const BAR_DATA = [
  { month: "Jan", income: 28000, expense: 14200 },
  { month: "Feb", income: 30000, expense: 12800 },
  { month: "Mar", income: 29500, expense: 15600 },
  { month: "Apr", income: 32000, expense: 13400 },
  { month: "May", income: 37500, expense: 14900 },
  { month: "Jun", income: 34000, expense: 11800 },
];

const MAX_VAL = 38000;

type Screen = "dashboard" | "transactions" | "budget";

export default function BudgetingAppSim() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [visibleTx, setVisibleTx] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [budgetPct, setBudgetPct] = useState({ housing: 0, food: 0, transport: 0, savings: 0 });

  // Animate in transactions list
  useEffect(() => {
    if (screen !== "transactions") { setVisibleTx(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleTx(i);
      if (i >= TRANSACTIONS.length) clearInterval(t);
    }, 180);
    return () => clearInterval(t);
  }, [screen]);

  // Animate bars on dashboard
  useEffect(() => {
    if (screen !== "dashboard") { setBarsReady(false); return; }
    const t = setTimeout(() => setBarsReady(true), 200);
    return () => clearTimeout(t);
  }, [screen]);

  // Animate budget dials
  useEffect(() => {
    if (screen !== "budget") { setBudgetPct({ housing: 0, food: 0, transport: 0, savings: 0 }); return; }
    const t = setTimeout(() => {
      setBudgetPct({ housing: 87, food: 62, transport: 45, savings: 78 });
    }, 150);
    return () => clearTimeout(t);
  }, [screen]);

  const totalIncome = 37500;
  const totalExpense = 12000;
  const balance = totalIncome - totalExpense;

  const NAV: { id: Screen; icon: string; label: string }[] = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "budget", icon: "🎯", label: "Budget" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden select-none"
      style={{
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "12px",
      }}
    >
      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{ background: "#0a0f1a", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#7d8590", fontSize: "10px" }}>9:41 AM</span>
        <span style={{ color: "#30B0B0", fontWeight: 700, fontSize: "11px", letterSpacing: "0.5px" }}>
          SpendSmart
        </span>
        <span style={{ color: "#7d8590", fontSize: "10px" }}>🔋 84%</span>
      </div>

      {/* ── Main content ── */}
      <div style={{ background: "#0d1117", minHeight: "20rem", maxHeight: "20rem", overflowY: "auto" }}>

        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <div className="p-3">
            {/* Balance card */}
            <div
              className="rounded-xl p-4 mb-3"
              style={{
                background: "linear-gradient(135deg, rgba(48,176,176,0.2), rgba(48,176,176,0.05))",
                border: "1px solid rgba(48,176,176,0.25)",
              }}
            >
              <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>Total Balance</div>
              <div style={{ color: "#fff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                R {balance.toLocaleString()}
              </div>
              <div className="flex gap-4 mt-2">
                <div>
                  <div style={{ color: "#34d399", fontSize: "9px" }}>▲ Income</div>
                  <div style={{ color: "#d4d4d4", fontSize: "11px", fontWeight: 600 }}>R {totalIncome.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: "#f87171", fontSize: "9px" }}>▼ Expenses</div>
                  <div style={{ color: "#d4d4d4", fontSize: "11px", fontWeight: 600 }}>R {totalExpense.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div style={{ color: "#d4d4d4", fontSize: "10px", fontWeight: 600, marginBottom: "8px" }}>
                6-Month Overview
              </div>
              <div className="flex items-end gap-1.5">
                {BAR_DATA.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        style={{
                          width: "100%",
                          height: barsReady ? `${(d.income / MAX_VAL) * 60}px` : "0px",
                          background: "rgba(52,211,153,0.7)",
                          borderRadius: "2px 2px 0 0",
                          transition: `height 0.5s ease ${i * 0.08}s`,
                        }}
                      />
                      <div
                        style={{
                          width: "100%",
                          height: barsReady ? `${(d.expense / MAX_VAL) * 60}px` : "0px",
                          background: "rgba(248,113,113,0.7)",
                          borderRadius: "0 0 2px 2px",
                          transition: `height 0.5s ease ${i * 0.08 + 0.05}s`,
                        }}
                      />
                    </div>
                    <span style={{ color: "#3d444d", fontSize: "8px" }}>{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <span style={{ color: "#34d399", fontSize: "8px" }}>■ Income</span>
                <span style={{ color: "#f87171", fontSize: "8px" }}>■ Expenses</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Savings Rate", value: "68%", color: "#34d399" },
                { label: "Top Expense", value: "Rent", color: "#f87171" },
                { label: "Transactions", value: "24", color: "#30B0B0" },
                { label: "Budget Used", value: "54%", color: "#fbbf24" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div style={{ color: "#7d8590", fontSize: "8px" }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: "13px", fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {screen === "transactions" && (
          <div className="p-3">
            <div style={{ color: "#d4d4d4", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>
              June 2026
            </div>
            <div className="flex flex-col gap-1.5">
              {TRANSACTIONS.slice(0, visibleTx).map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animation: "txFadeIn 0.25s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{tx.icon}</span>
                  <span style={{ flex: 1, color: "#d4d4d4", fontSize: "10px" }}>{tx.label}</span>
                  <span
                    style={{
                      color: tx.category === "income" ? "#34d399" : "#f87171",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {tx.category === "income" ? "+" : ""}R {Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET */}
        {screen === "budget" && (
          <div className="p-3">
            <div style={{ color: "#d4d4d4", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>
              Budget Tracker — June
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: "🏠 Housing", pct: budgetPct.housing, color: "#f87171", spent: "R 8,500", budget: "R 9,800" },
                { label: "🛒 Food & Groceries", pct: budgetPct.food, color: "#fb923c", spent: "R 1,240", budget: "R 2,000" },
                { label: "🚗 Transport", pct: budgetPct.transport, color: "#fbbf24", spent: "R 950", budget: "R 2,100" },
                { label: "💰 Savings Goal", pct: budgetPct.savings, color: "#34d399", spent: "R 7,800", budget: "R 10,000" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "#d4d4d4", fontSize: "10px" }}>{b.label}</span>
                    <span style={{ color: "#7d8590", fontSize: "9px" }}>{b.spent} / {b.budget}</span>
                  </div>
                  <div
                    className="w-full rounded-full"
                    style={{ height: "6px", background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${b.pct}%`,
                        background: b.color,
                        borderRadius: "9999px",
                        transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)",
                        boxShadow: `0 0 8px ${b.color}88`,
                      }}
                    />
                  </div>
                  <div style={{ color: "#3d444d", fontSize: "8px", marginTop: "2px", textAlign: "right" }}>
                    {b.pct}% used
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div
              className="rounded-lg p-2 mt-3"
              style={{
                background: "rgba(48,176,176,0.08)",
                border: "1px solid rgba(48,176,176,0.2)",
              }}
            >
              <div style={{ color: "#30B0B0", fontSize: "9px", fontWeight: 600 }}>💡 AI Insight</div>
              <div style={{ color: "#7d8590", fontSize: "9px", marginTop: "2px" }}>
                You&apos;re on track to save R 2,200 more than last month. Keep it up!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div
        className="flex"
        style={{
          background: "#161b22",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setScreen(n.id)}
            className="flex-1 flex flex-col items-center py-2 gap-0.5"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              borderTop: screen === n.id ? "2px solid #30B0B0" : "2px solid transparent",
              transition: "border-color 0.2s",
            }}
          >
            <span style={{ fontSize: "14px" }}>{n.icon}</span>
            <span
              style={{
                fontSize: "8px",
                color: screen === n.id ? "#30B0B0" : "#3d444d",
                fontWeight: screen === n.id ? 600 : 400,
              }}
            >
              {n.label}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes txFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
