"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DecryptedText from "./DecryptedText";

type CircularNavProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  isStraight?: boolean;
};

export default function CircularNav({ activeTab, setActiveTab, tabs, isStraight = false }: CircularNavProps) {
  
  const prevIsStraightRef = useRef(isStraight);
  const isLayoutChange = prevIsStraightRef.current !== isStraight;

  useEffect(() => {
    prevIsStraightRef.current = isStraight;
  }, [isStraight]);

  const getPosition = (tab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    const tabIndex = tabs.indexOf(tab);
    const diff = (tabIndex - currentIndex + tabs.length) % tabs.length;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    return "left";
  };

  const curvedSlots = {
    left:   { x: "calc(-50% - 150px)", y: 40, scale: 0.8, opacity: 0.4 },
    center: { x: "calc(-50% + 0px)",   y: 100, scale: 1.2, opacity: 1 },
    right:  { x: "calc(-50% + 150px)", y: 40, scale: 0.8, opacity: 0.4 },
  };

  const straightSlots = {
    left:   { x: "calc(-50% - 200px)", y: 0, scale: 0.9, opacity: 0.6 },
    center: { x: "calc(-50% + 0px)",   y: 0, scale: 1.1, opacity: 1 },
    right:  { x: "calc(-50% + 200px)", y: 0, scale: 0.9, opacity: 0.6 },
  };

  const slots = isStraight ? straightSlots : curvedSlots;

  return (
    // FIX: Animated Container Height
    // - Curved: 150px height + 40px margin (Room for the "V" shape)
    // - Straight: 60px height + 0px margin (Tight fit for the bar)
    <motion.div 
      animate={{ 
        height: isStraight ? "60px" : "150px",
        marginBottom: isStraight ? "0px" : "40px"
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-full flex justify-center items-start z-30 pointer-events-none"
    >
      
      <motion.div 
        animate={{ 
            top: isStraight ? "0px" : "100px",
            width: isStraight ? "300px" : "100px" 
        }}
        transition={{ duration: isLayoutChange ? 0.5 : 0 }}
        className="absolute left-1/2 -translate-x-1/2 h-[40px] bg-[#a3e635] blur-[40px] opacity-20 pointer-events-none" 
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
            className="absolute top-0 font-bold text-lg md:text-xl tracking-wide px-6 py-2 rounded-full cursor-pointer pointer-events-auto whitespace-nowrap"
          >
            <DecryptedText 
                text={tab} 
                parentTrigger={activeTab} 
                speed={30}
                className="relative z-10"
            />
            
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