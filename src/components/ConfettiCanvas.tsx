import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  burstKey: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vy: number;
  vx: number;
}

const COLORS = ['#4F46E5', '#059669', '#D97706', '#DB2777', '#0284C7'];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ burstKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (burstKey === 0) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: Particle[] = Array.from({ length: 72 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 110,
      r: 5 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      vy: 3.2 + Math.random() * 4.5,
      vx: -2.2 + Math.random() * 4.4,
    }));

    let frame = 0;
    let rafId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame += 1;
      if (frame < 95) {
        rafId = window.requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafId = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
