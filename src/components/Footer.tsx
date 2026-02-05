"use client";

import React from "react";
import { motion } from "framer-motion";
import DecryptedText from "./DecryptedText";

export default function Footer() {
  return (
    <footer className="w-full py-8 relative z-50 flex flex-col md:flex-row items-center justify-center gap-6 border-t border-white/10 bg-black/80 backdrop-blur-md">
      
      {/* LEFT: Made with love */}
      <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
        <span>Made with</span>
        <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            className="text-red-500"
        >
            ❤
        </motion.span>
        <span>by</span>
        
        {/* SHOCKAGG LINK */}
        <a 
            href="https://shockagg-portfolio.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative text-[#a3e635] font-bold cursor-pointer"
        >
            <span className="relative z-10 group-hover:text-white transition-colors">
                <DecryptedText text="ShockaGG" speed={50} />
            </span>
            {/* Hover Glow */}
            <span className="absolute inset-0 bg-[#a3e635] blur-[20px] opacity-0 group-hover:opacity-50 transition-opacity" />
        </a>
      </div>

      {/* SEPARATOR (Hidden on mobile) */}
      <div className="hidden md:block w-1 h-1 bg-white/20 rounded-full" />

      {/* RIGHT: Instagram Link */}
      <a 
        href="https://www.instagram.com/nipun.is.existing/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center gap-2"
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-70"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
        <span>Instagram</span>
      </a>

    </footer>
  );
}