"use client";

import React, { useEffect, useState } from "react";
import { isCrtEnabled } from "@/lib/theme-manager";

export default function CrtScanlines() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isCrtEnabled());
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      setEnabled(custom.detail?.enabled ?? false);
    };

    window.addEventListener("crt-change", handler);
    return () => window.removeEventListener("crt-change", handler);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Repeating Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 3px, 3px 100%",
        }}
      />
      {/* CRT Vignette curvature */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 65%, rgba(0, 0, 0, 0.6) 100%)",
          boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.8)",
        }}
      />
    </div>
  );
}
