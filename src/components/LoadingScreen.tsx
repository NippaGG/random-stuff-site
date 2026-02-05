"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SYMBOLS = ["!", "@", "#", "$", "%", "&", "*", "(", ")", "_", "[", "]", "{", "}", "|", "<", ">", "?", ":", ";"];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [chars, setChars] = useState<string[]>(["#", "$", "%", "&", "!"]);
  const [isDone, setIsDone] = useState(false);
  const phase = useRef(0);

  useEffect(() => {
    let loopTimeout: NodeJS.Timeout;
    const timeouts: NodeJS.Timeout[] = []; // Store all timers here
    
    const loop = () => {
      const currentPhase = phase.current;

      setChars(prev => {
        const next = [...prev];
        if (currentPhase >= 1) next[0] = ":"; 
        else next[0] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        if (currentPhase >= 2) next[1] = ")"; 
        else next[1] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        if (currentPhase >= 3) {
             if (next.length > 2) return [":", ")"];
        } else {
             for (let i = 2; i < 5; i++) {
                 next[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
             }
        }
        return next;
      });

      if (phase.current < 4) {
          const randomDelay = Math.random() * 100 + 100; 
          loopTimeout = setTimeout(loop, randomDelay);
      }
    };

    loop();

    // Helper to schedule phase changes safely
    const schedule = (ms: number, callback: () => void) => {
        const id = setTimeout(callback, ms);
        timeouts.push(id);
    };

    // TIMELINE
    schedule(1000, () => { phase.current = 1; });
    schedule(1200, () => { phase.current = 2; });
    schedule(1400, () => { phase.current = 3; });
    schedule(1500, () => { 
        phase.current = 4;
        setIsDone(true); 
        schedule(800, onComplete);
    });

    // FIX: CLEANUP EVERYTHING
    return () => {
      clearTimeout(loopTimeout);
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      animate={{ opacity: isDone ? 0 : 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
      style={{ pointerEvents: isDone ? "none" : "auto" }}
    >
      <motion.div
        className="font-bold font-mono text-[#a3e635] flex gap-1"
        animate={{ scale: isDone ? 100 : 1, opacity: isDone ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ fontSize: "5vw" }}
      >
        {chars.join("")}
      </motion.div>
    </motion.div>
  );
}