"use client";

import { useEffect, useRef } from "react";

const CELL      = 20;
const SIDE_FRAC = 0.28;
const DROP_MS   = 520;   // ms per gravity tick
const MOVE_MS   = 110;   // ms per AI horizontal step

const BASE_PIECES: [number, number][][] = [
  [[0,0],[1,0],[2,0],[3,0]],  // I
  [[0,0],[1,0],[0,1],[1,1]],  // O
  [[1,0],[0,1],[1,1],[2,1]],  // T
  [[1,0],[2,0],[0,1],[1,1]],  // S
  [[0,0],[1,0],[1,1],[2,1]],  // Z
  [[2,0],[0,1],[1,1],[2,1]],  // L
  [[0,0],[0,1],[1,1],[2,1]],  // J
];

const PIECE_RGB = [
  [217,119,6],[245,158,11],[180,83,9],
  [252,176,64],[146,64,14],[234,145,30],[253,211,77],
];

const FILL_ALPHA   = 0.22;
const STROKE_ALPHA = 0.50;

type Grid  = (number | null)[][];
type Cells = [number, number][];

interface Piece {
  cells: Cells;
  colorIdx: number;
  ox: number;
  oy: number;
}

// ── grid helpers ──────────────────────────────────────────────────────────────

function makeGrid(rows: number, w: number): Grid {
  return Array.from({ length: rows }, () => Array<number | null>(w).fill(null));
}

function rotateCW(cells: Cells): Cells {
  const maxR = Math.max(...cells.map(([, r]) => r));
  const rot  = cells.map(([c, r]): [number, number] => [maxR - r, c]);
  const minC = Math.min(...rot.map(([c]) => c));
  const minR = Math.min(...rot.map(([, r]) => r));
  return rot.map(([c, r]): [number, number] => [c - minC, r - minR]);
}

function getAllRotations(cells: Cells): Cells[] {
  const out: Cells[] = [];
  const seen = new Set<string>();
  let cur = cells;
  for (let i = 0; i < 4; i++) {
    const key = JSON.stringify([...cur].sort());
    if (!seen.has(key)) { seen.add(key); out.push(cur); }
    cur = rotateCW(cur);
  }
  return out;
}

function isValid(p: Piece, grid: Grid, rows: number, lL: number, lR: number): boolean {
  for (const [dc, dr] of p.cells) {
    const c = p.ox + dc, r = p.oy + dr;
    if (c < lL || c >= lR || r >= rows) return false;
    if (r >= 0 && grid[r][c - lL] !== null) return false;
  }
  return true;
}

function hardDrop(p: Piece, grid: Grid, rows: number, lL: number, lR: number): Piece {
  let cur = p;
  for (;;) {
    const next = { ...cur, oy: cur.oy + 1 };
    if (!isValid(next, grid, rows, lL, lR)) break;
    cur = next;
  }
  return cur;
}

function merge(p: Piece, grid: Grid, lL: number): void {
  for (const [dc, dr] of p.cells) {
    const c = p.ox + dc, r = p.oy + dr;
    if (r >= 0) grid[r][c - lL] = p.colorIdx;
  }
}

function clearLines(grid: Grid, w: number): void {
  for (let r = grid.length - 1; r >= 0; r--) {
    if (grid[r].every(v => v !== null)) {
      grid.splice(r, 1);
      grid.unshift(Array<number | null>(w).fill(null));
      r++;
    }
  }
}

// ── AI (El-Tetris heuristic) ──────────────────────────────────────────────────

function evalBoard(grid: Grid, w: number): number {
  const rows = grid.length;
  const h = Array(w).fill(0);
  for (let c = 0; c < w; c++)
    for (let r = 0; r < rows; r++)
      if (grid[r][c] !== null) { h[c] = rows - r; break; }

  const aggH = h.reduce((a: number, b: number) => a + b, 0);
  let lines = 0;
  for (let r = 0; r < rows; r++) if (grid[r].every(v => v !== null)) lines++;
  let holes = 0;
  for (let c = 0; c < w; c++) {
    let found = false;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] !== null) found = true;
      else if (found) holes++;
    }
  }
  let bump = 0;
  for (let c = 0; c < w - 1; c++) bump += Math.abs(h[c] - h[c + 1]);
  return -0.510066 * aggH + 0.760666 * lines - 0.35663 * holes - 0.184483 * bump;
}

function findBestMove(
  piece: Piece, grid: Grid,
  rows: number, lL: number, lR: number, lW: number,
): { cells: Cells; ox: number } | null {
  let best = -Infinity;
  let move: { cells: Cells; ox: number } | null = null;
  for (const cells of getAllRotations(piece.cells)) {
    const maxDc = Math.max(...cells.map(([dc]) => dc));
    for (let ox = lL; ox + maxDc < lR; ox++) {
      const test: Piece = { ...piece, cells, ox, oy: 0 };
      if (!isValid(test, grid, rows, lL, lR)) continue;
      const landed = hardDrop(test, grid, rows, lL, lR);
      const tg = grid.map(row => [...row]);
      merge(landed, tg, lL);
      clearLines(tg, lW);
      const score = evalBoard(tg, lW);
      if (score > best) { best = score; move = { cells, ox }; }
    }
  }
  return move;
}

