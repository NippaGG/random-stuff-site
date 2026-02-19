"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, RefreshCw, Star } from "lucide-react";

const SYMBOLS = "⋆˙⟡☁︎｡☾✦✧◈◇△▽○●♦♢♠♤♣♧★☆⊕⊗⌘⏣⎔⊹※†‡§¶⁂⁕⁑∞∆∇≈≡⊼⊻⋄⋅⋮⋯⌓⌔⏏⏝⎈⏚";

interface PortfolioOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PortfolioOverlay({ isOpen, onClose }: PortfolioOverlayProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);
    // Scrambling symbols animation — each position changes independently
    const SYMBOL_COUNT = 15;
    const [symbols, setSymbols] = useState<string[]>(() =>
        Array.from({ length: SYMBOL_COUNT }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    );
    const [isHovering, setIsHovering] = useState(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        if (!isOpen || isHovering) {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
            return;
        }

        const scheduleChar = (index: number) => {
            const delay = 200 + Math.random() * 800;
            const t = setTimeout(() => {
                setSymbols(prev => {
                    const next = [...prev];
                    next[index] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    return next;
                });
                scheduleChar(index);
            }, delay);
            timeoutsRef.current[index] = t;
        };

        for (let i = 0; i < SYMBOL_COUNT; i++) {
            scheduleChar(i);
        }

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, [isOpen, isHovering]);

    const symbolText = symbols.join("");

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                        className="relative w-full max-w-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main Card */}
                        <div className="bg-[#0a0a0a] rounded-none border border-[#a3e635]/30 shadow-[0_0_30px_rgba(163,230,53,0.12),0_0_60px_rgba(163,230,53,0.04)] backdrop-blur-md bg-opacity-95 overflow-hidden">

                            {/* Welcome Tab */}
                            <div className="px-5 py-2 border-b border-[#a3e635]/20">
                                <span className="font-mono font-bold text-sm text-[#a3e635] drop-shadow-[0_0_5px_rgba(163,230,53,0.5)]">
                                    welcome!
                                </span>
                            </div>


                            {/* Header / Nav */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-2 border-b border-[#a3e635]/20">
                                <div className="flex gap-4 text-gray-500">
                                    <ArrowLeft size={20} className="cursor-pointer hover:text-[#a3e635] transition-colors" />
                                    <ArrowRight size={20} className="cursor-pointer hover:text-[#a3e635] transition-colors" />
                                    <RefreshCw size={18} className="cursor-pointer hover:text-[#a3e635] transition-colors" />
                                </div>
                                <div className="flex-1 w-full bg-[#050505] rounded-none px-4 py-2 flex justify-between items-center text-sm font-mono border border-white/5 shadow-inner shadow-black/50">
                                    <span className="text-[#a3e635] tracking-wide drop-shadow-[0_0_2px_rgba(163,230,53,0.3)]">
                                        random-stuff.site
                                    </span>
                                    <Star size={14} className="text-gray-500 hover:text-[#a3e635] cursor-pointer" />
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="p-5 pt-2 grid grid-cols-1 md:grid-cols-12 gap-4">

                                {/* Left Column */}
                                <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-black text-[#a3e635] font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                                            NIPUN
                                        </h1>
                                        <p className="text-gray-400 italic mt-1 text-sm font-medium font-serif">
                                            software engineer / creator
                                        </p>
                                    </div>

                                    <div className="w-full border-t border-dashed border-[#a3e635]/50"></div>

                                    <div className="w-full border border-white/10 p-2 bg-[#050505]/80 text-xs font-mono rounded-none shadow-inner text-gray-300">
                                        <span className="font-bold text-[#a3e635]">STATUS</span> BSc Software Engineering @ OUSL
                                    </div>

                                    <div className="text-xs leading-relaxed w-full text-left md:text-center font-mono text-gray-400">
                                        <span className="font-bold text-[#a3e635] italic mr-1">languages</span>
                                        C, Python, TypeScript, Java, PHP, JavaScript
                                    </div>

                                    <div className="text-xs leading-relaxed w-full text-left md:text-center font-mono text-gray-400">
                                        <span className="font-bold text-[#a3e635] italic mr-1">web</span>
                                        React, Next.js, HTML, CSS, Tailwind
                                    </div>


                                    <div className="text-xs leading-relaxed w-full text-left md:text-center font-mono text-gray-400">
                                        <span className="font-bold text-[#a3e635] italic mr-1">mobile</span>
                                        React Native, Swift
                                    </div>

                                    <div className="text-xs leading-relaxed w-full text-left md:text-center font-mono text-gray-400">
                                        <span className="font-bold text-[#a3e635] italic mr-1">other</span>
                                        Custom PC Building, Social Media Mgmt, Video Editing
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="md:col-span-7 flex flex-col space-y-3">
                                    <div className="relative group max-w-[280px] mx-auto w-full">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a3e635] to-green-900 rounded-none blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative w-full max-w-[280px] mx-auto aspect-square rounded-none overflow-hidden border border-white/10 bg-[#050505]">
                                            <Image
                                                src="/icon.png"
                                                alt="Nipun Yatawara"
                                                fill
                                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="text-center text-[#a3e635] font-mono text-xs tracking-widest drop-shadow-[0_0_3px_rgba(163,230,53,0.4)] cursor-default select-none h-4 overflow-hidden"
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                    >
                                        {isHovering ? ":)" : symbolText}
                                    </div>

                                </div>

                                {/* Bottom Row — Interests & Experience side by side */}
                                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Interests */}
                                    <div className="text-xs leading-relaxed bg-[#050505]/30 p-3 rounded-none border border-white/10 text-gray-400 font-mono">
                                        <span className="font-bold text-[#a3e635] italic mr-2 text-sm block mb-1">interests</span>
                                        Custom PC building, hardware troubleshooting, Next.js & PHP
                                    </div>

                                    {/* Experience */}
                                    <div className="text-xs leading-relaxed bg-[#050505]/30 p-3 rounded-none border border-white/10 text-gray-400 font-mono">
                                        <span className="font-bold text-[#a3e635] italic mr-2 text-sm block mb-1">experience</span>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-white/80 font-bold">Social Media Manager</span>
                                                <span className="text-gray-600 ml-2 text-xs">2025 - Present</span>
                                            </div>
                                            <div>
                                                <span className="text-white/80 font-bold">Freelance Video Editor</span>
                                                <span className="text-gray-600 ml-2 text-xs">2022 - 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-[#a3e635]/20 bg-[#0a0a0a]">
                                <div className="flex justify-between items-center text-xs font-mono text-gray-600">
                                    <span>nipunparanga50@gmail.com</span>
                                    <span>ShockaGG</span>
                                </div>
                            </div>



                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
