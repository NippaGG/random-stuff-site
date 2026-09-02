"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { MotionValue } from "framer-motion";

// ── Word definitions ────────────────────────────────
interface WordParticle {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  lineProgress: number;
  flashUntil: number;
  centerLineAlpha: number;
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  tracking: string;
}

const WORD_LIST = [
  "websites", "tools", "scripts", "discover",
  "utilities", "internet", "explore", "open-source",
  "random", "useful", "bookmarks", "dev",
  "design", "code", "resources", "collection",
  "creative", "experiments", "software", "labs",
  "minimal", "web", "interactive", "ideas",
];

// ── Component ───────────────────────────────────────
interface ConstellationWordsProps {
  opacity: MotionValue<number>;
  compact?: boolean;
  paused?: boolean;
}

export default function ConstellationWords({
  opacity,
  compact = false,
  paused = false,
}: ConstellationWordsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const wordRefsMap = useRef<Record<number, HTMLDivElement | null>>({});
  const wordSizesMap = useRef<Record<number, { width: number; height: number }>>({});
  const particlesRef = useRef<WordParticle[]>([]);
  const focusedRef = useRef<number | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userInteractedRef = useRef(false);
  const autoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const opacityRef = useRef(1);
  const centerBoxRef = useRef({ width: 0, height: 0, yOffset: 0 });

  // Center STUFF text reference for collision bounds
  const [isReady, setIsReady] = useState(false);

  // Initialize particles in a beautiful cluster close to the center
  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const spawnRadius = compact ? 120 : 220;

    const FONT_FAMILIES = ["font-sans", "font-serif", "font-mono"];
    const FONT_STYLES = ["italic", "not-italic"];
    const FONT_WEIGHTS = ["font-light", "font-normal", "font-medium", "font-bold", "font-extrabold"];
    const TRACKING_STYLES = ["tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-wider", "tracking-widest"];

    const particles = WORD_LIST.map((text, i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = (0.2 + 0.8 * Math.random()) * spawnRadius;
      
      const fontFamily = FONT_FAMILIES[i % FONT_FAMILIES.length];
      const fontStyle = FONT_STYLES[(i >> 1) % FONT_STYLES.length];
      const fontWeight = FONT_WEIGHTS[(i >> 2) % FONT_WEIGHTS.length];
      const tracking = TRACKING_STYLES[(i >> 3) % TRACKING_STYLES.length];

      return {
        id: i + 1,
        text,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: 0,
        lineProgress: 0,
        flashUntil: 0,
        centerLineAlpha: 1,
        fontFamily,
        fontStyle,
        fontWeight,
        tracking,
      };
    });
    particlesRef.current = particles;
    setIsReady(true);

    return () => {
      autoTimers.current.forEach(clearTimeout);
      autoTimers.current = [];
    };
  }, [compact]);

  // Track framer-motion opacity value
  useEffect(() => {
    const unsubscribe = opacity.on("change", (v) => {
      opacityRef.current = v;
    });
    return unsubscribe;
  }, [opacity]);

  // ── Entrance animation via simple tween ───────────
  useEffect(() => {
    if (!isReady) return;

    const particles = particlesRef.current;
    const start = performance.now();
    const duration = 2000; // 2s entrance

    const animateEntrance = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

      particles.forEach((p, i) => {
        const staggerDelay = (i / particles.length) * 0.6;
        const pProgress = Math.max(0, Math.min(1, (t - staggerDelay) / (1 - staggerDelay)));
        const pEased = 1 - Math.pow(1 - pProgress, 3);
        p.alpha = pEased;
        p.lineProgress = pEased;
      });

      if (t < 1) {
        requestAnimationFrame(animateEntrance);
      } else {
        // Start auto-animation after entrance completes
        scheduleAutoFocus(2000);
      }
    };

    requestAnimationFrame(animateEntrance);
  }, [isReady]);

  // ── Explosion effect ──────────────────────────────
  const triggerExplosion = useCallback(() => {
    const focused = focusedRef.current;
    focusedRef.current = null;
    if (focused === null) return;

    const source = particlesRef.current.find(p => p.id === focused);
    if (!source) return;

    const sx = source.x;
    const sy = source.y;

    particlesRef.current.forEach(p => {
      const dx = p.x - sx;
      const dy = p.y - sy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      p.vx += (dx / dist) * 2.2;
      p.vy += (dy / dist) * 2.2;
    });

    // Give the source word a random push
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 0.5;
    source.vx = Math.cos(angle) * speed;
    source.vy = Math.sin(angle) * speed;
  }, []);

  // ── Auto-focus (idle animation) ───────────────────
  const scheduleAutoFocus = useCallback((delay: number) => {
    if (userInteractedRef.current) return;
    const t = setTimeout(() => {
      if (userInteractedRef.current) return;
      if (focusedRef.current !== null) {
        scheduleAutoFocus(5000);
        return;
      }

      const eligible = particlesRef.current.filter(p => (p.alpha ?? 0) >= 0.95);
      if (eligible.length === 0) {
        scheduleAutoFocus(1500);
        return;
      }

      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      focusedRef.current = pick.id;
      scheduleAutoFocus(6500);

      // After 1.5s, trigger explosion
      const explodeTimer = setTimeout(() => {
        if (focusedRef.current !== pick.id || userInteractedRef.current) return;
        triggerExplosion();
      }, 1500);
      autoTimers.current.push(explodeTimer);
    }, delay);
    autoTimers.current.push(t);
  }, [triggerExplosion]);

  // ── Hover handlers ────────────────────────────────
  const handleWordEnter = useCallback((id: number) => {
    const p = particlesRef.current.find(p => p.id === id);
    if (!p || (p.alpha ?? 0) < 0.95) return;
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
    focusedRef.current = id;
  }, []);

  const handleWordLeave = useCallback((id: number) => {
    if (focusedRef.current !== id) return;
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      triggerExplosion();
      focusTimeoutRef.current = null;
    }, 70);
  }, [triggerExplosion]);

  // ── Resize + animation loop ───────────────────────
  useEffect(() => {
    if (!isReady || paused) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Resize canvas
    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Measure word element sizes
      Object.entries(wordRefsMap.current).forEach(([key, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        wordSizesMap.current[Number(key)] = { width: rect.width, height: rect.height };
      });

      // Estimate center wordmark bounds (the "STUFF" text area)
      // The center column in HeroSection is ~300px wide, ~100px tall
      centerBoxRef.current = {
        width: compact ? 200 : 300,
        height: compact ? 60 : 100,
        yOffset: compact ? -30 : -40, // offset upward from true center
      };
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // ── Main animation loop ─────────────────────
    const tick = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Apply container-level opacity
      const containerOpacity = opacityRef.current;
      if (containerOpacity < 0.01) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const focused = focusedRef.current;
      const cBox = centerBoxRef.current;

      particlesRef.current.forEach(p => {
        const isFocused = focused === p.id;
        const hasFocus = focused !== null;
        const size = wordSizesMap.current[p.id] || { width: 100, height: 30 };
        let { x, y, vx, vy } = p;

        // ── Physics forces ──────────────────────
        if (isFocused) {
          // Slow down the focused word
          vx *= 0.55;
          vy *= 0.55;
        } else if (hasFocus && typeof focused === "number") {
          const target = particlesRef.current.find(q => q.id === focused);
          if (target) {
            const dx = target.x - x;
            const dy = target.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            if (dist < 380) {
              const nx = dx / dist;
              const ny = dy / dist;

              if (dist > 95) {
                // Attract toward focused word
                const strength = 0.022 * Math.min(1, (380 - dist) / 200);
                vx += nx * strength;
                vy += ny * strength;
              } else {
                // Repulse if too close
                const strength = 0.05 * (1 - dist / 95);
                vx -= nx * strength;
                vy -= ny * strength;
              }
            }
          }

          // Word-word repulsion
          particlesRef.current.forEach(other => {
            if (other.id === p.id || other.id === focused) return;
            const dx2 = x - other.x;
            const dy2 = y - other.y;
            const d2 = dx2 * dx2 + dy2 * dy2;
            if (d2 < 4900 && d2 > 1) { // 70px radius
              const dist2 = Math.sqrt(d2);
              const strength = 0.06 * (1 - dist2 / 70);
              vx += (dx2 / dist2) * strength;
              vy += (dy2 / dist2) * strength;
            }
          });
        }

        // Gentle attraction to the center to keep them close (closer floating words)
        const dxToCenter = cx - x;
        const dyToCenter = (cy + (cBox.yOffset || 0)) - y;
        const distToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter) || 1;
        const maxRadius = compact ? 220 : 380;
        if (distToCenter > maxRadius) {
          const pullStrength = 0.015 * ((distToCenter - maxRadius) / 100);
          vx += (dxToCenter / distToCenter) * Math.min(pullStrength, 0.05);
          vy += (dyToCenter / distToCenter) * Math.min(pullStrength, 0.05);
        }

        // Damping
        if (Math.abs(vx) > 0.3) vx *= 0.98;
        if (Math.abs(vy) > 0.3) vy *= 0.98;

        // Apply velocity
        x += vx;
        y += vy;

        // ── Center wordmark collision ────────────
        if (cBox.width > 0 && cBox.height > 0) {
          const halfW = cBox.width / 2 + size.width / 2;
          const halfH = cBox.height / 2 + size.height / 2;
          const relX = x - cx;
          const relY = y - (cy + (cBox.yOffset || 0));

          if (Math.abs(relX) < halfW && Math.abs(relY) < halfH) {
            const overlapX = halfW - Math.abs(relX);
            const overlapY = halfH - Math.abs(relY);
            if (overlapX < overlapY) {
              if (relX > 0) { x += overlapX; vx = Math.abs(vx); }
              else { x -= overlapX; vx = -Math.abs(vx); }
            } else {
              if (relY > 0) { y += overlapY; vy = Math.abs(vy); }
              else { y -= overlapY; vy = -Math.abs(vy); }
            }

            // Flash effect on collision
            if (now > (p.flashUntil || 0) + 120) {
              p.flashUntil = now + 240;
            }
          }
        }

        // ── Edge bouncing ───────────────────────
        const padX = size.width / 2 + 20;
        const padY = size.height / 2 + 20;
        if (x < padX) { x = padX; vx = Math.max(Math.abs(vx), 0.2); }
        else if (x > W - padX) { x = W - padX; vx = -Math.max(Math.abs(vx), 0.2); }
        if (y < padY) { y = padY; vy = Math.max(Math.abs(vy), 0.2); }
        else if (y > H - padY) { y = H - padY; vy = -Math.max(Math.abs(vy), 0.2); }

        // Commit
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;

        // ── Update DOM position ─────────────────
        let renderX = x;
        let renderY = y;
        if (isFocused) {
          renderX += (Math.random() - 0.5) * 1.6;
          renderY += (Math.random() - 0.5) * 1.6;
        }

        const el = wordRefsMap.current[p.id];
        if (el) {
          el.style.transform = `translate3d(${renderX}px,${renderY}px,0) translate(-50%,-50%)`;
          el.style.opacity = String(p.alpha * containerOpacity);
        }

        // ── Draw connecting line to center ───────
        // Line from center wordmark edge to word edge
        let lineStartX = cx;
        let lineStartY = cy + (cBox.yOffset || 0);
        let lineEndX = x;
        let lineEndY = y;

        // Clip line start to center wordmark ellipse
        if (cBox.width > 0 && cBox.height > 0) {
          const dx = lineEndX - cx;
          const dy = lineEndY - (cy + (cBox.yOffset || 0));
          const a = cBox.width / 2;
          const b = cBox.height / 2;
          const val = (dx / a) ** 2 + (dy / b) ** 2;
          const t = val > 0 ? 1 / Math.sqrt(val) : 1;
          if (t < 1) {
            lineStartX = cx + dx * t;
            lineStartY = cy + (cBox.yOffset || 0) + dy * t;
          }
        }

        // Clip line end to word element box
        {
          const dx = lineStartX - lineEndX;
          const dy = lineStartY - lineEndY;
          const ratioX = Math.min(size.width / 2 / Math.abs(dx || 1), 1);
          const ratioY = Math.min(size.height / 2 / Math.abs(dy || 1), 1);
          const clamp = Math.min(ratioX, ratioY);
          if (clamp < 1) {
            lineEndX += dx * clamp;
            lineEndY += dy * clamp;
          }
        }

        const lineLenSq = (lineEndX - lineStartX) ** 2 + (lineEndY - lineStartY) ** 2;
        const progress = p.lineProgress ?? p.alpha;

        // Line alpha fading when another word is focused nearby
        let targetCenterAlpha = 1;
        if (hasFocus && !isFocused && typeof focused === "number") {
          const target = particlesRef.current.find(q => q.id === focused);
          if (target) {
            const dx = p.x - target.x;
            const dy = p.y - target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= 320) targetCenterAlpha = 0;
            else if (dist < 380) targetCenterAlpha = (dist - 320) / 60;
          }
        }
        p.centerLineAlpha += (targetCenterAlpha - p.centerLineAlpha) * 0.06;

        if (lineLenSq > 100 && progress > 0.01 && p.centerLineAlpha > 0.02) {
          const flashRemaining = Math.max(0, (p.flashUntil || 0) - now);
          const flashIntensity = flashRemaining > 0 ? Math.pow(flashRemaining / 240, 2) : 0;

          const baseAlpha = flashIntensity > 0
            ? (0.6 + 0.4 * flashIntensity) * p.centerLineAlpha * containerOpacity
            : 0.45 * p.centerLineAlpha * containerOpacity;

          // Create a beautiful linear gradient to fade out towards the center
          const grad = ctx.createLinearGradient(lineStartX, lineStartY, lineEndX, lineEndY);
          grad.addColorStop(0, `rgba(163, 230, 53, 0)`);
          grad.addColorStop(0.35, `rgba(163, 230, 53, ${baseAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(163, 230, 53, ${baseAlpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = flashIntensity > 0 ? 1.0 + 1.5 * flashIntensity : 0.85;

          ctx.beginPath();
          ctx.moveTo(lineStartX, lineStartY);
          ctx.lineTo(
            lineStartX + (lineEndX - lineStartX) * progress,
            lineStartY + (lineEndY - lineStartY) * progress
          );
          ctx.stroke();
        }
      });

      // ── Draw inter-word lines when a word is focused ──
      if (focused !== null && typeof focused === "number") {
        const source = particlesRef.current.find(p => p.id === focused);
        if (source) {
          const srcSize = wordSizesMap.current[source.id] || { width: 80, height: 30 };

          particlesRef.current.forEach(other => {
            if (other.id === source.id) return;
            const a = Math.min(1, other.alpha ?? 1);
            if (a < 0.02) return;

            const dx = other.x - source.x;
            const dy = other.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist >= 380) return;

            const distAlpha = dist > 320 ? (380 - dist) / 60 : 1;
            const lineAlpha = distAlpha * a * Math.min(1, source.alpha ?? 1) * 0.6;
            if (lineAlpha < 0.02) return;

            // Clip to source word bounds
            const srcClamp = Math.min(srcSize.width / 2 / Math.abs(dx || 1), srcSize.height / 2 / Math.abs(dy || 1), 1);
            const sx = source.x + dx * srcClamp;
            const sy = source.y + dy * srcClamp;

            // Clip to target word bounds
            const tgtSize = wordSizesMap.current[other.id] || { width: 80, height: 30 };
            const tgtClamp = Math.min(tgtSize.width / 2 / Math.abs(dx || 1), tgtSize.height / 2 / Math.abs(dy || 1), 1);
            const tx = other.x - dx * tgtClamp;
            const ty = other.y - dy * tgtClamp;

            ctx.strokeStyle = `rgba(163, 230, 53, ${lineAlpha * containerOpacity * 0.75})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
          });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, compact, paused]);

  if (!isReady) return null;

  // On mobile compact mode, show fewer words
  const visibleWords = compact
    ? particlesRef.current.slice(0, 8)
    : particlesRef.current;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[5] overflow-hidden"
    >
      {/* Canvas for lines */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Word elements */}
      {visibleWords.map(p => (
        <div
          key={p.id}
          ref={el => { wordRefsMap.current[p.id] = el; }}
          className={`
            absolute z-10 cursor-pointer select-none pointer-events-auto
            ${p.fontFamily} ${p.fontStyle} ${p.fontWeight} ${p.tracking}
            ${compact
              ? "text-[11px] text-[#a3e635]/60"
              : "text-[13px] md:text-[15px] text-[#a3e635]/50 hover:text-[#a3e635]/90"
            }
            transition-colors duration-200
          `}
          style={{
            opacity: 0,
            willChange: "transform, opacity",
          }}
          onMouseEnter={() => {
            userInteractedRef.current = true;
            handleWordEnter(p.id);
          }}
          onMouseLeave={() => handleWordLeave(p.id)}
          onTouchStart={() => {
            userInteractedRef.current = true;
            handleWordEnter(p.id);
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
}
