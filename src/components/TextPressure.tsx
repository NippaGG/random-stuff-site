"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
  stopAnimation?: boolean; // 1. Interface definition
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = '',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',
  minFontSize = 24,
  stopAnimation = false // 2. THIS WAS MISSING! It must be here to exist.
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const charOffsetsRef = useRef<{ x: number; y: number }[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const lastAppliedRef = useRef({ x: Number.NaN, y: Number.NaN });
  const isLoopingRef = useRef(false);
  const rafIdRef = useRef(0);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const requestTick = useCallback(() => {
    if (!isLoopingRef.current && !stopAnimation) {
      isLoopingRef.current = true;
      rafIdRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [stopAnimation]);

  const animateRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (stopAnimation) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      requestTick();
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
      requestTick();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [stopAnimation, requestTick]);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }

      charOffsetsRef.current = spansRef.current.map((span) => {
        if (!span) return { x: 0, y: 0 };
        const rect = span.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2 - textRect.x,
          y: rect.y + rect.height / 2 - textRect.y,
        };
      });
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(setSize, 100);
    };
    setSize();
    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [setSize]);

  // THE MAIN ANIMATION LOOP
  useEffect(() => {
    if (stopAnimation) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      isLoopingRef.current = false;
      return;
    }

    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      const pointerSettled =
        Math.abs(cursorRef.current.x - mouseRef.current.x) < 0.1 &&
        Math.abs(cursorRef.current.y - mouseRef.current.y) < 0.1 &&
        Math.abs(lastAppliedRef.current.x - mouseRef.current.x) < 0.1 &&
        Math.abs(lastAppliedRef.current.y - mouseRef.current.y) < 0.1;

      if (pointerSettled) {
        isLoopingRef.current = false;
        return; // Halt RAF loop when pointer settles
      }

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        const offsets = charOffsetsRef.current;

        // Use cached relative character offsets instead of querying 37+ DOM rects per frame
        const spanUpdates = spansRef.current.map((span, index) => {
          if (!span) return null;

          const offset = offsets[index] || { x: 0, y: 0 };
          const charCenter = {
            x: titleRect.x + offset.x,
            y: titleRect.y + offset.y,
          };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          return { span, newFontVariationSettings, alphaVal };
        });

        // BATCH WRITES: apply all styles after computing
        spanUpdates.forEach((update) => {
          if (!update) return;

          if (update.span.style.fontVariationSettings !== update.newFontVariationSettings) {
            update.span.style.fontVariationSettings = update.newFontVariationSettings;
          }
          if (alpha && update.span.style.opacity !== update.alphaVal.toString()) {
            update.span.style.opacity = update.alphaVal.toString();
          }
        });

        lastAppliedRef.current = {
          x: mouseRef.current.x,
          y: mouseRef.current.y,
        };
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    animateRef.current = animate;
    isLoopingRef.current = true;
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      isLoopingRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [width, weight, italic, alpha, stopAnimation]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        ${fontUrl ? `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }` : ''}
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
    );
  }, [fontFamily, fontUrl, textColor, strokeColor, strokeWidth]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${
          flex ? 'flex justify-between' : ''
        } ${stroke ? 'stroke' : ''} uppercase text-center`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
          width: '100%',
          willChange: 'transform, opacity'
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => { spansRef.current[i] = el; }}
            data-char={char}
            className="inline-block"
            style={char === ' ' ? { minWidth: '0.3em' } : undefined}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
