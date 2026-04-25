"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import GridBackground from "@/components/GridBackground";
import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import MobileHeroSection from "@/components/MobileHeroSection";
import MobileContentSection from "@/components/MobileContentSection";
import PixelBlast from "@/components/PixelBlast";
import { AnimatePresence } from "framer-motion";
import { clearLenisInstance, setLenisInstance } from "@/lib/lenis";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Detect mobile on mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lenis smooth scrolling — desktop and mobile
  useEffect(() => {
    if (isMobile === null) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion) {
      return;
    }

    // Keep desktop guard for non-fine pointers.
    if (!isMobile && !isFinePointer) {
      return;
    }

    const lenis = new Lenis({
      lerp: isMobile ? 0.08 : 0.08,
      smoothWheel: !isMobile,
      wheelMultiplier: isMobile ? 1 : 0.9,
      touchMultiplier: 1,
      // Keep touch scrolling native on mobile; Lenis still handles programmatic scrolls.
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

  if (isMobile === null) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
        <div className="fixed inset-0 z-[-1]">
          <GridBackground />
        </div>
        <LoadingScreen onComplete={() => setIsLoading(false)} />
        <div className="sr-only">
          <h1>Random Stuff</h1>
          <p>A curated collection of websites, tools, and scripts.</p>
        </div>
      </main>
    );
  }

  // ─── MOBILE ─────────────────────────────────────────
  if (isMobile) {
    return (
      <main className="relative min-h-screen text-white flex flex-col bg-[#0a0a0a] overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <PixelBlast
            className="absolute inset-0"
            variant="circle"
            pixelSize={8}
            color="#9ccf2f"
            patternScale={1.8}
            patternDensity={3.1}
            pixelSizeJitter={0.25}
            enableRipples
            rippleSpeed={0.42}
            rippleThickness={0.14}
            rippleIntensityScale={2}
            liquid={false}
            liquidStrength={0.1}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.7}
            edgeFade={0.02}
            transparent
          />
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <MobileHeroSection />
          <MobileContentSection />
        </div>
      </main>
    );
  }

  // ─── DESKTOP (unchanged) ───────────────────────────
  return (
    <main className="relative min-h-screen text-white flex flex-col">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-[-1]">
        <GridBackground />
      </div>

      <HeroSection />

      <div className="relative -mt-[250vh] md:-mt-[300vh] z-20 flex-grow">
        <ContentSection />
      </div>

      <div className="relative z-30">
        <Footer />
      </div>

    </main>
  );
}
