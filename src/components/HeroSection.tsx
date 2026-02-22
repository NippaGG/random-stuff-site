"use client";

import React, { useRef, useState, useEffect } from "react";
// 1. Import useMotionValueEvent
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import TextPressure from "./TextPressure";
import FloatingIcons from "./FloatingIcons";
import Image from "next/image";
import { Github, ArrowDown } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isSiteLocked, setIsSiteLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false)
  );

  // 2. New State: Should we freeze the animations?
  const [freezeAnimations, setFreezeAnimations] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const setInitial = () => {
      setIsSiteLocked(document.documentElement.dataset.siteLocked === "true");
    };
    setInitial();
    const onLockChange = (event: Event) => {
      const detail = (event as CustomEvent<{ locked: boolean }>).detail;
      if (detail && typeof detail.locked === "boolean") {
        setIsSiteLocked(detail.locked);
      } else {
        setInitial();
      }
    };
    window.addEventListener("site-lock-change", onLockChange);
    return () => window.removeEventListener("site-lock-change", onLockChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 3. THE TRIGGER
  // When scroll > 0.65 (The exact point the Nav straightens), 
  // we set freezeAnimations to true.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.65 && !freezeAnimations) {
      setFreezeAnimations(true);
    } else if (latest <= 0.65 && freezeAnimations) {
      setFreezeAnimations(false);
    }
  });

  // --- ANIMATIONS ---
  const scrollTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const sideOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const iconsOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const sideBlur = useTransform(scrollYProgress, [0, 0.15], ["0px", "20px"]);
  const yPos = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.6],
    isMobile
      ? ["0vh", "-24vh", "-24vh", "-42vh"]
      : ["0vh", "-35vh", "-35vh", "-60vh"]
  );

  // NEW: "STUFF" Center Column Fade for Mobile
  // Fade out opacity completely between 0.15 and 0.3 only on mobile
  const centerOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.3],
    isMobile ? [1, 0] : [1, 1]
  );

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.45], ["0%", "100%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.2], [0, 1]);

  return (
    <>
      <div
        ref={containerRef}
        className="h-[320vh] md:h-[400vh] relative z-[100] pointer-events-none transform-gpu"
        style={{
          opacity: isSiteLocked ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden w-full px-4 md:px-5">

          {/* GITHUB BUTTON - Top Left (Desktop) / Top Center (Mobile) */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-[150] pointer-events-auto">
            <motion.a
              href="https://github.com/NippaGG/random-stuff-site"
              target="_blank"
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-none bg-[#a3e635]/10 border border-[#a3e635]/20 backdrop-blur-md text-[#a3e635] hover:bg-[#a3e635]/20 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all"
            >
              <Github size={24} />
            </motion.a>
          </div>

          {/* PORTFOLIO TRIGGER - Top Right (Desktop Only) */}
          <div className="hidden md:block absolute top-8 right-8 z-[150] pointer-events-auto">
            <motion.a
              href="https://shockagg.vercel.app/"
              whileTap={{ scale: 0.95 }}
              className="block relative w-10 h-10 md:w-12 md:h-12 rounded-none overflow-hidden bg-[#a3e635]/10 border border-[#a3e635]/20 backdrop-blur-md hover:bg-[#a3e635]/20 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all"
            >
              <Image
                src="/icon.png"
                alt="Portfolio"
                fill
                className="object-cover"
              />
            </motion.a>
          </div>

          {/* SCROLL DOWN BUTTON - Bottom Right */}
          <div className="absolute bottom-8 right-8 z-[150] pointer-events-auto">
            <motion.button
              onClick={() => {
                const viewportHeight = window.innerHeight;
                // Match the threshold from ContentSection.tsx
                const targetScroll = viewportHeight * (isMobile ? 1.75 : 2.2);
                window.scrollTo({
                  top: targetScroll + 10, // Small buffer to ensure lock triggers
                  behavior: "smooth"
                });
              }}
              whileTap={{ scale: 0.95 }}
              // INCREASED TOUCH TARGET PADDING
              className="flex items-center justify-center p-3 w-12 h-12 md:w-12 md:h-12 rounded-none bg-[#a3e635]/10 border border-[#a3e635]/20 backdrop-blur-md text-[#a3e635] hover:bg-[#a3e635]/20 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all"
            >
              <ArrowDown size={24} />
            </motion.button>
          </div>

          {/* FLOATING ICONS */}
          <FloatingIcons opacity={iconsOpacity} compact={isMobile} />

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center w-full max-w-screen-xl mx-auto gap-2 md:gap-[2vw]">

            {/* LEFT COLUMN */}
            <motion.div
              style={{ opacity: sideOpacity, filter: `blur(${sideBlur})` }}
              className="hidden md:block w-full h-[100px] relative"
            >
              <div className="absolute right-0 top-0 w-full h-full flex justify-end items-center translate-y-0">
                <div className="w-full h-full">
                  <TextPressure
                    text="Random (useful)"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#FFFFFF"
                    minFontSize={24}
                    // 4. Pass the Freeze Prop
                    stopAnimation={freezeAnimations}
                  />
                </div>
              </div>
            </motion.div>

            {/* CENTER COLUMN */}
            <motion.div
              style={{ y: yPos, opacity: centerOpacity }}
              className="flex flex-col items-center justify-center z-[101] relative pointer-events-auto w-full md:w-[300px] h-[90px] md:h-[100px]"
            >
              <div className="relative w-full h-full flex items-center justify-center -translate-y-10 md:-translate-y-12">
                {!isMobile ? (
                  <TextPressure
                    text="STUFF"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#a3e635"
                    minFontSize={36}
                    stopAnimation={freezeAnimations}
                  />
                ) : (
                  // NEW MOBILE HERO EFFECT: Breathing Neon Text (No Mouse Required)
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0px 0px 20px rgba(163,230,53,0.3)",
                        "0px 0px 40px rgba(163,230,53,0.8)",
                        "0px 0px 20px rgba(163,230,53,0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="font-black italic tracking-tighter text-[#a3e635] text-[15vw] leading-none"
                  >
                    STUFF
                  </motion.div>
                )}
              </div>

              {/* THE GROWING LINE - HIDE ON MOBILE */}
              <motion.div
                style={{
                  opacity: lineOpacity,
                  width: lineWidth
                }}
                className="hidden md:block absolute bottom-1 md:bottom-3 left-1/2 -translate-x-1/2 h-[4px] max-w-[90vw] overflow-hidden"
              >
                <motion.div
                  className="w-full h-full bg-[#a3e635] shadow-[0_0_15px_#a3e635,0_0_5px_#a3e635] rounded-full"
                />
              </motion.div>

            </motion.div>

            {/* RIGHT COLUMN */}
            <motion.div
              style={{ opacity: sideOpacity, filter: `blur(${sideBlur})` }}
              className="hidden md:block w-full h-[100px] relative"
            >
              <div className="absolute left-0 top-0 w-full h-full flex justify-start items-center translate-y-2">
                <div className="w-full h-full">
                  <TextPressure
                    text="from the internet"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#FFFFFF"
                    minFontSize={24}
                    // 4. Pass the Freeze Prop
                    stopAnimation={freezeAnimations}
                  />
                </div>
              </div>
            </motion.div>

            {/* MOBILE FALLBACK - HIDDEN */}
            <div className="hidden flex-col items-center gap-1.5">
              <motion.span style={{ opacity: sideOpacity }} className="font-mono text-white/90 font-semibold drop-shadow-md text-lg">Random (useful)</motion.span>
              <motion.span style={{ opacity: sideOpacity }} className="font-mono text-white/90 font-semibold drop-shadow-md text-lg">from the internet</motion.span>
            </div>

          </div>

          {/* WRAPPER FOR TIME-BASED FADE */}
          <motion.div
            animate={{ opacity: showScrollHint ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-8 md:bottom-10"
          >
            {/* INNER DIV FOR SCROLL-BASED FADE */}
            <motion.div
              style={{ opacity: scrollTextOpacity }}
              className="text-gray-500 text-xs animate-pulse tracking-widest uppercase"
            >
              Scroll to Initialize
            </motion.div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
