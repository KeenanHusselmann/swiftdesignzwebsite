"use client";

import { useEffect, useState, useRef, startTransition } from "react";

type TaskStatus = "done" | "in-progress" | "review" | "todo";

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: "high" | "medium" | "low";
  progress: number;
  due: string;
};

const TASKS: Task[] = [
  { id: "T-01", title: "Project Kickoff",       assignee: "KL", status: "done",        priority: "high",   progress: 100, due: "Mar 03" },
  { id: "T-02", title: "Requirements Gathering", assignee: "SP", status: "done",        priority: "high",   progress: 100, due: "Mar 07" },
  { id: "T-03", title: "Sprint Planning",         assignee: "KL", status: "in-progress", priority: "high",   progress: 65,  due: "Mar 14" },
  { id: "T-04", title: "UI Wireframes",           assignee: "TN", status: "in-progress", priority: "medium", progress: 40,  due: "Mar 16" },
  { id: "T-05", title: "Backend API Design",      assignee: "SP", status: "review",      priority: "high",   progress: 90,  due: "Mar 18" },
  { id: "T-06", title: "Stakeholder Review",      assignee: "KL", status: "todo",        priority: "medium", progress: 0,   due: "Mar 21" },
  { id: "T-07", title: "QA Testing",              assignee: "TN", status: "todo",        priority: "low",    progress: 0,   due: "Mar 28" },
];

const GANTT_ROWS = [
  { label: "Planning",    start: 0, len: 3,  color: "#34d399" },
  { label: "Design",      start: 2, len: 4,  color: "#60a5fa" },
  { label: "Development", start: 5, len: 7,  color: "#30B0B0" },
  { label: "QA Testing",  start: 11, len: 3, color: "#fb923c" },
  { label: "Launch",      start: 13, len: 2, color: "#a78bfa" },
];
const TOTAL_COLS = 15;

const STATUS_STYLE: Record<TaskStatus, { bg: string; color: string; label: string }> = {
  "done":        { bg: "rgba(52,211,153,0.12)",   color: "#34d399", label: "Done"        },
  "in-progress": { bg: "rgba(48,176,176,0.12)",   color: "#30B0B0", label: "In Progress" },
  "review":      { bg: "rgba(251,191,36,0.12)",   color: "#fbbf24", label: "Review"      },
  "todo":        { bg: "rgba(100,116,139,0.12)",  color: "#64748b", label: "To Do"       },
};

const PRIORITY_COLOR = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

type View = "sheet" | "gantt" | "board";

