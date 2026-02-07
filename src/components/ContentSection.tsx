"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, LayoutGroup, useTransform } from "framer-motion";
import { items, type Item } from "@/data/items";
import CircularNav from "./CircularNav";
import { Lock, Unlock, X, ArrowUpRight, Globe, Monitor, Terminal, Heart } from "lucide-react";
import { FolderHeartIcon, type FolderHeartIconHandle } from "./FolderHeartIcon";
import DecryptedText from "./DecryptedText";
import { useFavorites } from "@/hooks/useFavorites";

import { twMerge } from "tailwind-merge";

// --- NEW COMPONENT: SCROLL BLUR CARD ---
// Blurs itself as it scrolls up towards the header
const ScrollBlurCard = ({
  item,
  onClick,
  variants,
  isFavorite,
  onToggle,
  disableAnimations = false,
  className,
  isSelected = false,
  onSelect
}: {
  item: Item;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => void;
  variants: any;
  isFavorite: boolean;
  onToggle: (id: number) => void;
  disableAnimations?: boolean;
  className?: string;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}) => {
  const ref = useRef(null);

  // Track this specific card's position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start fading when top is 30vh from top (below header)
    // Finish fading when top is 12vh from top (under header)
    offset: ["start 30vh", "start 12vh"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "8px"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const style = disableAnimations ? {} : { opacity, filter: `blur(${blur})`, scale };

  return (
    <motion.a
      ref={ref}
      href={item.link}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => onClick(event, item)}
      variants={variants}
      style={style}
      className={twMerge("group relative flex justify-between items-start gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors overflow-hidden backdrop-blur-sm cursor-pointer h-full", className)}
    >
      <div className="flex flex-col z-10 pr-12">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#a3e635] transition-colors font-mono">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm font-sans leading-relaxed mb-6">
          {item.description}
        </p>
      </div>


      <div className="flex flex-col gap-2 z-20 absolute bottom-3 right-3">
        {onSelect && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(item.id);
            }}
            className={`p-2 rounded-full transition-colors ${isSelected
              ? "bg-[#a3e635] text-black"
              : "bg-white/10 text-white/40 hover:text-white"}`}
          >
            {isSelected ? (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-black rounded-sm" />
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-current rounded-md" />
            )}
          </button>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle(item.id);
          }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group/btn"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite
              ? "fill-[#a3e635] text-[#a3e635]"
              : "text-white/40 group-hover/btn:text-white"
              }`}
          />
        </button>
      </div>

      {
        item.image && (
          <div className="relative shrink-0 w-12 h-12 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-[#a3e635]/50 transition-colors">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                const target = event.currentTarget;
                target.onerror = null;
                target.src = "/icon.png";
              }}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )
      }

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0" />
    </motion.a >
  );
};

const TABS = ["Softwares", "Websites", "Scripts"] as const;

export default function ContentSection() {
  const sectionRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Websites");
  const [isStraight, setIsStraight] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [activeTag, setActiveTag] = useState("all");
  const [tagMode, setTagMode] = useState<"labels" | "dots">("labels");
  const [dotsAnimate, setDotsAnimate] = useState(false);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [isGridLoading, setIsGridLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedFavs, setSelectedFavs] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const prevIsStraightRef = useRef(isStraight);
  const hintTimeoutRef = useRef<number | null>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef<number | null>(null);
  const isResettingScrollRef = useRef(false);
  const clampRafRef = useRef<number | null>(null);
  const gridLoadingTimeoutRef = useRef<number | null>(null);
  const dotsAnimateTimeoutRef = useRef<number | null>(null);
  const folderHeartRef = useRef<FolderHeartIconHandle>(null);

  const { isFavorite, toggleFavorite, clearFavorites, removeFavorites } = useFavorites();

  const handleSelectFav = (id: number) => {
    setSelectedFavs(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setPreviewItem(items[randomIndex]);
  };

  const handleOpenSelected = () => {
    const selectedItems = items.filter(item => selectedFavs.includes(item.id));
    if (selectedItems.length > 5) {
      if (!confirm(`You are about to open ${selectedItems.length} tabs. Continue?`)) return;
    }
    // Reverse to open in correct order if browser focuses new tabs
    [...selectedItems].reverse().forEach((item, index) => {
      // Small timeout to help with some browser blocking, though not guaranteed
      setTimeout(() => {
        window.open(item.link, '_blank');
      }, index * 100);
    });
  };

  const handleSelectAll = () => {
    const favIds = items.filter(item => isFavorite(item.id)).map(item => item.id);
    if (selectedFavs.length === favIds.length) {
      setSelectedFavs([]); // Deselect all if all are selected
    } else {
      setSelectedFavs(favIds);
    }
  };

  const handleRemove = () => {
    if (selectedFavs.length > 0) {
      if (confirm(`Remove ${selectedFavs.length} items from favorites?`)) {
        removeFavorites(selectedFavs);
        setSelectedFavs([]);
        setIsSelectionMode(false);
      }
    } else {
      if (confirm("Are you sure you want to remove all favorites?")) {
        clearFavorites();
        setSelectedFavs([]);
        setIsSelectionMode(false);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    if (item.category !== activeTab) return false;
    if (activeTag === "all") return true;
    return item.tags.includes(activeTag) || item.tags.includes("all");
  });

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Add hysteresis to prevent flickering
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const lockThreshold = viewportHeight * 2.2; // approx where hero ends
    const unlockThreshold = viewportHeight * 1.8; // give some buffer before unlocking

    if (latest > lockThreshold && !isStraight) {
      setIsStraight(true);
    } else if (latest < unlockThreshold && isStraight) {
      setIsStraight(false);
    }
  });

  useEffect(() => {
    const wasStraight = prevIsStraightRef.current;
    if (!isStraight) {
      setIsLocked(false);
    } else if (!wasStraight && isStraight) {
      setIsLocked(true);
    }
    prevIsStraightRef.current = isStraight;
  }, [isStraight]);

  useEffect(() => {
    if (!isLocked) {
      setShowUnlockHint(false);
      isResettingScrollRef.current = false;
    }
    document.documentElement.dataset.siteLocked = isLocked ? "true" : "false";
    window.dispatchEvent(
      new CustomEvent("site-lock-change", { detail: { locked: isLocked } })
    );
  }, [isLocked]);

  useEffect(() => {
    setTagMode(activeTab === "Websites" ? "dots" : "labels");
  }, [activeTab]);

  useEffect(() => {
    if (dotsAnimateTimeoutRef.current) {
      window.clearTimeout(dotsAnimateTimeoutRef.current);
      dotsAnimateTimeoutRef.current = null;
    }
    if (tagMode === "dots") {
      setDotsAnimate(false);
      dotsAnimateTimeoutRef.current = window.setTimeout(() => {
        setDotsAnimate(true);
      }, 250);
    } else {
      setDotsAnimate(false);
    }
    return () => {
      if (dotsAnimateTimeoutRef.current) {
        window.clearTimeout(dotsAnimateTimeoutRef.current);
        dotsAnimateTimeoutRef.current = null;
      }
    };
  }, [tagMode]);

  useEffect(() => {
    setIsGridLoading(true);
    if (gridLoadingTimeoutRef.current) {
      window.clearTimeout(gridLoadingTimeoutRef.current);
    }
    gridLoadingTimeoutRef.current = window.setTimeout(() => {
      setIsGridLoading(false);
    }, 250);

    return () => {
      if (gridLoadingTimeoutRef.current) {
        window.clearTimeout(gridLoadingTimeoutRef.current);
      }
    };
  }, [activeTab, activeTag]);

  useEffect(() => {
    if (!previewItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [previewItem]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "1") {
        setActiveTab(TABS[0]);
        setActiveTag("all");
      } else if (event.key === "2") {
        setActiveTab(TABS[1]);
        setActiveTag("all");
      } else if (event.key === "3") {
        setActiveTab(TABS[2]);
        setActiveTag("all");
      } else if (event.key === "Escape" && previewItem) {
        setPreviewItem(null);
      } else if ((event.key === "r" || event.key === "R") && !previewItem) {
        handleRandomItem();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewItem]);

  useEffect(() => {
    if (!isLocked) return;

    lockedScrollYRef.current = window.scrollY;
    window.scrollTo({ top: lockedScrollYRef.current });

    const showHint = () => {
      setShowUnlockHint(true);
      if (hintTimeoutRef.current) {
        window.clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = window.setTimeout(() => {
        setShowUnlockHint(false);
      }, 2000);
    };

    const onWheel = (event: WheelEvent) => {
      // Only block intentional upward scrolls, not tiny trackpad inertia movements
      // Threshold of -3 allows small micro-movements while blocking real upward scrolls
      if (event.deltaY < -3) {
        event.preventDefault();
        event.stopPropagation();
        showHint();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      lastTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? null;
      const lastY = lastTouchYRef.current;
      if (currentY !== null && lastY !== null && currentY > lastY) {
        event.preventDefault();
        event.stopPropagation();
        showHint();
      }
      lastTouchYRef.current = currentY;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const isScrollUpKey =
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        (event.key === " " && event.shiftKey);
      if (isScrollUpKey) {
        event.preventDefault();
        event.stopPropagation();
        showHint();
      }
    };

    const clampScroll = () => {
      const lockedY = lockedScrollYRef.current;
      if (lockedY !== null && window.scrollY < lockedY) {
        if (!isResettingScrollRef.current) {
          isResettingScrollRef.current = true;
          window.scrollTo({ top: lockedY });
          showHint();
          window.requestAnimationFrame(() => {
            isResettingScrollRef.current = false;
          });
        }
      }
      clampRafRef.current = window.requestAnimationFrame(clampScroll);
    };
    clampRafRef.current = window.requestAnimationFrame(clampScroll);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      if (hintTimeoutRef.current) {
        window.clearTimeout(hintTimeoutRef.current);
      }
      if (clampRafRef.current !== null) {
        window.cancelAnimationFrame(clampRafRef.current);
        clampRafRef.current = null;
      }
    };
  }, [isLocked]);

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: Item
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setPreviewItem(item);
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  const tagOptions = [
    { id: "all", label: "All" },
    { id: "macos", label: "macOS" },
    { id: "windows", label: "Windows" },
    { id: "linux", label: "Linux" },
  ];

  return (
    <section
      ref={sectionRef}
      className={`min-h-[300vh] w-full relative ${isStraight ? "z-[200]" : "z-20"}`}
    >
      <motion.div
        animate={{
          top: isStraight ? "2vh" : "20vh"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="sticky flex flex-col items-center w-full z-40 top-0 pointer-events-none"
      >
        <div className="pointer-events-auto w-full flex flex-col items-center">
          {/* --- LOCK ICON --- */}
          {/* Only appears when locked (isStraight) */}
          <div className="absolute left-4 md:left-20 top-[30px] -translate-y-1/2 z-40">
            <AnimatePresence>
              {isStraight && (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        if (clampRafRef.current !== null) {
                          window.cancelAnimationFrame(clampRafRef.current);
                          clampRafRef.current = null;
                        }
                        lockedScrollYRef.current = null;
                        setIsLocked(false);
                        window.requestAnimationFrame(() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        });
                      } else {
                        setIsLocked(true);
                      }
                    }}
                    className="p-2 bg-[#a3e635]/10 rounded-full border border-[#a3e635]/20 backdrop-blur-md hover:bg-[#a3e635]/20 transition-colors"
                    aria-pressed={isLocked}
                    aria-label={isLocked ? "Unlock section" : "Lock section"}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-[#a3e635]" />
                    ) : (
                      <Unlock className="w-5 h-5 text-white/90" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showUnlockHint && (
                      <motion.div
                        key="unlock-hint"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50"
                      >
                        <div className="px-4 py-3 rounded-xl bg-black/70 border border-[#a3e635]/30 text-sm text-[#d9f99d] shadow-lg backdrop-blur-md whitespace-nowrap">
                          Unlock the site to scroll up.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>



          {/* --- RIGHT SIDE BUTTONS (Favorites + Lucky) --- */}
          <div className="absolute right-4 md:right-20 top-[30px] -translate-y-1/2 z-40 flex items-center gap-3">
            <AnimatePresence>
              {isStraight && (
                <>
                  <motion.button
                    key="lucky-btn"
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={handleRandomItem}
                    className="group relative px-4 py-1.5 bg-[#a3e635] rounded-full border border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all overflow-hidden"
                    title="I'm Feeling Lucky (Press 'R')"
                  >

                    <span className="text-black font-bold font-mono text-sm uppercase tracking-wide">
                      <DecryptedText
                        text="Random"
                        speed={50}
                        animateOnHover={true}
                        useScrambleOnHover={true}
                        className="relative z-10"
                      />
                    </span>
                  </motion.button>

                  <motion.div
                    key="favorites-btn"
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowFavorites(true)}
                      onMouseEnter={() => folderHeartRef.current?.startAnimation()}
                      onMouseLeave={() => folderHeartRef.current?.stopAnimation()}
                      className="group/folder-heart p-2 bg-[#a3e635]/10 rounded-full border border-[#a3e635]/20 backdrop-blur-md hover:bg-[#a3e635]/20 transition-colors"
                      title="Favorites"
                    >
                      <FolderHeartIcon ref={folderHeartRef} className="w-5 h-5 text-[#a3e635]" />
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <CircularNav
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setActiveTag("all");
            }}
            tabs={[...TABS]}
            isStraight={isStraight}
          />

          <motion.div
            animate={{ height: isStraight ? "40px" : "80px" }}
            transition={{ duration: 0.5 }}
          />

          {/* --- STICKY TAGS --- */}
          <motion.div
            initial={{ opacity: 0, y: -20, pointerEvents: "none" }}
            animate={{
              opacity: isStraight ? 1 : 0,
              y: isStraight ? 0 : -20,
              pointerEvents: isStraight ? "auto" : "none"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full flex justify-center pb-4 pt-2 relative z-50 pointer-events-auto"
          >
            {/* Blur Backdrop for Tags */}


            <div className="relative z-10 px-4">
              <LayoutGroup id="tags">
                <div className="flex flex-wrap items-center justify-center gap-2 min-h-[36px]">
                  {tagOptions.map((tag, index) => {
                    const isActive = activeTag === tag.id;
                    const isDots = tagMode === "dots";

                    return (
                      <motion.button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (!isDots) setActiveTag(tag.id);
                        }}
                        layout
                        transition={{ layout: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }}
                        className={`relative flex items-center justify-center font-mono border text-xs md:text-sm overflow-hidden ${isDots
                          ? "w-2 h-2 p-0 rounded-full border-transparent"
                          : "px-3 py-1.5 rounded-full"
                          } ${isDots
                            ? ""
                            : isActive
                              ? "bg-[#a3e635]/20 border-[#a3e635]/50 text-[#d9f99d]"
                              : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                          }`}
                        aria-hidden={isDots}
                      >
                        <motion.span
                          animate={{ opacity: isDots ? 0 : 1 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="relative"
                        >
                          {tag.label}
                        </motion.span>
                        <motion.span
                          animate={
                            isDots
                              ? { opacity: 1, y: dotsAnimate ? [0, -2, 0] : 0 }
                              : { opacity: 0, y: 0 }
                          }
                          transition={{
                            duration: 2,
                            repeat: isDots && dotsAnimate ? Infinity : 0,
                            delay: index * 0.2,
                            ease: "easeInOut",
                          }}
                          className="absolute flex items-center justify-center"
                        >
                          <span className="block w-1 h-1 rounded-full bg-[#a3e635]" />
                        </motion.span>
                      </motion.button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>
          </motion.div>

        </div>
      </motion.div >

      <div
        className="w-full max-w-6xl px-5 min-h-screen mx-auto relative z-10 -mt-20 pt-[140vh]"
      >
        <AnimatePresence mode="wait">
          {isGridLoading ? (
            <motion.div
              key="grid-skeleton"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={cardVariants}
                  className="relative flex justify-between items-start gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl overflow-hidden backdrop-blur-sm animate-pulse"
                >
                  <div className="flex flex-col gap-3 w-full">
                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/10" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${activeTag}`}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {filteredItems.map((item) => (
                <ScrollBlurCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  variants={cardVariants}
                  isFavorite={isFavorite(item.id)}
                  onToggle={toggleFavorite}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      <AnimatePresence>
        {previewItem && (
          <motion.div
            key="preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Modal Card */}
            <motion.div
              layoutId={`card-${previewItem.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[600px] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(previewItem.id);
                  }}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-md border border-white/5 group/fav"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isFavorite(previewItem.id)
                      ? "fill-[#a3e635] text-[#a3e635]"
                      : "text-white/70 group-hover/fav:text-white"
                      }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full transition-colors backdrop-blur-md border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Left Side: Visual/Image */}
              <div className="relative w-full md:w-5/12 h-48 md:h-auto overflow-hidden bg-[#111] flex items-center justify-center group">
                {/* Animated Background Mesh */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, #a3e635 0%, transparent 60%)",
                      "radial-gradient(circle at 80% 80%, #a3e635 0%, transparent 60%)",
                      "radial-gradient(circle at 20% 80%, #a3e635 0%, transparent 60%)",
                      "radial-gradient(circle at 80% 20%, #a3e635 0%, transparent 60%)",
                      "radial-gradient(circle at 20% 20%, #a3e635 0%, transparent 60%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {previewItem.image ? (
                  <>
                    {/* Blurred background version */}
                    <img
                      src={previewItem.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-150"
                      aria-hidden="true"
                    />
                    {/* Actual Icon */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                      <img
                        src={previewItem.image}
                        alt={previewItem.title}
                        className="w-full h-full object-contain drop-shadow-lg"
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.onerror = null;
                          target.src = "/icon.png";
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {previewItem.category === "Websites" && <Globe className="w-12 h-12 text-white/50" />}
                    {previewItem.category === "Softwares" && <Monitor className="w-12 h-12 text-white/50" />}
                    {previewItem.category === "Scripts" && <Terminal className="w-12 h-12 text-white/50" />}
                  </div>
                )}
              </div>

              {/* Right Side: Content */}
              <div className="relative flex flex-col p-6 md:p-10 w-full md:w-7/12 bg-[#0a0a0a]">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#a3e635] tracking-widest uppercase">
                      {previewItem.category}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4 font-mono leading-tight">
                    {previewItem.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {previewItem.tags
                      .filter((tag) => tag !== "all")
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-white/10 bg-white/5 text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <p className="text-gray-400 leading-relaxed text-sm md:text-lg font-light">
                    {previewItem.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <a
                    href={previewItem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center justify-center w-full px-6 py-4 rounded-xl bg-[#a3e635] text-black font-bold text-lg overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Visit Project <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFavorites && (
          <motion.div
            key="favorites-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFavorites(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
                <h2 className="text-2xl font-bold text-[#a3e635] font-mono flex items-center gap-3">
                  <Heart className="fill-[#a3e635] w-6 h-6" />
                  Favorites
                </h2>
                <div className="flex items-center gap-2">
                  {items.filter(item => isFavorite(item.id)).length > 0 && (
                    <>
                      {isSelectionMode ? (
                        <>
                          <button
                            onClick={handleOpenSelected}
                            disabled={selectedFavs.length === 0}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedFavs.length > 0
                              ? "bg-[#a3e635] text-black border-[#a3e635] hover:bg-[#a3e635]/90"
                              : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                              }`}
                          >
                            Open ({selectedFavs.length})
                          </button>
                          <button
                            onClick={handleSelectAll}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
                          >
                            {/* Simple toggle text */}
                            {items.filter(item => isFavorite(item.id)).length === selectedFavs.length ? "Deselect All" : "Select All"}
                          </button>
                          <button
                            onClick={() => {
                              setIsSelectionMode(false);
                              setSelectedFavs([]);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsSelectionMode(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                        >
                          Select
                        </button>
                      )}

                      {isSelectionMode && (
                        <button
                          onClick={handleRemove}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          {selectedFavs.length > 0 ? `Remove (${selectedFavs.length})` : "Remove All"}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors ml-2"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.filter(item => isFavorite(item.id)).length > 0 ? (
                    items.filter(item => isFavorite(item.id)).map((item) => (
                      <ScrollBlurCard
                        key={item.id}
                        item={item}
                        onClick={(e, i) => {
                          // Only allow selection if isSelectionMode is true
                          if (isSelectionMode) {
                            e.preventDefault();
                            handleSelectFav(item.id);
                          } else {
                            setShowFavorites(false);
                            handleItemClick(e, i);
                          }
                        }}
                        variants={cardVariants}
                        isFavorite={true}
                        onToggle={toggleFavorite}
                        disableAnimations={true}
                        className="h-full"
                        isSelected={selectedFavs.includes(item.id)}
                        onSelect={isSelectionMode ? handleSelectFav : undefined}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30 gap-4">
                      <Heart className="w-16 h-16" />
                      <p className="text-xl font-mono">No favorites yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section >
  );
}
