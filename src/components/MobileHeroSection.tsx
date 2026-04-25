"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { items as fallbackItems, type Item } from "@/data/items";
import { scrollToY } from "@/lib/lenis";

const SYMBOLS = ["!", "@", "#", "$", "%", "&", "*", "(", ")", "_", "[", "]", "{", "}", "|", "<", ">", "?", ":", ";"];
const FINAL_TEXT = "RANDOM \nSTUFF.";

export default function MobileHeroSection() {
    const [lastUpdated, setLastUpdated] = useState<string>("...");
    const [itemCount, setItemCount] = useState(fallbackItems.length);
    const [scrambledText, setScrambledText] = useState<string>("####### \n######*");
    const phaseRef = useRef(0);

    // Initial load text scramble effect
    useEffect(() => {
        let loopTimeout: NodeJS.Timeout;
        const timeouts: NodeJS.Timeout[] = [];

        const loop = () => {
            const currentPhase = phaseRef.current;

            setScrambledText(() => {
                let result = "";
                // Phase 0: completely random
                // Phase 1: "RANDOM" revealed, rest random
                // Phase 2: Fully revealed

                const lines = FINAL_TEXT.split("\n");

                if (currentPhase >= 2) {
                    return FINAL_TEXT;
                }

                for (let i = 0; i < lines.length; i++) {
                    const word = lines[i];
                    for (let j = 0; j < word.length; j++) {
                        if (word[j] === " ") {
                            result += " ";
                            continue;
                        }

                        if (currentPhase === 1 && i === 0) {
                            // First word revealed
                            result += word[j];
                        } else {
                            result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                        }
                    }
                    if (i < lines.length - 1) result += "\n";
                }

                return result;
            });

            if (phaseRef.current < 2) {
                const randomDelay = Math.random() * 80 + 40;
                loopTimeout = setTimeout(loop, randomDelay);
            }
        };

        // Start scrambling slightly after image loads
        timeouts.push(setTimeout(() => {
            loop();
            timeouts.push(setTimeout(() => { phaseRef.current = 1; }, 800));
            timeouts.push(setTimeout(() => { phaseRef.current = 2; }, 1600));
        }, 800));

        return () => {
            clearTimeout(loopTimeout);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        const date = new Date(document.lastModified);

        if (Number.isNaN(date.getTime())) {
            setLastUpdated("Unknown");
            return;
        }

        const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
        setLastUpdated(formatted);
    }, []);

    useEffect(() => {
        let isMounted = true;

        fetch("/api/items")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Items request failed: ${response.status}`);
                }
                return response.json() as Promise<Item[]>;
            })
            .then((nextItems) => {
                if (isMounted && nextItems.length > 0) {
                    setItemCount(nextItems.length);
                }
            })
            .catch((error) => {
                console.error("Failed to load database item count:", error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="text-white min-h-screen antialiased flex flex-col relative z-0">
            {/* Hero Area */}
            <div className="relative h-[55vh] w-full overflow-hidden">

                {/* Noise Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
                        backgroundSize: "12px 12px",
                    }}
                />

                {/* Gradient fade to dark background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: [
                            "radial-gradient(circle at 21% 8%, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.82) 13%, rgba(0, 0, 0, 0.18) 32%, transparent 48%)",
                            "linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 0%, rgba(5, 5, 5, 0.52) 64%, rgba(5, 5, 5, 0.94) 100%)",
                            "radial-gradient(circle at 31% 78%, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.6) 24%, transparent 52%)",
                        ].join(", "),
                    }}
                />

                {/* Top Badge */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-white/90 font-mono text-[10px] tracking-[0.3em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
                    >
                        COLLECTION {String(itemCount).padStart(3, "0")}
                    </motion.div>
                </div>

                {/* Main Hero Text */}
                <div className="absolute bottom-0 left-0 w-full p-8 space-y-2 z-20 pointer-events-none">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter leading-none whitespace-pre-line"
                    >
                        {scrambledText.split('\n')[0]}
                        {"\n"}
                        {scrambledText.split('\n')[1] && scrambledText.split('\n')[1].slice(0, -1)}
                        <span className="text-[#a3e635]">
                            {scrambledText.split('\n')[1] ? scrambledText.split('\n')[1].slice(-1) : ""}
                        </span>
                    </motion.h1>
                </div>
            </div>

            {/* Below Image Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex-1 flex flex-col px-8 pt-4 pb-8 gap-6 justify-between bg-black/95 backdrop-blur-[1px]"
            >
                <div className="space-y-6 max-w-md">
                    <p className="text-lg md:text-xl text-slate-400 font-light leading-snug">
                        A curated collection of interesting <span className="text-[#bef264]">websites, tools</span>, and <span className="text-[#bef264]">scripts</span> from across the internet.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            const anchor = document.getElementById('mobile-content-anchor');
                            if (anchor) {
                                const rect = anchor.getBoundingClientRect();
                                scrollToY(window.scrollY + rect.top);
                            }
                        }}
                        aria-label="Scroll to the mobile directory"
                        className="group relative flex items-center justify-between px-8 py-5 bg-[#bef264] text-[#0a0a0a] font-bold uppercase tracking-widest text-[14px] overflow-hidden transition-all hover:pr-12"
                    >
                        <span>Launch</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Footer / Meta info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="p-8 pt-0 flex justify-between items-center bg-black/[0.86] text-white/55 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-[1px]"
            >
                <div className="flex gap-4 sm:gap-8 flex-wrap">
                    <div>Updated / {lastUpdated}</div>
                </div>
                <div className="hidden sm:block">All rights reserved</div>
            </motion.div>

            {/* Bottom Graphic Accents */}
            <div className="bg-black/[0.86] backdrop-blur-[1px]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="p-10 grayscale pb-20"
                >
                    <div className="grid grid-cols-3 gap-10">
                        <div className="aspect-square bg-slate-800"></div>
                        <div className="aspect-square bg-slate-800"></div>
                        <div className="aspect-square bg-slate-800"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
