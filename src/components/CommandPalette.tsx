"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  Tv,
  Boxes,
  Palette,
  CornerDownLeft,
  X,
  ExternalLink,
  Scale,
  Download,
} from "lucide-react";
import type { Item } from "@/data/items";
import { applyTheme, toggleCrt, isCrtEnabled } from "@/lib/theme-manager";
import { playClickSound, playTabSound, toggleSound, isSoundEnabled } from "@/lib/sound-fx";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenRandom: () => void;
  onOpenFavorites: () => void;
  onOpenSandbox: () => void;
  onOpenCompare: () => void;
  onExportFavorites: () => void;
}

interface ActionItem {
  id: string;
  type: "action";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  handler: () => void;
  category: "Actions" | "Themes";
}

export default function CommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onOpenRandom,
  onOpenFavorites,
  onOpenSandbox,
  onOpenCompare,
  onExportFavorites,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: "action-random",
        type: "action",
        title: "Roll Random Tool",
        subtitle: "Pick an unexpected gem from the catalog",
        icon: <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />,
        category: "Actions",
        handler: () => {
          onClose();
          onOpenRandom();
        },
      },
      {
        id: "action-favorites",
        type: "action",
        title: "View Favorites",
        subtitle: "Browse saved tools and bookmarks",
        icon: <Star className="w-4 h-4 text-yellow-400" />,
        category: "Actions",
        handler: () => {
          onClose();
          onOpenFavorites();
        },
      },
      {
        id: "action-sandbox",
        type: "action",
        title: "Launch 2D Physics Gravity Sandbox",
        subtitle: "Drop and fling catalog cards with Matter.js physics",
        icon: <Boxes className="w-4 h-4 text-[var(--theme-accent)]" />,
        category: "Actions",
        handler: () => {
          onClose();
          onOpenSandbox();
        },
      },
      {
        id: "action-compare",
        type: "action",
        title: "Compare Tools Side-by-Side",
        subtitle: "Compare features, stars, and licenses",
        icon: <Scale className="w-4 h-4 text-cyan-400" />,
        category: "Actions",
        handler: () => {
          onClose();
          onOpenCompare();
        },
      },
      {
        id: "action-export",
        type: "action",
        title: "Export Saved Bookmarks",
        subtitle: "Download as Markdown, JSON, or HTML bookmarks",
        icon: <Download className="w-4 h-4 text-emerald-400" />,
        category: "Actions",
        handler: () => {
          onClose();
          onExportFavorites();
        },
      },
      {
        id: "action-crt",
        type: "action",
        title: "Toggle CRT Scanlines",
        subtitle: `Currently ${isCrtEnabled() ? "ON" : "OFF"}`,
        icon: <Tv className="w-4 h-4 text-purple-400" />,
        category: "Actions",
        handler: () => {
          toggleCrt();
          playClickSound();
        },
      },
      {
        id: "action-sound",
        type: "action",
        title: "Toggle Audio Synthesizer FX",
        subtitle: `Currently ${isSoundEnabled() ? "ENABLED" : "MUTED"}`,
        icon: isSoundEnabled() ? (
          <Volume2 className="w-4 h-4 text-[var(--theme-accent)]" />
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-500" />
        ),
        category: "Actions",
        handler: () => {
          toggleSound();
        },
      },
      // Themes
      {
        id: "theme-lime",
        type: "action",
        title: "Phosphor Lime Theme",
        subtitle: "High-contrast cyber green (#a3e635)",
        icon: <Palette className="w-4 h-4 text-lime-400" />,
        category: "Themes",
        handler: () => {
          applyTheme("lime");
          playClickSound();
        },
      },
      {
        id: "theme-amber",
        type: "action",
        title: "Cyber Amber Theme",
        subtitle: "Warm retro monochrome amber (#f59e0b)",
        icon: <Palette className="w-4 h-4 text-amber-500" />,
        category: "Themes",
        handler: () => {
          applyTheme("amber");
          playClickSound();
        },
      },
      {
        id: "theme-emerald",
        type: "action",
        title: "Matrix Emerald Theme",
        subtitle: "Deep terminal phosphorescent green (#10b981)",
        icon: <Palette className="w-4 h-4 text-emerald-500" />,
        category: "Themes",
        handler: () => {
          applyTheme("emerald");
          playClickSound();
        },
      },
      {
        id: "theme-cobalt",
        type: "action",
        title: "Neon Cobalt Theme",
        subtitle: "Electric cyan-blue interface (#38bdf8)",
        icon: <Palette className="w-4 h-4 text-sky-400" />,
        category: "Themes",
        handler: () => {
          applyTheme("cobalt");
          playClickSound();
        },
      },
    ],
    [
      onClose,
      onOpenRandom,
      onOpenFavorites,
      onOpenSandbox,
      onOpenCompare,
      onExportFavorites,
    ]
  );

  // Filter actions and items based on search query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchedActions = actions.filter(
      (a) =>
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    if (q === "") {
      return { actions: matchedActions, items: [] };
    }

    const matchedItems = items
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
        );
      })
      .slice(0, 20);

    return {
      actions: matchedActions,
      items: matchedItems,
    };
  }, [query, actions, items]);

  const totalResults =
    filteredResults.actions.length + filteredResults.items.length;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        playTabSound();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        playTabSound();
        setSelectedIndex(
          (prev) => (prev - 1 + totalResults) % Math.max(1, totalResults)
        );
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        playClickSound();

        if (selectedIndex < filteredResults.actions.length) {
          const action = filteredResults.actions[selectedIndex];
          action.handler();
        } else {
          const itemIndex = selectedIndex - filteredResults.actions.length;
          const item = filteredResults.items[itemIndex];
          if (item) {
            onClose();
            onSelectItem(item);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    selectedIndex,
    totalResults,
    filteredResults,
    onClose,
    onSelectItem,
  ]);

  // Keep active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#09090b] border border-[var(--theme-accent-border)] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_var(--theme-accent-glow)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-[var(--theme-accent)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, tool name, or filter tags..."
            className="w-full bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="text-neutral-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto divide-y divide-white/5 p-2"
        >
          {totalResults === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-mono text-sm">
              No matching tools or commands found.
            </div>
          ) : (
            <>
              {/* Actions Section */}
              {filteredResults.actions.length > 0 && (
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Commands & Settings
                  </div>
                  {filteredResults.actions.map((action, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={action.id}
                        data-index={idx}
                        onClick={() => {
                          playClickSound();
                          action.handler();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-mono ${
                          isSelected
                            ? "bg-[var(--theme-accent-bg)] text-white border border-[var(--theme-accent-border)]"
                            : "text-neutral-300 hover:bg-neutral-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="p-1 rounded bg-neutral-900 border border-white/10 shrink-0">
                            {action.icon}
                          </span>
                          <div className="truncate">
                            <span className="font-medium">{action.title}</span>
                            <span className="ml-2 text-xs text-neutral-500 hidden sm:inline">
                              {action.subtitle}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tools Section */}
              {filteredResults.items.length > 0 && (
                <div className="pt-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex justify-between">
                    <span>Tools & Resources</span>
                    <span>{filteredResults.items.length} results</span>
                  </div>
                  {filteredResults.items.map((item, i) => {
                    const idx = filteredResults.actions.length + i;
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        onClick={() => {
                          playClickSound();
                          onClose();
                          onSelectItem(item);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-mono ${
                          isSelected
                            ? "bg-[var(--theme-accent-bg)] text-white border border-[var(--theme-accent-border)]"
                            : "text-neutral-300 hover:bg-neutral-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)] shrink-0 opacity-70" />
                          <div className="truncate">
                            <span className="font-semibold text-white">
                              {item.title}
                            </span>
                            <span className="ml-2 text-xs text-neutral-400 truncate">
                              {item.description}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-400">
                            {item.category}
                          </span>
                          {isSelected && (
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-t border-white/10 text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-400">
                &uarr;&darr;
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-400">
                &crarr;
              </kbd>{" "}
              Select
            </span>
          </div>
          <span className="text-[var(--theme-accent)]">RANDOM STUFF DOCK</span>
        </div>
      </div>
    </div>
  );
}
