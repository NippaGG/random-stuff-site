"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);
    const isHoveringRef = useRef(false);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;

        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let ringX = 0;
        let ringY = 0;
        let rafId = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
            }
        };

        const onMouseEnter = () => {
            if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
            }
        };
        const onMouseLeave = () => {
            if (isVisibleRef.current) {
                isVisibleRef.current = false;
                setIsVisible(false);
            }
        };

        // Check if hovering over interactive elements
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = !!(
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer') ||
                getComputedStyle(target).cursor === 'pointer'
            );

            if (isHoveringRef.current !== isInteractive) {
                isHoveringRef.current = isInteractive;
                setIsHovering(isInteractive);
            }
        };

        // Smooth animation loop
        const animate = () => {
            // Dot follows mouse directly with slight smoothing
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;

            // Ring follows with more delay for trailing effect
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);

        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <>
            {/* Center dot or symbol */}
            <div
                ref={dotRef}
                className="custom-cursor"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            >
                {isHovering ? (
                    // Plus symbol when hovering
                    <div className="w-4 h-4 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            className="transition-transform duration-200"
                            style={{ transform: 'rotate(0deg)' }}
                        >
                            <path
                                d="M7 1V13M1 7H13"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                ) : (
                    // Regular dot
                    <div className="custom-cursor-dot" />
                )}
            </div>

            {/* Outer ring */}
            <div
                ref={ringRef}
                className="custom-cursor custom-cursor-ring"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />
        </>
    );
}
