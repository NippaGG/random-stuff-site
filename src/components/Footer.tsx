"use client";

import React from "react";

import DecryptedText from "./DecryptedText";
import { motion } from "framer-motion";
import { Heart, Instagram, Plus } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-8 relative z-50 flex flex-col md:flex-row items-center justify-center gap-6 border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
        <span>Made with</span>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
          className="text-red-500"
        >
          <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
        </motion.span>
        <span>by</span>

        <a
          href="https://shocka.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative text-[#a3e635] font-bold cursor-pointer"
        >
          <span className="relative z-10 group-hover:text-white transition-colors">
            <DecryptedText text="ShockaGG" speed={50} />
          </span>
          <span className="absolute inset-0 bg-[#a3e635] blur-[20px] opacity-0 group-hover:opacity-50 transition-opacity" />
        </a>
      </div>

      <div className="hidden md:block w-1 h-1 bg-white/20 rounded-full" />

      <Link
        href="/submit"
        className="px-4 py-2 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all font-mono text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        <span>Submit a Tool</span>
      </Link>

      <div className="hidden md:block w-1 h-1 bg-white/20 rounded-full" />

      <a
        href="https://www.instagram.com/nipun.is.existing/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center gap-2"
      >
        <Instagram className="w-4 h-4 opacity-70" aria-hidden="true" />
        <span>Instagram</span>
      </a>
    </footer>
  );
}
