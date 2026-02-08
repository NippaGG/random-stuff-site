"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import GridBackground from "@/components/GridBackground";
import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis();

    // 2. Create the loop function
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    // 3. Start the loop
    rafId = requestAnimationFrame(raf);

    // FIX: CLEANUP FUNCTION
    // This runs when the component unmounts. It kills the old loop and listener.
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

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

      <div className="relative -mt-[300vh] z-20 flex-grow">
        <ContentSection />
      </div>

      <div className="relative z-30">
        <Footer />
      </div>

    </main>
  );
}