import { useEffect, useRef } from "react";

export default function ProgressiveLoadSentinel({
  onVisible,
  rootMargin,
  triggerKey,
  className = "",
}: {
  onVisible: () => void;
  rootMargin: string;
  triggerKey: string | number;
  className?: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const preloadDistance = Number.parseFloat(rootMargin) || 0;
    let hasTriggered = false;
    let rafId: number | null = null;

    const triggerOnce = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      onVisibleRef.current();
    };

    const checkPosition = () => {
      rafId = null;
      const bounds = sentinel.getBoundingClientRect();
      const isNearViewport =
        bounds.top <= window.innerHeight + preloadDistance &&
        bounds.bottom >= -preloadDistance;
      if (isNearViewport) triggerOnce();
    };

    const scheduleCheck = () => {
      if (rafId === null) rafId = requestAnimationFrame(checkPosition);
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) triggerOnce();
          },
          { rootMargin },
        )
      : null;

    observer?.observe(sentinel);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);
    window.addEventListener("orientationchange", scheduleCheck);
    scheduleCheck();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      window.removeEventListener("orientationchange", scheduleCheck);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rootMargin, triggerKey]);

  return <div ref={sentinelRef} className={className} aria-hidden="true" />;
}
