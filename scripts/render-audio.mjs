/**
 * render-audio.mjs — Swift Designz Immersive Post Audio Export
 * ──────────────────────────────────────────────────────────────
 * Synthesizes all SFX + ambient drone as PCM, writes a stereo
 * WAV, then converts to AAC-in-MP4 via ffmpeg.
 *
 * Output: public/images/instagram/swift-designz-sfx.mp4
 *
 * Requirements:
 *   - ffmpeg on PATH (already installed)
 *   - Node.js 18+  (no extra npm packages needed)
 *
 * Usage: node scripts/render-audio.mjs
 */

import path         from 'path';
import fs           from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'instagram');
const WAV_TMP = path.join(OUT_DIR, '_sfx-tmp.wav');
const MP3_OUT = path.join(OUT_DIR, 'swift-designz-sfx.mp3');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SR   = 44100;
const DUR  = 52;          // seconds
const N    = Math.ceil(SR * DUR);
const MAST = 0.72;

const buf = new Float32Array(N);   // mono mix, duplicated to stereo at write time

// ══════════════════════════════════════════════════════════════
//  DSP UTILITIES
// ══════════════════════════════════════════════════════════════

/** Piecewise linear/exponential envelope — t is seconds from note start */
function env(kf, t) {
  if (t <= kf[0].t) return kf[0].v;
  const last = kf[kf.length - 1];
  if (t >= last.t)  return last.v;
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (t >= a.t && t <= b.t) {
      const u = (b.t - a.t) < 1e-12 ? 1 : (t - a.t) / (b.t - a.t);
      if (b.exp && a.v > 1e-7 && b.v > 1e-7)
        return a.v * Math.pow(b.v / a.v, u);
      return a.v + (b.v - a.v) * u;
    }
  }
  return last.v;
}

/** Biquad filter coefficients */
function bqCoeffs(type, freq, q) {
  const w0    = 2 * Math.PI * Math.min(freq, SR * 0.499) / SR;
  const sinW  = Math.sin(w0), cosW = Math.cos(w0);
  const alpha = sinW / (2 * (q || 1));
  if (type === 'bandpass') {
    const a0 = 1 + alpha;
    return { b0: alpha/a0, b1: 0, b2: -alpha/a0,
             a1: -2*cosW/a0, a2: (1-alpha)/a0 };
  }
  // lowpass
  const a0 = 1 + alpha;
  const hc = (1 - cosW) / 2;
  return { b0: hc/a0, b1: (1-cosW)/a0, b2: hc/a0,
           a1: -2*cosW/a0, a2: (1-alpha)/a0 };
}

/** Run biquad in-place on Float32Array */
function bqFilter(sig, c) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < sig.length; i++) {
    const x = sig[i];
    const y = c.b0*x + c.b1*x1 + c.b2*x2 - c.a1*y1 - c.a2*y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    sig[i] = y;
  }
}

/** Mix signal into global buf at startSec */
function mix(startSec, sig, gain = 1) {
  const start = Math.floor(startSec * SR);
  for (let i = 0; i < sig.length; i++) {
    const idx = start + i;
    if (idx < N) buf[idx] += sig[i] * gain * MAST;
  }
}

// ══════════════════════════════════════════════════════════════
//  SFX PRIMITIVES
// ══════════════════════════════════════════════════════════════

/**
 * Oscillator with per-sample freq and gain automation.
 * freqKF / gainKF: [{t, v, exp?}] — t = seconds from note start.
 * Optional low/bandpass filter at a fixed or average centre freq.
 */
function addOsc(type, startSec, durSec, freqKF, gainKF,
                filterType = null, filterFreq = null, filterQ = 1) {
  const len = Math.min(Math.ceil(durSec * SR), N - Math.floor(startSec * SR));
  if (len <= 0) return;
  const sig = new Float32Array(len);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t    = i / SR;
    const freq = Math.max(1, env(freqKF, t));
    const g    = env(gainKF, t);
    phase += freq / SR;
    if (phase >= 1) phase -= Math.floor(phase);
    let s;
    switch (type) {
      case 'sine':   s = Math.sin(2 * Math.PI * phase); break;
      case 'saw':    s = 2 * phase - 1;                  break;
      case 'square': s = phase < 0.5 ? 1 : -1;           break;
      default:       s = 0;
    }
    sig[i] = s * g;
  }
  if (filterType && filterFreq) {
    bqFilter(sig, bqCoeffs(filterType, filterFreq, filterQ));
  }
  mix(startSec, sig);
}

