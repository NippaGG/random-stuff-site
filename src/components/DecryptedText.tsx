"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  parentTrigger?: unknown; // To trigger animation from parent
  animateOnHover?: boolean;
  useScrambleOnHover?: boolean;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function DecryptedText({
  text,
  speed = 50,
  className = "",
  parentTrigger,
  animateOnHover = false,
  useScrambleOnHover = false,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);

  // Ref to track if component is mounted
  const isMounted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const animate = useCallback(() => {
    let iteration = 0;

    // Clear any existing animation before starting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // Safety check: Stop if unmounted
      if (!isMounted.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 2; // Slower reveal for cooler effect
    }, speed);
  }, [text, speed]);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isMounted.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setDisplayText(
        text.split("").map(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]).join("")
      );
    }, speed);
  }, [text, speed]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Animate back to original text for smoothness
    animate();
  }, [animate]);

  // Trigger animation when parentTrigger changes (e.g. active tab changes)
  useEffect(() => {
    if (!useScrambleOnHover) {
      animate();
    }
  }, [parentTrigger, useScrambleOnHover, animate]);

  const handleMouseEnter = () => {
    if (useScrambleOnHover) {
      startScramble();
    } else if (animateOnHover) {
      animate();
    }
  };

  const handleMouseLeave = () => {
    if (useScrambleOnHover) {
      stopScramble();
    }
  };

  return (
    <span
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}