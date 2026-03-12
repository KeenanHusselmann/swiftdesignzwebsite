"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

export default function StarfieldCanvas({ count = 220 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const CX = () => W / 2;
    const CY = () => H / 2;
    const SPEED = 6;
    const MAX_Z = 800;

    const stars: Star[] = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * MAX_Z,
      px: 0,
      py: 0,
    }));

    function resetStar(s: Star) {
      s.x = (Math.random() - 0.5) * W * 2;
      s.y = (Math.random() - 0.5) * H * 2;
      s.z = MAX_Z;
      s.px = 0;
      s.py = 0;
    }

    function draw() {
      ctx!.fillStyle = "rgba(6, 10, 18, 0.35)";
      ctx!.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.z -= SPEED;
        if (s.z <= 0) { resetStar(s); continue; }

        const sx = (s.x / s.z) * W + CX();
        const sy = (s.y / s.z) * H + CY();

        if (sx < 0 || sx > W || sy < 0 || sy > H) { resetStar(s); continue; }

        const size = Math.max(0.2, (1 - s.z / MAX_Z) * 3.5);
        const bright = Math.floor((1 - s.z / MAX_Z) * 255);
        const alpha = (1 - s.z / MAX_Z) * 0.95 + 0.05;

        // Tail — from previous projected position
        if (s.px !== 0 && s.py !== 0) {
          ctx!.beginPath();
          ctx!.moveTo(s.px, s.py);
          ctx!.lineTo(sx, sy);
          ctx!.strokeStyle = `rgba(${bright}, ${Math.floor(bright * 0.92)}, 255, ${alpha * 0.45})`;
          ctx!.lineWidth = size * 0.6;
          ctx!.stroke();
        }

        s.px = sx;
        s.py = sy;

        // Star dot
        ctx!.beginPath();
        ctx!.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${bright}, ${Math.floor(bright * 0.92)}, 255, ${alpha})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-3xl"
      style={{ display: "block" }}
    />
  );
}