/** Filtered noise burst */
function addNoise(startSec, dur, filterType, filterFreq, filterQ, gainKF) {
  const len = Math.min(Math.ceil(dur * SR), N - Math.floor(startSec * SR));
  if (len <= 0) return;
  const sig = new Float32Array(len);
  for (let i = 0; i < len; i++) sig[i] = Math.random() * 2 - 1;
  bqFilter(sig, bqCoeffs(filterType, filterFreq, filterQ));
  for (let i = 0; i < len; i++) sig[i] *= env(gainKF, i / SR);
  mix(startSec, sig);
}

// ══════════════════════════════════════════════════════════════
//  SOUND EVENTS  (mirror of immersive-tunnel-post.html SFX)
// ══════════════════════════════════════════════════════════════

function schedAmbient() {
  // Dual-oscillator 58 / 62.4 Hz drone, fades in over 2.5s
  for (const f of [58, 62.4]) {
    addOsc('sine', 0, DUR,
      [{ t: 0, v: f }],
      [{ t: 0, v: 0.001 }, { t: 2.5, v: 0.14 }],
      'lowpass', 180, 1.5
    );
  }
}

function schedClick(ms) {
  const t    = ms / 1000;
  const freq = 1100 + Math.random() * 500;
  addOsc('square', t, 0.03,
    [{ t: 0, v: freq }],
    [{ t: 0, v: 0.028 }, { t: 0.028, v: 0.001, exp: true }]
  );
}

function schedWhoosh(ms) {
  const t = ms / 1000, dur = 0.48;
  addOsc('saw', t, dur,
    [{ t: 0, v: 220 }, { t: dur, v: 1600 }],
    [{ t: 0, v: 0.001 }, { t: dur * 0.3, v: 0.18 }, { t: dur, v: 0.001, exp: true }],
    'bandpass', 1200, 2.5
  );
}

function schedExplosion(ms) {
  const t = ms / 1000;
  addOsc('sine', t, 0.45,
    [{ t: 0, v: 180 }, { t: 0.42, v: 28, exp: true }],
    [{ t: 0, v: 0.55 }, { t: 0.42, v: 0.001, exp: true }]
  );
  addNoise(t, 0.22, 'bandpass', 380, 1.2,
    [{ t: 0, v: 0.28 }, { t: 0.22, v: 0.001, exp: true }]
  );
}

function schedPill(ms, i) {
  const t    = ms / 1000;
  const freq = 480 + i * 95;
  addOsc('sine', t, 0.18,
    [{ t: 0, v: freq * 1.6 }, { t: 0.07, v: freq, exp: true }],
    [{ t: 0, v: 0.1 }, { t: 0.16, v: 0.001, exp: true }]
  );
}

function schedRocket(ms) {
  const t = ms / 1000, dur = 1.4;
  addOsc('saw', t, dur + 0.05,
    [{ t: 0, v: 90 }, { t: dur * 0.65, v: 240 }, { t: dur, v: 160 }],
    [{ t: 0, v: 0.001 }, { t: dur * 0.18, v: 0.28 }, { t: dur, v: 0.18 }],
    'lowpass', 1000, 1
  );
  // Hard landing thud
  const lt = t + dur - 0.08;
  addOsc('sine', lt, 0.5,
    [{ t: 0, v: 210 }, { t: 0.48, v: 38, exp: true }],
    [{ t: 0, v: 0.62 }, { t: 0.48, v: 0.001, exp: true }]
  );
  addNoise(lt, 0.2, 'bandpass', 450, 1.5,
    [{ t: 0, v: 0.35 }, { t: 0.2, v: 0.001, exp: true }]
  );
}

function schedPulse(ms) {
  const t = ms / 1000;
  addOsc('sine', t, 1.05,
    [{ t: 0, v: 200 }, { t: 0.5, v: 420 }, { t: 1.0, v: 200 }],
    [{ t: 0, v: 0.001 }, { t: 0.25, v: 0.18 }, { t: 1.0, v: 0.001, exp: true }]
  );
}

function schedWarp(ms) {
  const t = ms / 1000, dur = 0.9;
  addOsc('saw', t, dur + 0.05,
    [{ t: 0, v: 280 }, { t: dur * 0.55, v: 3800, exp: true }, { t: dur, v: 80, exp: true }],
    [{ t: 0, v: 0.22 }, { t: dur * 0.4, v: 0.38 }, { t: dur, v: 0.001, exp: true }],
    'bandpass', 3000, 4
  );
}

// ══════════════════════════════════════════════════════════════
//  SCHEDULE ALL EVENTS
//  (timestamps match render-audio.html and the live SFX engine)
// ══════════════════════════════════════════════════════════════

