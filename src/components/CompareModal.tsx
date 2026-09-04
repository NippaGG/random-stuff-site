"use client";

import React, { useState } from "react";
import { X, Scale, Plus, ExternalLink, Github, Trash2, Check, Star } from "lucide-react";
import type { Item } from "@/data/items";
import { playClickSound, playFavoriteSound } from "@/lib/sound-fx";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: Item[];
  initialItems?: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  allItems,
  initialItems = [],
  favorites,
  onToggleFavorite,
}: CompareModalProps) {
  const [selectedItems, setSelectedItems] = useState<Item[]>(() => {
    return initialItems.length > 0 ? initialItems.slice(0, 3) : allItems.slice(0, 2);
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    playClickSound();
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = (item: Item) => {
    playClickSound();
    if (selectedItems.length >= 3) return;
    if (selectedItems.some((i) => i.id === item.id)) return;
    setSelectedItems((prev) => [...prev, item]);
    setIsAdding(false);
    setSearchQuery("");
  };

  const availableToAdd = allItems
    .filter((item) => !selectedItems.some((s) => s.id === item.id))
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    })
    .slice(0, 10);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare Tools"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#09090b] border border-[var(--theme-accent-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--theme-accent-bg)] border border-[var(--theme-accent-border)]">
              <Scale className="w-5 h-5 text-[var(--theme-accent)]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                TOOL COMPARISON MATRIX
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-normal">
                  {selectedItems.length}/3 tools
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Compare architecture, platforms, and metadata side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {selectedItems.length === 0 ? (
            <div className="py-20 text-center font-mono">
              <p className="text-neutral-400 mb-4">No tools selected for comparison.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Tools to Compare
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedItems.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-white/10 bg-neutral-900/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between relative group hover:border-[var(--theme-accent-border)] transition-colors"
                  >
                    {/* Top controls */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            playFavoriteSound();
                            onToggleFavorite(item.id);
                          }}
                          className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                            isFav ? "text-yellow-400" : "text-neutral-500"
                          }`}
                          title="Favorite"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white font-mono mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Meta Spec Table */}
                    <div className="space-y-3 font-mono text-xs border-t border-white/5 pt-3 mb-4 flex-1">
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase mb-1">
                          Platforms &amp; Tags
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-300 text-[10px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.topics && item.topics.length > 0 && (
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase mb-1">
                            Topics
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.topics.map((top) => (
                              <span
                                key={top}
                                className="px-1.5 py-0.5 rounded bg-[var(--theme-accent-bg)] border border-[var(--theme-accent-border)] text-[var(--theme-accent)] text-[10px]"
                              >
                                {top}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg bg-[var(--theme-accent)] text-black font-bold font-mono text-xs text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                        >
                          Visit <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.github && (
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors border border-white/10"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add slot placeholder if less than 3 */}
              {selectedItems.length < 3 && (
                <div
                  onClick={() => setIsAdding(true)}
                  className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-bg)] transition-all min-h-[280px]"
                >
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 mb-3 group-hover:text-[var(--theme-accent)]">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white font-mono">
                    Add Tool to Compare
                  </span>
                  <span className="text-xs text-neutral-500 font-mono mt-1">
                    Slot {selectedItems.length + 1} of 3
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Add tool drawer */}
          {isAdding && (
            <div className="mt-6 border border-white/10 bg-neutral-950 rounded-xl p-4 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  Select a Tool to Compare
                </h4>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-neutral-500 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog to add..."
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[var(--theme-accent)] mb-3"
                autoFocus
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableToAdd.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAdd(item)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 border border-white/5 cursor-pointer font-mono text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-white">{item.title}</span>
                      <span className="text-neutral-500 ml-2">({item.category})</span>
                    </div>
                    <Check className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-neutral-950/80 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>Side-by-Side Matrix</span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
