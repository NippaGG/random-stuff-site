"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { clearLenisInstance, setLenisInstance } from "@/lib/lenis";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";

export default function PageClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Detect mobile on mount for Lenis config (avoids SSR hydration mismatch for logic)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lenis smooth scrolling
  useEffect(() => {
    if (isMobile === null) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion) {
      return;
    }

    if (!isMobile && !isFinePointer) {
      return;
    }

    const lenis = new Lenis({
      lerp: isMobile ? 0.08 : 0.08,
      smoothWheel: !isMobile,
      wheelMultiplier: isMobile ? 1 : 0.9,
      touchMultiplier: 1,
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

  return (
    <>
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
