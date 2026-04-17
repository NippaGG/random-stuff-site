"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Terminal, FileCode } from "lucide-react";
import DecryptedText from "./DecryptedText";

type CircularNavProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  isStraight?: boolean;
  isMobile?: boolean;
  itemCounts?: Record<string, number>;
};

export default function CircularNav({ activeTab, setActiveTab, tabs, isStraight = false, isMobile = false, itemCounts }: CircularNavProps) {

  const prevIsStraightRef = useRef(isStraight);
  const isLayoutChange = prevIsStraightRef.current !== isStraight;

  useEffect(() => {
    prevIsStraightRef.current = isStraight;
  }, [isStraight]);

  // NEW FLOATING BOTTOM NAVBAR FOR MOBILE (iOS Pill Style)
  if (isMobile) {
    return (
      <AnimatePresence>
        {isStraight && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center justify-around w-[90vw] max-w-[380px] px-2 py-3 bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              const Icon =
                tab.toLowerCase() === "websites" ? Globe :
                  tab.toLowerCase() === "softwares" ? Terminal :
                    FileCode;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center justify-center min-w-[70px] transition-colors duration-300 ${isActive ? "text-[#a3e635]" : "text-white/50 hover:text-white/80"
                    }`}
                >
                  <div className={`relative px-5 py-1.5 rounded-full mb-1 flex items-center justify-center transition-all duration-300 ${isActive ? "bg-[#a3e635]/20" : "bg-transparent"}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide">
                    {tab}
                    {itemCounts && itemCounts[tab] !== undefined && (
                      <span className="ml-1 text-[9px] opacity-60">
                        {itemCounts[tab]}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const getPosition = (tab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    const tabIndex = tabs.indexOf(tab);
    const diff = (tabIndex - currentIndex + tabs.length) % tabs.length;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    return "left";
  };

  const curvedSlots = isMobile
    ? {
      left: { x: "calc(-50% - 110px)", y: 30, scale: 0.82, opacity: 0.4 },
      center: { x: "calc(-50% + 0px)", y: 72, scale: 1.08, opacity: 1 },
      right: { x: "calc(-50% + 110px)", y: 30, scale: 0.82, opacity: 0.4 },
    }
    : {
      left: { x: "calc(-50% - 150px)", y: 40, scale: 0.8, opacity: 0.4 },
      center: { x: "calc(-50% + 0px)", y: 100, scale: 1.2, opacity: 1 },
      right: { x: "calc(-50% + 150px)", y: 40, scale: 0.8, opacity: 0.4 },
    };

  const straightSlots = isMobile
    ? {
      left: { x: "calc(-50% - 125px)", y: 0, scale: 0.9, opacity: 0.6 },
      center: { x: "calc(-50% + 0px)", y: 0, scale: 1.06, opacity: 1 },
      right: { x: "calc(-50% + 125px)", y: 0, scale: 0.9, opacity: 0.6 },
    }
    : {
      left: { x: "calc(-50% - 200px)", y: 0, scale: 0.9, opacity: 0.6 },
      center: { x: "calc(-50% + 0px)", y: 0, scale: 1.1, opacity: 1 },
      right: { x: "calc(-50% + 200px)", y: 0, scale: 0.9, opacity: 0.6 },
    };

  const curvedHeight = isMobile ? "120px" : "150px";
  const curvedMargin = isMobile ? "24px" : "40px";
  const straightHeight = isMobile ? "52px" : "60px";

  const slots = isStraight ? straightSlots : curvedSlots;

  return (
    // FIX: Animated Container Height
    // - Curved: 150px height + 40px margin (Room for the "V" shape)
    // - Straight: 60px height + 0px margin (Tight fit for the bar)
    <motion.div
      animate={{
        height: isStraight ? straightHeight : curvedHeight,
        marginBottom: isStraight ? "0px" : curvedMargin
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-full flex justify-center items-start z-30 pointer-events-none"
    >

      <motion.div
        animate={{
          top: isStraight ? "0px" : isMobile ? "72px" : "100px",
          width: isStraight ? (isMobile ? "240px" : "300px") : (isMobile ? "80px" : "100px")
        }}
        transition={{ duration: isLayoutChange ? 0.5 : 0 }}
        className="absolute left-1/2 -translate-x-1/2 h-[32px] md:h-[40px] bg-[#a3e635] blur-[40px] opacity-20 pointer-events-none"
      />

      {tabs.map((tab) => {
        const pos = getPosition(tab);
        // @ts-ignore
        const slot = slots[pos as keyof typeof slots];
        const isActive = pos === "center";

        return (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            initial={false}
            animate={{
              x: slot.x,
              y: slot.y,
              scale: slot.scale,
              opacity: slot.opacity,
              zIndex: isActive ? 100 : 0,
              color: isActive ? "#a3e635" : "#ffffff",
              textShadow: isActive ? "0px 0px 20px rgba(163, 230, 53, 0.8)" : "none",
            }}
            transition={{
              duration: isLayoutChange ? 0.5 : 0,
              ease: "easeInOut"
            }}
            style={{ left: "50%" }}
            className="absolute top-0 font-bold text-sm md:text-xl tracking-wide px-4 md:px-6 py-1.5 md:py-2 rounded-full cursor-pointer pointer-events-auto whitespace-nowrap"
          >
            <DecryptedText
              text={tab}
              parentTrigger={activeTab}
              speed={30}
              className="relative z-10"
            />
            {isStraight && itemCounts && itemCounts[tab] !== undefined && (
              <DecryptedText
                text={` ${itemCounts[tab]}`}
                parentTrigger={activeTab}
                speed={30}
                className="relative z-10 text-[10px] font-mono opacity-50"
              />
            )}

            <motion.div
              animate={{
                scale: isActive ? 1 : 0,
                opacity: isActive ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#a3e635] rounded-full"
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
