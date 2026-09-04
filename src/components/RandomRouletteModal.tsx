"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ExternalLink, Github, RotateCw, X, Star } from "lucide-react";
import type { Item } from "@/data/items";
import { playRollSound, playSuccessSound, playFavoriteSound, playClickSound } from "@/lib/sound-fx";

interface RandomRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function RandomRouletteModal({
  isOpen,
  onClose,
  items,
  favorites,
  onToggleFavorite,
}: RandomRouletteModalProps) {
  const [isRolling, setIsRolling] = useState(true);
  const [displayItem, setDisplayItem] = useState<Item | null>(null);
  const [finalItem, setFinalItem] = useState<Item | null>(null);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRoll = React.useCallback(() => {
    if (items.length === 0) return;
    setIsRolling(true);
    setFinalItem(null);

    // Pick target winner
    const target = items[Math.floor(Math.random() * items.length)];

    let speed = 40; // ms
    let elapsed = 0;
    const totalDuration = 1200; // ms

    const tick = () => {
      const randomCandidate = items[Math.floor(Math.random() * items.length)];
      setDisplayItem(randomCandidate);
      playRollSound();

      elapsed += speed;
      // Ease out: slow down in the second half
      if (elapsed > 600) {
        speed += 25;
      }

      if (elapsed < totalDuration) {
        rollIntervalRef.current = setTimeout(tick, speed);
      } else {
        // Land on target!
        setDisplayItem(target);
        setFinalItem(target);
        setIsRolling(false);
        playSuccessSound();
      }
    };

    tick();
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      startRoll();
    } else {
      if (rollIntervalRef.current) {
        clearTimeout(rollIntervalRef.current);
      }
      setIsRolling(false);
    }

    return () => {
      if (rollIntervalRef.current) {
        clearTimeout(rollIntervalRef.current);
      }
    };
  }, [isOpen, startRoll]);

  if (!isOpen) return null;

  const current = finalItem || displayItem || items[0];
  const isFav = current ? favorites.includes(current.id) : false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Random Tool Roulette"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#09090b] border border-[var(--theme-accent-border)] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_var(--theme-accent-glow)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--theme-accent)] animate-pulse" />
            <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
              {isRolling ? "ROULETTE SCANNING..." : "DISCOVERED ITEM"}
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Roll Area */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Ticker / Visual frame */}
          <div
            className={`w-full py-8 px-6 rounded-xl border transition-all duration-200 relative overflow-hidden mb-6 ${
              isRolling
                ? "border-[var(--theme-accent)] bg-black shadow-[inset_0_0_30px_var(--theme-accent-glow)]"
                : "border-white/15 bg-neutral-900/50"
            }`}
          >
            {/* Category tag */}
            <div className="mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[var(--theme-accent)]">
                {current?.category || "Tool"}
              </span>
            </div>

            {/* Title */}
            <h2
              className={`text-2xl sm:text-3xl font-extrabold font-mono text-white mb-3 transition-transform ${
                isRolling ? "scale-105 opacity-90 blur-[0.3px]" : "scale-100 opacity-100"
              }`}
            >
              {current?.title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed max-w-md mx-auto line-clamp-3">
              {current?.description}
            </p>

            {/* Rolling indicator beam */}
            {isRolling && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--theme-accent)] to-transparent animate-pulse" />
            )}
          </div>

          {/* Tags */}
          {!isRolling && current?.tags && current.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mb-6 max-w-sm">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 w-full max-w-md justify-center">
            {current?.website && !isRolling && (
              <a
                href={current.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] text-black font-bold font-mono text-sm text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Visit Site <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {current?.github && !isRolling && (
              <a
                href={current.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="p-2.5 rounded-xl bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors border border-white/10"
                title="GitHub Repo"
              >
                <Github className="w-5 h-5" />
              </a>
            )}

            {!isRolling && current && (
              <button
                onClick={() => {
                  playFavoriteSound();
                  onToggleFavorite(current.id);
                }}
                className={`p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors ${
                  isFav ? "text-yellow-400" : "text-neutral-400"
                }`}
                title="Favorite"
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            )}

            <button
              onClick={() => {
                playClickSound();
                startRoll();
              }}
              disabled={isRolling}
              className="py-2.5 px-4 rounded-xl border border-white/20 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRolling ? "animate-spin" : ""}`} />
              {isRolling ? "Rolling..." : "Roll Again"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