export default function ProjectTrackingSheetSim() {
  const [view, setView] = useState<View>("sheet");
  const [progressValues, setProgressValues] = useState<number[]>(TASKS.map(() => 0));
  const [ganttReady, setGanttReady] = useState(false);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const initialized = useRef(false);

  // Animate progress bars on sheet view
  useEffect(() => {
    if (view !== "sheet") return;
    startTransition(() => setProgressValues(TASKS.map(() => 0)));
    const t = setTimeout(() => {
      setProgressValues(TASKS.map((t) => t.progress));
    }, 150);
    return () => clearTimeout(t);
  }, [view]);

  // Animate Gantt bars
  useEffect(() => {
    if (view !== "gantt") { startTransition(() => setGanttReady(false)); return; }
    const t = setTimeout(() => setGanttReady(true), 200);
    return () => clearTimeout(t);
  }, [view]);

  // Animate board: cycle card drags
  useEffect(() => {
    if (view !== "board") { startTransition(() => setActiveDrag(null)); return; }
    if (initialized.current) return;
    initialized.current = true;
    let idx = 2; // highlight "Sprint Planning" first
    const cycle = () => {
      setActiveDrag(idx);
      idx = (idx + 1) % TASKS.length;
    };
    cycle();
    const t = setInterval(cycle, 1400);
    return () => clearInterval(t);
  }, [view]);

  useEffect(() => {
    if (view !== "board") initialized.current = false;
  }, [view]);

  const VIEWS: { id: View; label: string; icon: string }[] = [
    { id: "sheet", label: "Sheet", icon: "📋" },
    { id: "gantt", label: "Gantt", icon: "📊" },
    { id: "board", label: "Board", icon: "🗂️" },
  ];

  const doneCount = TASKS.filter((t) => t.status === "done").length;
  const overallPct = Math.round(TASKS.reduce((s, t) => s + t.progress, 0) / TASKS.length);

  return (
    <div
      className="rounded-2xl overflow-hidden select-none"
      style={{
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        fontSize: "11px",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        <span style={{ color: "#7d8590", fontSize: "11px", marginLeft: "8px" }}>
          Project Tracker — Website Redesign
        </span>
        <span style={{ marginLeft: "auto", color: "#30B0B0", fontSize: "10px" }}>
          Sprint 2 of 4
        </span>
      </div>

      {/* ── Stats row ── */}
      <div
        className="flex items-center gap-4 px-4 py-2"
        style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        {[
          { label: "Total Tasks", value: TASKS.length.toString(), color: "#d4d4d4" },
          { label: "Completed",   value: `${doneCount}`,  color: "#34d399" },
          { label: "In Progress", value: "2",  color: "#30B0B0" },
          { label: "Overall",     value: `${overallPct}%`, color: "#fbbf24" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ color: "#3d444d", fontSize: "8px" }}>{s.label}</div>
            <div style={{ color: s.color, fontWeight: 700, fontSize: "12px" }}>{s.value}</div>
          </div>
        ))}
        {/* Overall progress bar */}
        <div className="flex-1 ml-2">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ color: "#3d444d", fontSize: "8px" }}>Project Progress</span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "9999px" }}>
            <div
              style={{
                height: "100%",
                width: `${overallPct}%`,
                background: "linear-gradient(90deg, #30B0B0, #7ef5f5)",
                borderRadius: "9999px",
                boxShadow: "0 0 8px rgba(48,176,176,0.5)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── View tabs ── */}
      <div
        className="flex gap-0"
        style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: view === v.id ? "2px solid #30B0B0" : "2px solid transparent",
              color: view === v.id ? "#30B0B0" : "#7d8590",
              padding: "6px 14px",
              fontSize: "10px",
              fontWeight: view === v.id ? 600 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "color 0.2s",
            }}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div style={{ background: "#0a0f1a", minHeight: "18rem", maxHeight: "18rem", overflowY: "auto" }}>

        {/* SHEET VIEW */}
        {view === "sheet" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["ID", "Task", "Owner", "Status", "Priority", "Progress", "Due"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 8px",
                      textAlign: "left",
                      color: "#3d444d",
                      fontSize: "9px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      background: "#0d1117",
                      position: "sticky",
                      top: 0,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task, i) => {
                const ss = STATUS_STYLE[task.status];
                return (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "5px 8px", color: "#3d444d", whiteSpace: "nowrap" }}>{task.id}</td>
                    <td style={{ padding: "5px 8px", color: "#d4d4d4", maxWidth: "90px" }}>{task.title}</td>
                    <td style={{ padding: "5px 8px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "rgba(48,176,176,0.15)",
                          color: "#30B0B0",
                          fontSize: "8px",
                          fontWeight: 700,
                        }}
                      >
                        {task.assignee}
                      </span>
                    </td>
                    <td style={{ padding: "5px 8px" }}>
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "9999px",
                          background: ss.bg,
                          color: ss.color,
                          fontSize: "8px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ss.label}
                      </span>
                    </td>
                    <td style={{ padding: "5px 8px" }}>
                      <span style={{ color: PRIORITY_COLOR[task.priority], fontSize: "9px", fontWeight: 600 }}>
                        ● {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: "5px 8px", minWidth: "60px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "9999px" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${progressValues[i]}%`,
                              background: task.status === "done" ? "#34d399" : task.status === "review" ? "#fbbf24" : "#30B0B0",
                              borderRadius: "9999px",
                              transition: `width 0.8s ease ${i * 0.1}s`,
                            }}
                          />
                        </div>
                        <span style={{ color: "#7d8590", fontSize: "8px", minWidth: "22px" }}>{task.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "5px 8px", color: "#7d8590", whiteSpace: "nowrap" }}>{task.due}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* GANTT VIEW */}
        {view === "gantt" && (
          <div className="p-3">
            {/* Week headers */}
            <div className="flex mb-2 pl-20">
              {Array.from({ length: TOTAL_COLS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "#3d444d",
                    fontSize: "7px",
                    borderLeft: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Rows */}
            {GANTT_ROWS.map((row, i) => (
              <div key={row.label} className="flex items-center mb-2">
                <div style={{ width: "80px", color: "#7d8590", fontSize: "9px", flexShrink: 0 }}>{row.label}</div>
                <div className="flex flex-1 relative" style={{ height: "18px" }}>
                  {/* Grid lines */}
                  {Array.from({ length: TOTAL_COLS }).map((_, c) => (
                    <div
                      key={c}
                      style={{
                        flex: 1,
                        borderLeft: "1px solid rgba(255,255,255,0.04)",
                        height: "100%",
                      }}
                    />
                  ))}
                  {/* Bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      bottom: "2px",
                      left: `${(row.start / TOTAL_COLS) * 100}%`,
                      width: ganttReady ? `${(row.len / TOTAL_COLS) * 100}%` : "0%",
                      background: row.color,
                      borderRadius: "3px",
                      transition: `width 0.7s ease ${i * 0.12}s`,
                      opacity: 0.85,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "5px",
                      overflow: "hidden",
                      boxShadow: `0 0 10px ${row.color}66`,
                    }}
                  >
                    <span style={{ color: "#000", fontSize: "7px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {row.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOARD VIEW */}
        {view === "board" && (
          <div className="flex gap-2 p-3" style={{ overflowX: "auto" }}>
            {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((col) => {
              const colTasks = TASKS.filter((t) => t.status === col);
              const ss = STATUS_STYLE[col];
              return (
                <div
                  key={col}
                  style={{
                    minWidth: "110px",
                    flex: 1,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                >
                  {/* Column header */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: ss.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: ss.color, fontSize: "9px", fontWeight: 600 }}>{ss.label}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        background: ss.bg,
                        color: ss.color,
                        fontSize: "8px",
                        padding: "1px 5px",
                        borderRadius: "9999px",
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="flex flex-col gap-1.5">
                    {colTasks.map((task) => {
                      const taskIdx = TASKS.indexOf(task);
                      const isActive = activeDrag === taskIdx;
                      return (
                        <div
                          key={task.id}
                          style={{
                            background: isActive
                              ? `linear-gradient(135deg, rgba(48,176,176,0.12), rgba(48,176,176,0.04))`
                              : "rgba(255,255,255,0.03)",
                            border: isActive
                              ? "1px solid rgba(48,176,176,0.4)"
                              : "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "6px",
                            padding: "6px",
                            transform: isActive ? "scale(1.03)" : "scale(1)",
                            boxShadow: isActive ? "0 4px 16px rgba(48,176,176,0.2)" : "none",
                            transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
                          }}
                        >
                          <div style={{ color: "#3d444d", fontSize: "7px", marginBottom: "2px" }}>{task.id}</div>
                          <div style={{ color: "#d4d4d4", fontSize: "9px", lineHeight: "1.3" }}>{task.title}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              style={{
                                color: PRIORITY_COLOR[task.priority],
                                fontSize: "7px",
                              }}
                            >
                              ● {task.priority}
                            </span>
                            <span
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "rgba(48,176,176,0.15)",
                                color: "#30B0B0",
                                fontSize: "7px",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {task.assignee}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer bar ── */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{
          background: "#161422",
          borderTop: "1px solid rgba(48,176,176,0.1)",
          fontSize: "9px",
          color: "#3d444d",
        }}
      >
        <span style={{ color: "#30B0B0" }}>Swift Designz PM Suite</span>
        <span>{doneCount}/{TASKS.length} tasks complete</span>
        <span style={{ color: "#34d399" }}>On Track ✓</span>
      </div>
    </div>
  );
}
