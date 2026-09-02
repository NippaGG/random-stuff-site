"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, MotionValue, useMotionValue, useTransform, animate } from "framer-motion";
import {
    Globe, Terminal, MonitorSmartphone, Code2, Binary, Zap, Box, Layers,
    Cpu, Database, Wifi, Cloud, Lock, Key, Folder, File, Settings, Star
} from "lucide-react";

const ALL_ICONS = [
    Globe, Terminal, MonitorSmartphone, Code2, Binary, Zap, Box, Layers,
    Cpu, Database, Wifi, Cloud, Lock, Key, Folder, File, Settings, Star
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>{}[]";

interface OrbitingIconProps {
    orbitRadiusX: number;
    orbitRadiusY: number;
    orbitSpeed: number;
    startAngle: number;
    size: number;
    orbitRotation: number;
    startIconIndex: number;
}

const OrbitingIcon = ({
    orbitRadiusX,
    orbitRadiusY,
    orbitSpeed,
    startAngle,
    size,
    orbitRotation,
    startIconIndex,
}: OrbitingIconProps) => {
    const [currentIconIndex, setCurrentIconIndex] = useState(startIconIndex);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [scrambleChar, setScrambleChar] = useState("");
    const [iconOpacity, setIconOpacity] = useState(1);
    const [isHydrated, setIsHydrated] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const cycleRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    const angle = useMotionValue(startAngle);

    const orbitRotationRad = orbitRotation * Math.PI / 180;

    const x = useTransform(angle, (a) => {
        const rad = a * Math.PI / 180;
        const baseX = Math.cos(rad) * orbitRadiusX;
        const baseY = Math.sin(rad) * orbitRadiusY;
        return baseX * Math.cos(orbitRotationRad) - baseY * Math.sin(orbitRotationRad);
    });

    const y = useTransform(angle, (a) => {
        const rad = a * Math.PI / 180;
        const baseX = Math.cos(rad) * orbitRadiusX;
        const baseY = Math.sin(rad) * orbitRadiusY;
        return baseX * Math.sin(orbitRotationRad) + baseY * Math.cos(orbitRotationRad);
    });

    const zIndex = useTransform(angle, (a) => {
        const rad = a * Math.PI / 180;
        return Math.sin(rad) < 0 ? 40 : 60;
    });

    const getRandomDelay = () => Math.random() * 3 + 1;
    const getRandomCycleDuration = () => Math.random() * 3 + 3;

    useEffect(() => {
        isMounted.current = true;
        setIsHydrated(true);

        const controls = animate(angle, angle.get() + 360, {
            duration: orbitSpeed,
            repeat: Infinity,
            ease: "linear",
        });

        const startTimeout = setTimeout(() => {
            if (!isMounted.current) return;
            startCycle();
        }, getRandomDelay() * 1000);

        return () => {
            isMounted.current = false;
            controls.stop();
            clearTimeout(startTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (cycleRef.current) clearTimeout(cycleRef.current);
        };
    }, []);

    const startCycle = () => {
        // Change to next icon first, then decrypt to reveal it
        setCurrentIconIndex(prev => (prev + 4) % ALL_ICONS.length);
        decrypt();

        // Schedule next cycle
        const cycleDuration = getRandomCycleDuration();
        cycleRef.current = setTimeout(() => {
            if (!isMounted.current) return;
            startCycle();
        }, cycleDuration * 1000);
    };

    const decrypt = () => {
        setIsDecrypting(true);
        let iteration = 0;
        const maxIterations = 12;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (!isMounted.current) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }
            setScrambleChar(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
            iteration++;
            if (iteration >= maxIterations) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsDecrypting(false);
                setScrambleChar("");
            }
        }, 60);
    };

    const CurrentIcon = ALL_ICONS[currentIconIndex];

    if (!isHydrated) return null;

    return (
        <motion.div
            className="absolute flex items-center justify-center"
            style={{
                x,
                y,
                zIndex,
                left: "50%",
                top: "50%",
            }}
        >
            <motion.div
                style={{
                    opacity: iconOpacity,
                    transition: "opacity 0.15s ease-in-out",
                }}
            >
                {isDecrypting ? (
                    <span
                        className="text-[#a3e635] font-mono drop-shadow-[0_0_10px_rgba(163,230,53,0.6)]"
                        style={{ fontSize: size * 1.2 }}
                    >
                        {scrambleChar}
                    </span>
                ) : (
                    <div className="text-[#a3e635] drop-shadow-[0_0_10px_rgba(163,230,53,0.6)]">
                        <CurrentIcon size={size} />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

interface FloatingIconsProps {
    opacity: MotionValue<number>;
    compact?: boolean;
}

export default function FloatingIcons({ opacity, compact = false }: FloatingIconsProps) {
    const orbitConfigs = compact
        ? [
            { orbitRadiusX: 150, orbitRadiusY: 70, orbitSpeed: 24, startAngle: 0, size: 20, orbitRotation: 45, startIconIndex: 0 },
            { orbitRadiusX: 150, orbitRadiusY: 70, orbitSpeed: 24, startAngle: 180, size: 20, orbitRotation: 45, startIconIndex: 1 },
        ]
        : [
            // First orbit - tilted 45 degrees clockwise
            { orbitRadiusX: 240, orbitRadiusY: 100, orbitSpeed: 20, startAngle: 0, size: 28, orbitRotation: 45, startIconIndex: 0 },
            { orbitRadiusX: 240, orbitRadiusY: 100, orbitSpeed: 20, startAngle: 180, size: 26, orbitRotation: 45, startIconIndex: 1 },

            // Second orbit - tilted 45 degrees counter-clockwise
            { orbitRadiusX: 240, orbitRadiusY: 100, orbitSpeed: 25, startAngle: 90, size: 28, orbitRotation: -45, startIconIndex: 2 },
            { orbitRadiusX: 240, orbitRadiusY: 100, orbitSpeed: 25, startAngle: 270, size: 26, orbitRotation: -45, startIconIndex: 3 },
        ];

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ opacity }}
        >
            {orbitConfigs.map((config, index) => (
                <OrbitingIcon key={index} {...config} />
            ))}
        </motion.div>
    );
}
