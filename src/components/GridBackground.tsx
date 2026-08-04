"use client";

import React, { useEffect, useRef } from "react";

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // We use refs for mouse positions to avoid React re-renders loops
  const mouseRef = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Grid config
    const size = 50; 
    const gap = 1;   

    const drawGrid = (withGlow: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.floor(canvas.width / size);
      const rows = Math.floor(canvas.height / size);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * size;
          const y = j * size;

          // Base grid
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"; 
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, size - gap, size - gap);

          if (!withGlow) continue;

          // Glow logic
          const dx = mouseRef.current.x - (x + size / 2);
          const dy = mouseRef.current.y - (y + size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const intensity = 1 - distance / 150;
            ctx.fillStyle = `rgba(0, 255, 100, ${intensity * 0.2})`;
            ctx.fillRect(x, y, size - gap, size - gap);
          }
        }
      }
    };

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid(false);
    };
    window.addEventListener("resize", resize);
    resize();

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let rafId: number | null = null;
    let isPaused = document.documentElement.dataset.siteLocked === "true";

    const scheduleDraw = () => {
      if (isPaused || document.hidden || rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        drawGrid(true);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      scheduleDraw();
    };

    const handleLockChange = (event: Event) => {
      isPaused = Boolean((event as CustomEvent<{ locked?: boolean }>).detail?.locked);
      if (isPaused) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        drawGrid(false);
      } else {
        scheduleDraw();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) scheduleDraw();
    };

    if (!isCoarsePointer) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    window.addEventListener("site-lock-change", handleLockChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("site-lock-change", handleLockChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []); // No dependencies needed

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
    />
  );
}
