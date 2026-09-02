"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useMotionTemplate } from "framer-motion";
import { items as staticItems, type Item, CATEGORY_COLORS } from "@/data/items";
import CircularNav from "./CircularNav";
import { Lock, Unlock, X, ArrowUpRight, Globe, Monitor, Terminal, Heart, Search, ListFilter } from "lucide-react";
import { FolderHeartIcon, type FolderHeartIconHandle } from "./FolderHeartIcon";
import DecryptedText from "./DecryptedText";
import { useFavorites } from "@/hooks/useFavorites";
import { scrollToY } from "@/lib/lenis";
import { getVisiblePlatformTags } from "@/lib/platform-tags";
import { searchItems } from "@/lib/item-search";
import ProgressiveLoadSentinel from "./ProgressiveLoadSentinel";

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
  onSelect,
  showCategory = false,
}: {
  item: Item;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => void;
  variants: any;
  isFavorite: boolean;
  onToggle: (id: string) => void;
  disableAnimations?: boolean;
  className?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showCategory?: boolean;
}) => {
  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Websites;
  const visibleTags = getVisiblePlatformTags(item);

  return (
    <motion.a
      href={item.website || item.github}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => onClick(event, item)}
      variants={disableAnimations ? undefined : variants}
      className={twMerge(
        "directory-card group relative flex justify-between items-start gap-3 md:gap-4 bg-[#111111]/95 border border-white/10 p-5 md:p-6 rounded-none hover:bg-[#181818] transition-colors overflow-hidden cursor-pointer h-full",
        className
      )}
    >
      {/* New badge */}
      {item.isNew && (
        <div className="absolute top-2.5 left-3 z-10">
          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            New
          </span>
        </div>
      )}

      <div className="flex flex-col z-10 pr-12">
        <div className={twMerge("flex flex-wrap items-center gap-2 mb-2", item.isNew && "mt-5")}>
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#a3e635] transition-colors font-mono">
            {item.title}
          </h3>
          {showCategory && (
            <span
              className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm"
              style={{ color: colors.accent, borderColor: colors.accentBorder, backgroundColor: colors.accentBg }}
            >
              {item.category}
            </span>
          )}
        </div>
        <p className="line-clamp-3 text-gray-400 text-sm font-sans leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Platform tag pills */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>


      <div className="flex flex-col gap-2 z-20 absolute bottom-2 md:bottom-3 right-2 md:right-3">
        {onSelect && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(item.id);
            }}
            aria-label={isSelected ? `Deselect ${item.title}` : `Select ${item.title}`}
            aria-pressed={isSelected}
            className={`p-1.5 md:p-2 rounded-full transition-colors ${isSelected
              ? "bg-[#a3e635] text-black"
              : "bg-white/10 text-white/40 hover:text-white"}`}
          >
            {isSelected ? (
              <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-black rounded-sm" />
              </div>
            ) : (
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current rounded-md" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle(item.id);
          }}
          aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
          aria-pressed={isFavorite}
          className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors group/btn"
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isFavorite
              ? "fill-[#a3e635] text-[#a3e635]"
              : "text-white/40 group-hover/btn:text-white"
              }`}
          />
        </button>
      </div>

      {
        item.image && (
          <div className="relative shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-none bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-[#a3e635]/50 transition-colors">
            {/* Letter avatar fallback (visible when img fails) */}
            <span className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-bold font-mono select-none">
              {item.title.charAt(0).toUpperCase()}
            </span>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 48px, 48px"
              className="relative z-10 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )
      }

      {/* Hover shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"
        style={{
          background: `linear-gradient(to right, transparent, ${colors.accentBg}, transparent)`,
        }}
      />

      {/* Category accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${colors.accentBg}`,
        }}
      />
    </motion.a >
  );
};

const TABS = ["Softwares", "Websites", "Scripts"] as const;
const INITIAL_VISIBLE_ITEMS = 36;
const LOAD_MORE_ITEMS = 24;

