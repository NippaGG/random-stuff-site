"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { clearLenisInstance, setLenisInstance } from "@/lib/lenis";

export default function PageClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Initialize service worker in production
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Detect mobile on mount for Lenis config (avoids SSR hydration mismatch for logic)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lenis smooth scrolling for tactile flow
  useEffect(() => {
    if (isMobile === null) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: isMobile ? 0.1 : 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      syncTouch: false,
    });
    setLenisInstance(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      clearLenisInstance(lenis);
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  return <>{children}</>;
}
