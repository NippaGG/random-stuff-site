"use client";

import React, { useRef, useState, useEffect } from "react";
// 1. Import useMotionValueEvent
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import TextPressure from "./TextPressure";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isSiteLocked, setIsSiteLocked] = useState(false);

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
  const sideBlur = useTransform(scrollYProgress, [0, 0.15], ["0px", "20px"]);
  const yPos = useTransform(scrollYProgress,
    [0, 0.2, 0.45, 0.6],
    ["0vh", "-35vh", "-35vh", "-60vh"]
  );
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.45], ["0%", "100%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.2], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="h-[400vh] relative z-[100] pointer-events-none transform-gpu"
      style={{
        opacity: isSiteLocked ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden w-full px-5">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center w-full max-w-screen-xl mx-auto gap-3 md:gap-[2vw]">

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
            style={{ y: yPos }}
            className="flex flex-col items-center justify-center z-[101] relative pointer-events-auto w-full md:w-[300px] h-[100px]"
          >
            <div className="relative w-full h-full flex items-center justify-center -translate-y-12">
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
                // 4. Pass the Freeze Prop
                stopAnimation={freezeAnimations}
              />
            </div>

            {/* THE GROWING LINE */}
            <motion.div
              style={{
                opacity: lineOpacity,
                width: lineWidth
              }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 h-[4px] max-w-[90vw] overflow-hidden"
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

          {/* MOBILE FALLBACK */}
          <div className="md:hidden flex flex-col items-center gap-2">
            <motion.span style={{ opacity: sideOpacity }} className="font-mono text-white/70 text-xl">Random (useful)</motion.span>
            <motion.span style={{ opacity: sideOpacity }} className="font-mono text-white/70 text-xl">from the internet</motion.span>
          </div>

        </div>

        {/* WRAPPER FOR TIME-BASED FADE */}
        <motion.div
          animate={{ opacity: showScrollHint ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-10"
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
  );
}