console.log('\n  Swift Designz — Audio Renderer');
console.log('  ─────────────────────────────────\n');
console.log('  Synthesizing 52s of SFX…');

schedAmbient();

// Card whooshes
[1400, 12370, 23508, 35186].forEach(schedWhoosh);

// Transition explosions
[11830, 12070, 22968, 23208, 34646, 34886, 45158, 45398].forEach(schedExplosion);

// ── Card 0 typewriter clicks ──
for (let i = 0; i < 11; i++) schedClick(2200 + i * 82);
for (let i = 0; i < 11; i++) schedClick(3400 + i * 82);
for (let i = 0; i < 35; i++) schedClick(4600 + i * 95);
for (let i = 0;  i < 5; i++) schedPill(7890 + i * 180, i);

// ── Card 1 ──
for (let i = 0; i < 11; i++) schedClick(12850 + i * 82);
for (let i = 0; i < 10; i++) schedClick(14050 + i * 82);
for (let i = 0; i < 41; i++) schedClick(15168 + i * 95);
for (let i = 0;  i < 5; i++) schedPill(19028 + i * 180, i);

// ── Card 2 ──
for (let i = 0; i <  9; i++) schedClick(23988 + i * 82);
for (let i = 0; i <  7; i++) schedClick(25024 + i * 82);
for (let i = 0; i < 51; i++) schedClick(25896 + i * 95);
for (let i = 0;  i < 5; i++) schedPill(30706 + i * 180, i);

// ── Card 3 ──
for (let i = 0; i < 10; i++) schedClick(35666 + i * 82);
for (let i = 0; i <  8; i++) schedClick(36784 + i * 82);
for (let i = 0; i < 37; i++) schedClick(37738 + i * 95);

// ── Logo outro ──
schedRocket(45698);
schedPulse(47148);
schedPulse(48198);
schedWarp(49248);

// ══════════════════════════════════════════════════════════════
//  NORMALISE + WRITE WAV
// ══════════════════════════════════════════════════════════════

console.log('  Normalising and encoding WAV…');

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(buf[i]));
const norm = peak > 0.001 ? (0.92 / peak) : 1;

const CHANNELS       = 2;
const BITS           = 16;
const BYTES_SAMPLE   = BITS / 8;
const BLOCK_ALIGN    = CHANNELS * BYTES_SAMPLE;
const dataBytes      = N * BLOCK_ALIGN;
const wavBuf         = Buffer.alloc(44 + dataBytes);

const ws = (off, s) => { for (let i = 0; i < s.length; i++) wavBuf[off + i] = s.charCodeAt(i); };

ws(0,  'RIFF');  wavBuf.writeUInt32LE(36 + dataBytes, 4);
ws(8,  'WAVE');
ws(12, 'fmt ');  wavBuf.writeUInt32LE(16, 16);
wavBuf.writeUInt16LE(1,                     20);  // PCM
wavBuf.writeUInt16LE(CHANNELS,              22);
wavBuf.writeUInt32LE(SR,                    24);
wavBuf.writeUInt32LE(SR * BLOCK_ALIGN,      28);  // byteRate
wavBuf.writeUInt16LE(BLOCK_ALIGN,           32);
wavBuf.writeUInt16LE(BITS,                  34);
ws(36, 'data');  wavBuf.writeUInt32LE(dataBytes, 40);

let off = 44;
for (let i = 0; i < N; i++) {
  const v  = Math.max(-1, Math.min(1, buf[i] * norm));
  const s  = Math.round(v < 0 ? v * 0x8000 : v * 0x7FFF);
  wavBuf.writeInt16LE(s, off);      // L
  wavBuf.writeInt16LE(s, off + 2);  // R  (mono → stereo)
  off += 4;
}

fs.writeFileSync(WAV_TMP, wavBuf);

// ══════════════════════════════════════════════════════════════
//  CONVERT WAV → AAC MP4
// ══════════════════════════════════════════════════════════════

console.log('  Converting WAV → MP3 via ffmpeg…\n');
execSync(
  `ffmpeg -y -i "${WAV_TMP}" -c:a libmp3lame -b:a 192k "${MP3_OUT}"`,
  { stdio: 'inherit' }
);

fs.unlinkSync(WAV_TMP);

const mb = (fs.statSync(MP3_OUT).size / (1024 * 1024)).toFixed(2);
console.log(`\n  Done!`);
console.log(`  Output: ${MP3_OUT}`);
console.log(`  Size:   ${mb} MB\n`);
