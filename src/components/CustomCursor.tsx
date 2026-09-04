"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isOverTextInput, setIsOverTextInput] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);
    const isHoveringRef = useRef(false);
    const isOverTextInputRef = useRef(false);

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
        let rafId: number | null = null;
        let hasPosition = false;

        const renderPosition = () => {
            dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        };

        const animate = () => {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            const remainingDistance = Math.max(
                Math.abs(mouseX - dotX),
                Math.abs(mouseY - dotY),
                Math.abs(mouseX - ringX),
                Math.abs(mouseY - ringY),
            );

            if (remainingDistance < 0.1) {
                dotX = mouseX;
                dotY = mouseY;
                ringX = mouseX;
                ringY = mouseY;
                renderPosition();
                rafId = null;
                return;
            }

            renderPosition();
            rafId = requestAnimationFrame(animate);
        };

        const requestCursorFrame = () => {
            if (rafId === null) rafId = requestAnimationFrame(animate);
        };

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!hasPosition) {
                dotX = mouseX;
                dotY = mouseY;
                ringX = mouseX;
                ringY = mouseY;
                hasPosition = true;
                renderPosition();
            }
            requestCursorFrame();
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

        // Check if hovering over interactive elements or text inputs
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const isTextInput = !!target.closest('input, textarea, [contenteditable="true"]');
            if (isOverTextInputRef.current !== isTextInput) {
                isOverTextInputRef.current = isTextInput;
                setIsOverTextInput(isTextInput);
            }

            const isInteractive = !isTextInput && !!(
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a, button, [role="button"], .cursor-pointer, select, label')
            );

            if (isHoveringRef.current !== isInteractive) {
                isHoveringRef.current = isInteractive;
                setIsHovering(isInteractive);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    const cursorOpacity = isVisible && !isOverTextInput ? 1 : 0;

    return (
        <>
            {/* Center dot or symbol */}
            <div
                ref={dotRef}
                className="custom-cursor"
                style={{
                    opacity: cursorOpacity,
                    transition: 'opacity 0.2s ease'
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
                    opacity: cursorOpacity,
                    transition: 'opacity 0.2s ease'
                }}
            />
        </>
    );
}
