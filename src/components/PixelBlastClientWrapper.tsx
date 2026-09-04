"use client";

import { useEffect, useState } from "react";
import PixelBlast from "@/components/PixelBlast";

export default function PixelBlastClientWrapper() {
  const [isDirectoryActive, setIsDirectoryActive] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    const onSiteLockChange = (event: Event) => {
      const lockEvent = event as CustomEvent<{ locked?: boolean }>;
      setIsDirectoryActive(Boolean(lockEvent.detail?.locked));
    };

    mql.addEventListener("change", onMediaChange);
    window.addEventListener("site-lock-change", onSiteLockChange);
    return () => {
      mql.removeEventListener("change", onMediaChange);
      window.removeEventListener("site-lock-change", onSiteLockChange);
    };
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
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
      paused={isDirectoryActive}
    />
  );
}