// ── rendering ─────────────────────────────────────────────────────────────────

function drawCell(
  ctx: CanvasRenderingContext2D,
  col: number, row: number, colorIdx: number, extra = 0,
) {
  const [r, g, b] = PIECE_RGB[colorIdx];
  const x = col * CELL + 1, y = row * CELL + 1, w = CELL - 2;
  ctx.fillStyle = `rgba(${r},${g},${b},${FILL_ALPHA + extra})`;
  ctx.fillRect(x, y, w, w);
  const grad = ctx.createLinearGradient(x, y, x + w, y + w);
  grad.addColorStop(0, `rgba(${Math.min(r+40,255)},${Math.min(g+40,255)},${Math.min(b+40,255)},0.18)`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, w);
  ctx.strokeStyle = `rgba(${r},${g},${b},${STROKE_ALPHA})`;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, w - 1);
}

// ── lane ─────────────────────────────────────────────────────────────────────

interface Lane {
  grid:     Grid;
  active:   Piece | null;
  targetOx: number;
  lastDrop: number;
  lastMove: number;
  done:     boolean;
  lL: number; lR: number; lW: number; rows: number;
}

function spawnNext(lane: Lane): Piece | null {
  const idx  = Math.floor(Math.random() * BASE_PIECES.length);
  const base: Piece = { cells: BASE_PIECES[idx], colorIdx: idx, ox: lane.lL, oy: -2 };
  const best = findBestMove(base, lane.grid, lane.rows, lane.lL, lane.lR, lane.lW);
  if (!best) return null;

  // Spawn at lane center with the target rotation already applied
  const maxDc   = Math.max(...best.cells.map(([dc]) => dc));
  const spawnOx = Math.max(lane.lL, Math.min(lane.lR - maxDc - 1,
    lane.lL + Math.floor((lane.lW - maxDc - 1) / 2)));
  const piece: Piece = { cells: best.cells, colorIdx: idx, ox: spawnOx, oy: -2 };
  if (!isValid(piece, lane.grid, lane.rows, lane.lL, lane.lR)) return null;

  lane.targetOx = best.ox;
  return piece;
}

function tickLane(lane: Lane, now: number): void {
  if (lane.done || !lane.active) return;

  // AI horizontal slide
  if (now - lane.lastMove >= MOVE_MS) {
    lane.lastMove = now;
    const p = lane.active;
    if (p.ox !== lane.targetOx) {
      const dir  = lane.targetOx > p.ox ? 1 : -1;
      const next = { ...p, ox: p.ox + dir };
      if (isValid(next, lane.grid, lane.rows, lane.lL, lane.lR)) {
        lane.active = next;
        return; // skip gravity this tick so movement feels smooth
      }
      lane.targetOx = p.ox; // blocked — accept current column
    }
  }

  // Gravity
  if (now - lane.lastDrop >= DROP_MS) {
    lane.lastDrop = now;
    const p      = lane.active;
    const fallen = { ...p, oy: p.oy + 1 };
    if (isValid(fallen, lane.grid, lane.rows, lane.lL, lane.lR)) {
      lane.active = fallen;
    } else {
      merge(p, lane.grid, lane.lL);
      clearLines(lane.grid, lane.lW);
      const next = spawnNext(lane);
      if (!next) { lane.done = true; lane.active = null; }
      else { lane.active = next; lane.lastDrop = now; lane.lastMove = now; }
    }
  }
}

// ── component ─────────────────────────────────────────────────────────────────

export default function FallingBlocksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const lanes: Lane[] = [];

    const initLanes = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const totalCols = Math.max(2, Math.floor(canvas.width  / CELL));
      const rows      = Math.max(1, Math.floor(canvas.height / CELL));
      const lW        = Math.max(2, Math.floor(totalCols * SIDE_FRAC));
      const now       = performance.now();

      const makeLane = (lL: number): Lane => {
        const lane: Lane = {
          grid: makeGrid(rows, lW), active: null, targetOx: lL,
          lastDrop: now, lastMove: now, done: false,
          lL, lR: lL + lW, lW, rows,
        };
        lane.active = spawnNext(lane);
        if (!lane.active) lane.done = true;
        return lane;
      };

      lanes.length = 0;
      lanes.push(makeLane(0));               // left
      lanes.push(makeLane(totalCols - lW));  // right
    };

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      for (const lane of lanes) tickLane(lane, now);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const lane of lanes) {
        for (let r = 0; r < lane.rows; r++)
          for (let c = 0; c < lane.lW; c++) {
            const v = lane.grid[r]?.[c];
            if (v !== null && v !== undefined) drawCell(ctx, lane.lL + c, r, v);
          }
        if (lane.active)
          for (const [dc, dr] of lane.active.cells) {
            const col = lane.active.ox + dc, row = lane.active.oy + dr;
            if (row >= 0) drawCell(ctx, col, row, lane.active.colorIdx, 0.08);
          }
      }
    };

    initLanes();
    window.addEventListener("resize", initLanes);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", initLanes);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
  );
}