export default function ContentSection({ initialItems }: { initialItems: Item[] }) {
  const sectionRef = useRef(null);
  const contentGridRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeTab, setActiveTab] = useState("Websites");
  const [isStraight, setIsStraight] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [activeTag, setActiveTag] = useState("all");
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [isGridLoading, setIsGridLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [visibleItemsState, setVisibleItemsState] = useState({
    key: "Websites-all-",
    count: INITIAL_VISIBLE_ITEMS,
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedFavs, setSelectedFavs] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false)
  );

  const prevIsStraightRef = useRef(isStraight);
  const hintTimeoutRef = useRef<number | null>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef<number | null>(null);
  const isResettingScrollRef = useRef(false);
  const clampRafRef = useRef<number | null>(null);
  const gridLoadingTimeoutRef = useRef<number | null>(null);
  const folderHeartRef = useRef<FolderHeartIconHandle>(null);

  const { isFavorite, toggleFavorite, clearFavorites, removeFavorites } = useFavorites();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  const handleSelectFav = (id: string) => {
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
        window.open(item.website || item.github, '_blank');
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

  const isSearchActive = searchQuery.trim().length > 0;
  const filteredItems = useMemo(
    () => searchItems(items, searchQuery, { platformTag: activeTag, browseCategory: activeTab }),
    [items, searchQuery, activeTag, activeTab],
  );
  const resultSetKey = `${activeTab}-${activeTag}-${searchQuery.trim().toLowerCase()}`;
  const visibleItemCount = visibleItemsState.key === resultSetKey
    ? visibleItemsState.count
    : INITIAL_VISIBLE_ITEMS;
  const visibleItems = filteredItems.slice(0, visibleItemCount);

  const loadMoreItems = () => {
    setVisibleItemsState((current) => ({
      key: resultSetKey,
      count: Math.min(
        (current.key === resultSetKey ? current.count : INITIAL_VISIBLE_ITEMS) + LOAD_MORE_ITEMS,
        filteredItems.length,
      ),
    }));
  };

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Add hysteresis to prevent flickering
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    // lockThreshold reduced since tags were removed
    const lockThreshold = viewportHeight * (isMobile ? 1.6 : 1.9); // approx where hero ends
    const unlockThreshold = viewportHeight * (isMobile ? 1.3 : 1.6); // give some buffer before unlocking

    if (latest > lockThreshold && !isStraight) {
      setIsStraight(true);
    } else if (latest < unlockThreshold && isStraight) {
      setIsStraight(false);
    }
  });

  useEffect(() => {
    const wasStraight = prevIsStraightRef.current;
    if (!isStraight || isMobile) {
      setIsLocked(false);
    } else if (!wasStraight && isStraight) {
      setIsLocked(true);
    }
    prevIsStraightRef.current = isStraight;
  }, [isStraight, isMobile]);

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
  }, []);

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
    if (!isLocked || isMobile) return;

    const viewportHeight = window.innerHeight;
    const lockPosition = viewportHeight * (isMobile ? 1.6 : 1.9);
    lockedScrollYRef.current = lockPosition;
    // Removed immediate scrollToY to prevent scroll jumping when lock engages
    // Only lock to prevent scrolling up, don't snap backwards or halt momentum if scrolling down

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
          scrollToY(lockedY, { immediate: true });
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
  }, [isLocked, isMobile]);

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
    { id: "android", label: "Android" },
    { id: "ios", label: "iOS" },
  ];

  return (
    <section
      ref={sectionRef}
      className={`min-h-[250vh] md:min-h-[300vh] w-full relative ${isStraight ? "z-[200]" : "z-20"}`}
    >
      {/* Dissolve Gradient Overlay for tiles (Absolute wrapper prevents layout shift) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {isStraight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sticky top-0 left-0 w-full h-[15vh] md:h-[18vh] bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"
            />
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{
          top: isStraight ? (isMobile ? "1.5vh" : "2vh") : (isMobile ? "16vh" : "20vh")
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="sticky flex flex-col items-center w-full z-40 top-0 pointer-events-none"
      >
        {/* Fixed footprint placeholder matching the original STRAIGHT nav height. 
            This keeps the grid perfectly positioned just below the straightened navbar
            while totally eliminating any layout shift when the nav transitions from curved. */}
        <div className="w-full" style={{ height: isMobile ? "60px" : "70px" }} />
        
        {/* Added 'absolute top-0' so height transitions don't affect document flow layout and shift content tiles */}
        <div className="absolute top-0 pointer-events-auto w-full flex flex-col items-center">
          {/* --- LOCK ICON --- */}
          {/* Only appears when locked (isStraight) */}
          <div className="absolute left-3 md:left-20 top-[20px] -translate-y-1/2 z-40">
            <AnimatePresence>
              {isStraight && !isMobile && (
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
                          scrollToY(0);
                        });
                      } else {
                        setIsLocked(true);
                      }
                    }}
                    // LARGER MOBILE TOUCH BOX PADDING (p-2.5 vs p-2)
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#a3e635]/10 rounded-none border border-[#a3e635]/20 backdrop-blur-md hover:bg-[#a3e635]/20 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all"
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
                        <div className="px-4 py-3 rounded-none bg-black/70 border border-[#a3e635]/30 text-sm text-[#d9f99d] shadow-lg backdrop-blur-md whitespace-nowrap">
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
          <div className="hidden md:flex absolute right-3 md:right-20 top-[20px] -translate-y-1/2 z-40 items-center gap-2 md:gap-3">
            <AnimatePresence>
              {isStraight && !isMobile && (
                <>
                  <motion.button
                    key="lucky-btn"
                    type="button"
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={handleRandomItem}
                    aria-label="Pick a random item"
                    className="group relative flex items-center justify-center h-10 md:h-12 px-4 md:px-5 bg-[#a3e635] rounded-none border border-[#a3e635] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all overflow-hidden"
                    title="Random item (Press 'R')"
                  >

                    <span className="text-black font-bold font-mono text-sm md:text-base uppercase tracking-wide">
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
                      aria-label="Open favorites"
                      // LARGER MOBILE TOUCH BOX PADDING
                      className="group/folder-heart flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#a3e635]/10 rounded-none border border-[#a3e635]/20 backdrop-blur-md hover:bg-[#a3e635]/20 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_#a3e635] transition-all"
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
              setSearchQuery("");
              setActiveTag("all");
              // Scroll to the lock position (where navbar straightens and content begins)
              // This ensures a consistent resting position regardless of current scroll depth
              setTimeout(() => {
                const viewportHeight = window.innerHeight;
                const lockPosition = viewportHeight * (isMobile ? 1.6 : 1.9);
                scrollToY(lockPosition);
              }, 50);
            }}
            tabs={[...TABS]}
            isStraight={isStraight}
            isMobile={isMobile}
            itemCounts={{
              Softwares: items.filter(i => i.category === "Softwares").length,
              Websites: items.filter(i => i.category === "Websites").length,
              Scripts: items.filter(i => i.category === "Scripts").length,
            }}
          />

          <motion.div
            animate={{ height: isStraight ? (isMobile ? "8px" : "10px") : (isMobile ? "40px" : "56px") }}
            transition={{ duration: 0.5 }}
          />

        </div>
      </motion.div >

      <div
        ref={contentGridRef}
        className="w-full max-w-6xl px-4 md:px-5 mx-auto relative z-10 -mt-36 md:-mt-52 pt-[100vh] md:pt-[125vh] flex flex-col min-h-screen"
      >
        <div className="flex-grow">
          {isSearchActive && !isGridLoading && (
            <div className="flex items-center justify-between gap-4 mb-4 text-xs font-mono uppercase tracking-widest">
              <span className="text-[#a3e635]">Search results</span>
              <span className="text-white/40">
                {filteredItems.length} {filteredItems.length === 1 ? "match" : "matches"}
              </span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {isGridLoading ? (
              <motion.div
                key="grid-skeleton"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    variants={cardVariants}
                    className="relative flex justify-between items-start gap-3 md:gap-4 bg-white/5 border border-white/10 p-5 md:p-6 rounded-none overflow-hidden backdrop-blur-sm animate-pulse"
                  >
                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-4 w-2/3 bg-white/10 rounded-none" />
                      <div className="h-3 w-full bg-white/5 rounded-none" />
                      <div className="h-3 w-5/6 bg-white/5 rounded-none" />
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-none bg-white/10 border border-white/10" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={isSearchActive ? "global-search" : `${activeTab}-${activeTag}`}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
              >
                {filteredItems.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30 gap-4">
                    <Search className="w-12 h-12" />
                    <p className="text-lg font-mono">No results found.</p>
                    <button
                      onClick={() => { setSearchQuery(""); setActiveTag("all"); }}
                      className="px-4 py-2 text-sm font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  visibleItems.map((item) => (
                    <ScrollBlurCard
                      key={item.id}
                      item={item}
                      onClick={handleItemClick}
                      variants={cardVariants}
                      isFavorite={isFavorite(item.id)}
                      onToggle={toggleFavorite}
                      showCategory={isSearchActive}
                      disableAnimations={isSearchActive}
                    />
                  ))
                )}
                {visibleItemCount < filteredItems.length && (
                  <ProgressiveLoadSentinel
                    onVisible={loadMoreItems}
                    rootMargin="800px 0px"
                    triggerKey={`${resultSetKey}-${visibleItemCount}`}
                    className="col-span-full h-px w-full"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- FLOATING BOTTOM SEARCH & SORT BAR --- */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isStraight ? 0 : 100, opacity: isStraight ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[190] w-[calc(100%-32px)] max-w-[400px]"
      >
        <div className="relative flex items-center gap-2 p-1.5 md:p-2 bg-black/50 backdrop-blur-xl border border-[#a3e635]/20 shadow-[0_8px_32px_rgba(163,230,53,0.15),0_0_20px_rgba(163,230,53,0.1)]">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center bg-white/5 border border-white/10 overflow-hidden focus-within:border-[#a3e635]/50 transition-colors">
            <Search className="absolute left-3 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search directory"
              onFocus={() => {
                const viewportHeight = window.innerHeight;
                const lockPosition = viewportHeight * (isMobile ? 1.6 : 1.9);
                if (window.scrollY > lockPosition + 50) {
                  scrollToY(lockPosition);
                }
              }}
              className="w-full bg-transparent text-sm text-white placeholder-white/40 pl-9 pr-4 py-2.5 outline-none font-sans"
            />
          </div>

          {/* Sort Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              aria-label="Filter by platform"
              aria-expanded={isSortMenuOpen}
              className={`flex items-center justify-center p-2.5 border transition-all ${isSortMenuOpen || activeTag !== "all"
                ? "bg-[#a3e635]/20 border-[#a3e635]/50 text-[#d9f99d]"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                }`}
            >
              <ListFilter className="w-5 h-5" />
            </button>

            {/* Sort Menu Popup */}
            <AnimatePresence>
              {isSortMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-3 w-48 bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="flex flex-col p-1">
                    <div className="px-3 py-2 text-xs font-mono text-white/40 uppercase tracking-widest border-b border-white/10 mb-1">
                      Filter Tags
                    </div>
                    {tagOptions.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setActiveTag(tag.id);
                          setIsSortMenuOpen(false);
                          setTimeout(() => {
                            const viewportHeight = window.innerHeight;
                            const lockPosition = viewportHeight * (isMobile ? 1.6 : 1.9);
                            scrollToY(lockPosition);
                          }, 50);
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-sans transition-colors ${activeTag === tag.id
                          ? "bg-[#a3e635] text-black font-bold"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {tag.label}
                        {activeTag === tag.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {previewItem && (
          <motion.div
            key="preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-8"
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
              className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <PreviewContent
                item={previewItem}
                onClose={() => setPreviewItem(null)}
                isFavorite={isFavorite(previewItem.id)}
                onToggleFavorite={() => toggleFavorite(previewItem.id)}
              />
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-8"
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
              className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[85vh] z-10"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-6 border-b border-white/10 bg-black/20">
                <h2 className="text-xl md:text-2xl font-bold text-[#a3e635] font-mono flex items-center gap-2 md:gap-3">
                  <Heart className="fill-[#a3e635] w-5 h-5 md:w-6 md:h-6" />
                  Favorites
                </h2>
                <div className="flex items-center flex-wrap justify-end gap-2">
                  {items.filter(item => isFavorite(item.id)).length > 0 && (
                    <>
                      {isSelectionMode ? (
                        <>
                          <button
                            type="button"
                            onClick={handleOpenSelected}
                            disabled={selectedFavs.length === 0}
                            className={`px-2.5 md:px-3 py-1.5 rounded-none text-[11px] md:text-xs font-bold transition-all border ${selectedFavs.length > 0
                              ? "bg-[#a3e635] text-black border-[#a3e635] hover:bg-[#a3e635]/90"
                              : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                              }`}
                          >
                            Open ({selectedFavs.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="px-2.5 md:px-3 py-1.5 rounded-none text-[11px] md:text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
                          >
                            {/* Simple toggle text */}
                            {items.filter(item => isFavorite(item.id)).length === selectedFavs.length ? "Deselect All" : "Select All"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectionMode(false);
                              setSelectedFavs([]);
                            }}
                            className="px-2.5 md:px-3 py-1.5 rounded-none text-[11px] md:text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsSelectionMode(true)}
                          className="px-2.5 md:px-3 py-1.5 rounded-none text-[11px] md:text-xs font-bold bg-white/5 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                        >
                          Select
                        </button>
                      )}

                      {isSelectionMode && (
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="px-2.5 md:px-3 py-1.5 rounded-none text-[11px] md:text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          {selectedFavs.length > 0 ? `Remove (${selectedFavs.length})` : "Remove All"}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowFavorites(false)}
                    aria-label="Close favorites"
                    className="p-1.5 md:p-2 bg-white/5 hover:bg-white/10 rounded-none transition-colors md:ml-2"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                      <Heart className="w-14 h-14 md:w-16 md:h-16" />
                      <p className="text-lg md:text-xl font-mono">No favorites yet.</p>
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

// Simple LRU Cache for the last 2 items
const metadataCache = new Map<string, any>();
const CACHE_LIMIT = 2;

function PreviewContent({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
}: {
  item: Item;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      const primaryUrl = item.github || item.website;
      if (!primaryUrl) {
        if (isMounted) setLoading(false);
        return;
      }

      // 1. Check Cache
      if (metadataCache.has(primaryUrl)) {
        // Move to end (most recently used)
        const data = metadataCache.get(primaryUrl);
        metadataCache.delete(primaryUrl);
        metadataCache.set(primaryUrl, data);

        if (isMounted) {
          setMetadata(data);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(primaryUrl)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {

            // 2. Update Cache
            if (metadataCache.size >= CACHE_LIMIT) {
              // Remove the first item (least recently used)
              const firstKey = metadataCache.keys().next().value;
              if (firstKey) metadataCache.delete(firstKey);
            }
            metadataCache.set(primaryUrl, data);

            setMetadata(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, [item.website, item.github]);

  return (
    <>
      {/* Close Button & Fav Button (Added padding for bigger hit targets on mobile) */}
      <div className="absolute top-4 md:top-4 right-4 md:right-4 z-30 flex items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
          aria-pressed={isFavorite}
          // INCREASED PADDING
          className="p-2.5 md:p-2 bg-black/50 hover:bg-black/70 rounded-none transition-colors backdrop-blur-md border border-white/5 group/fav"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite
              ? "fill-[#a3e635] text-[#a3e635]"
              : "text-white/70 group-hover/fav:text-white"
              }`}
          />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          // INCREASED PADDING
          className="p-2.5 md:p-2 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-none transition-colors backdrop-blur-md border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Left Side: Visual/Image - Changed Mobile Height */}
      <div className="relative w-full md:w-5/12 h-48 md:h-auto bg-[#111] overflow-hidden group flex items-center justify-center p-4 md:p-6">
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

        {/* Background Image (Blurred) */}
        <div className="absolute inset-0 z-0">
          {metadata?.image || item.image ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
              src={metadata?.image || item.image}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black" />
          )}
        </div>

        {/* Main Image Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full aspect-video rounded-none overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg) translateX(-150%)' }} />
                <div className="w-8 h-8 border-2 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full rounded-none overflow-hidden shadow-2xl border border-white/10 bg-black/50 backdrop-blur-sm"
              >
                {metadata?.image || item.image ? (
                  <img
                    src={metadata?.image || item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    {item.category === "Websites" && <Globe className="w-16 h-16" />}
                    {item.category === "Softwares" && <Monitor className="w-16 h-16" />}
                    {item.category === "Scripts" && <Terminal className="w-16 h-16" />}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 md:hidden" />
      </div>

      {/* Right Side: Content */}
      <div className="relative flex flex-col p-5 md:p-8 w-full md:w-7/12 bg-[#0a0a0a] z-10">
        <div className="flex-1 overflow-y-auto pr-0 md:pr-2 custom-scrollbar">

          {/* Header / Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <span className="px-2 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono text-[#a3e635] uppercase tracking-wider">
              {item.category}
            </span>
            {item.github && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-none bg-[#24292e] border border-white/10 text-[10px] md:text-xs font-mono text-white/80">
                GitHub
              </span>
            )}
            {metadata?.stars && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-none bg-[#f1e05a]/10 border border-[#f1e05a]/20 text-[10px] md:text-xs font-mono text-[#f1e05a]">
                ★ {metadata.stars}
              </span>
            )}
            {metadata?.license && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono text-gray-400">
                {metadata.license}
              </span>
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight font-mono leading-tight"
          >
            {item.title}
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-8 flex-grow"
          >
            {/* Extended fetched description */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="desc-skeleton"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mt-4"
                >
                  <div className="h-3 bg-white/5 rounded-none w-full animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-none w-5/6 animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-none w-4/6 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="desc-real"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-4 overflow-hidden"
                >
                  {/* UNIFIED FONT SIZE text-sm */}
                  <p className="text-gray-400 leading-relaxed text-sm font-light border-l-2 border-[#a3e635]/30 pl-3">
                    {metadata?.description || item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {getVisiblePlatformTags(item).map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.05) }}
                  className="px-2.5 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider border border-white/10 bg-white/5 text-white/60"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Primary Button: Website */}
            {item.website && (
              <motion.a
                layout
                key="website-btn"
                href={item.website}
                target="_blank"
                rel="noreferrer"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 group relative flex items-center justify-center px-6 py-3 md:py-4 rounded-none bg-[#a3e635] text-black font-bold text-base md:text-lg overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] whitespace-nowrap order-1"
              >
                <motion.span layout="position" className="relative z-10 flex items-center gap-2">
                  Visit Website <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.a>
            )}

            {/* Secondary Button: GitHub */}
            {item.github && (
              <motion.a
                layout
                key="github-btn"
                href={item.github}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex-1 group flex items-center justify-center px-6 py-3 md:py-4 rounded-none font-medium text-base md:text-lg transition-colors border whitespace-nowrap overflow-hidden order-2 ${item.website
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/10" // Secondary style if website exists
                  : "bg-[#a3e635] text-black border-[#a3e635] hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] font-bold" // Primary style if ONLY GitHub
                  }`}
              >
                <motion.span layout="position" className="flex items-center gap-2">
                  <Terminal className={`w-5 h-5 transition-colors ${item.website ? "text-gray-400 group-hover:text-white" : "text-black"}`} />
                  GitHub
                </motion.span>
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
