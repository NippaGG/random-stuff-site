"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { items as staticItems, type Item } from "@/data/items";
import { Terminal, Globe, FileCode, Search, X, ArrowUpRight, Heart, Monitor, Github, ListFilter } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Image from "next/image";
import { scrollToY } from "@/lib/lenis";
import { getVisiblePlatformTags } from "@/lib/platform-tags";
import { searchItems } from "@/lib/item-search";
import ProgressiveLoadSentinel from "./ProgressiveLoadSentinel";

const TABS = ["Softwares", "Websites", "Scripts"] as const;
type TabType = (typeof TABS)[number];
const INITIAL_VISIBLE_ITEMS = 32;
const LOAD_MORE_ITEMS = 24;

const TAB_ICONS: Record<TabType, React.ElementType> = {
    Softwares: Terminal,
    Websites: Globe,
    Scripts: FileCode,
};

export default function MobileContentSection({ initialItems }: { initialItems: Item[] }) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [activeTab, setActiveTab] = useState<TabType>("Softwares");
    const [searchQuery, setSearchQuery] = useState("");
    const [previewItem, setPreviewItem] = useState<Item | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [activeTag, setActiveTag] = useState("all");
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [visibleItemsState, setVisibleItemsState] = useState({
        key: "Softwares-all-",
        count: INITIAL_VISIBLE_ITEMS,
    });
    const { isFavorite, toggleFavorite } = useFavorites();

    const tagOptions = [
        { id: "all", label: "All" },
        { id: "macos", label: "macOS" },
        { id: "windows", label: "Windows" },
        { id: "linux", label: "Linux" },
        { id: "android", label: "Android" },
        { id: "ios", label: "iOS" },
    ];

    const sectionRef = useRef<HTMLDivElement>(null);
    const contentTopRef = useRef<HTMLDivElement>(null);
    const lockPointRef = useRef<number>(0);

    // Lock body scroll when preview/menu/favorites is open
    useEffect(() => {
        if (!previewItem && !isMenuOpen && !showFavorites) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [previewItem, isMenuOpen, showFavorites]);

    const lockedScrollYRef = useRef<number | null>(null);
    const isClampingRef = useRef(false);
    const isLockedRef = useRef(false);

    // Helper: get the absolute top of the content section in the document
    const getSectionTop = () => {
        if (!sectionRef.current) return 0;
        return sectionRef.current.getBoundingClientRect().top + window.scrollY;
    };

    // Scroll lock: enforce lock on scroll events (lighter than a continuous RAF loop)
    useEffect(() => {
        if (!isLocked) {
            isLockedRef.current = false;
            lockedScrollYRef.current = null;
            isClampingRef.current = false;
            return;
        }

        isLockedRef.current = true;
        lockedScrollYRef.current = getSectionTop();
        lockPointRef.current = lockedScrollYRef.current;

        const enforceLock = () => {
            if (!isLockedRef.current) return;
            const lockedY = lockedScrollYRef.current;
            if (lockedY !== null && window.scrollY < lockedY && !isClampingRef.current) {
                isClampingRef.current = true;
                scrollToY(lockedY, { immediate: true });
                requestAnimationFrame(() => {
                    isClampingRef.current = false;
                });
            }
        };

        const onScroll = () => enforceLock();
        const onViewportChange = () => {
            const nextLockPoint = getSectionTop();
            lockPointRef.current = nextLockPoint;
            lockedScrollYRef.current = nextLockPoint;
            enforceLock();
        };

        enforceLock();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onViewportChange);
        window.addEventListener("orientationchange", onViewportChange);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onViewportChange);
            window.removeEventListener("orientationchange", onViewportChange);
            isClampingRef.current = false;
        };
    }, [isLocked]);

    useEffect(() => {
        document.documentElement.dataset.siteLocked = isLocked ? "true" : "false";
        window.dispatchEvent(
            new CustomEvent("site-lock-change", { detail: { locked: isLocked } })
        );
    }, [isLocked]);

    useEffect(() => () => {
        document.documentElement.dataset.siteLocked = "false";
        window.dispatchEvent(
            new CustomEvent("site-lock-change", { detail: { locked: false } })
        );
    }, []);

    // Activate lock when content section header reaches the top of the viewport
    useEffect(() => {
        const updateLockPoint = () => {
            lockPointRef.current = getSectionTop();
            if (isLocked) {
                lockedScrollYRef.current = lockPointRef.current;
            }
        };

        const onScroll = () => {
            if (window.scrollY >= lockPointRef.current && !isLocked) {
                setIsLocked(true);
            }
        };

        updateLockPoint();
        window.addEventListener("resize", updateLockPoint);
        window.addEventListener("orientationchange", updateLockPoint);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("resize", updateLockPoint);
            window.removeEventListener("orientationchange", updateLockPoint);
            window.removeEventListener("scroll", onScroll);
        };
    }, [isLocked]);

    const handleUnlock = () => {
        setIsLocked(false);
        // Wait a frame so lock enforcement settles, then scroll to top
        requestAnimationFrame(() => {
            scrollToY(0);
        });
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

    const favoriteItems = useMemo(
        () => items.filter((item) => isFavorite(item.id)),
        [items, isFavorite]
    );

    const categoryLabel = activeTab === "Softwares"
        ? "Softwares"
        : activeTab === "Websites"
            ? "Websites"
            : "Scripts";

    return (
        <>
            <div ref={sectionRef} id="mobile-content-anchor" className="relative flex min-h-screen w-full flex-col pb-40 bg-black/75 text-slate-100">
                {/* Scroll lock anchor */}
                <div ref={contentTopRef} />

                {/* Header */}
                <div className="flex items-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 sticky top-0 z-[250] border-b border-white/10 justify-between">
                    {/* Left: Animated Hamburger / Close */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="flex size-10 shrink-0 items-center justify-center text-[#bef264] relative"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between items-center">
                            <motion.span
                                animate={isMenuOpen
                                    ? { rotate: 45, y: 9, width: "100%" }
                                    : { rotate: 0, y: 0, width: "100%" }
                                }
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="block h-[2px] w-full bg-[#bef264] rounded-full origin-center"
                            />
                            <motion.span
                                animate={isMenuOpen
                                    ? { opacity: 0, scaleX: 0 }
                                    : { opacity: 1, scaleX: 1 }
                                }
                                transition={{ duration: 0.2 }}
                                className="block h-[2px] w-full bg-[#bef264] rounded-full origin-center"
                            />
                            <motion.span
                                animate={isMenuOpen
                                    ? { rotate: -45, y: -9, width: "100%" }
                                    : { rotate: 0, y: 0, width: "100%" }
                                }
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="block h-[2px] w-full bg-[#bef264] rounded-full origin-center"
                            />
                        </div>
                    </button>

                    {/* Center: Random Stuff - tap to unlock */}
                    <button
                        type="button"
                        onClick={handleUnlock}
                        aria-label={isLocked ? "Unlock the section" : "Scroll to the top"}
                        className={`text-lg font-bold leading-tight tracking-tight flex-1 text-center uppercase transition-colors ${isLocked ? "text-[#bef264]" : "text-slate-100 active:text-[#bef264]"
                            }`}
                    >
                        Random Stuff
                    </button>

                    {/* Right: Cross-fading Favorites / Close */}
                    <button
                        type="button"
                        onClick={() => setShowFavorites(!showFavorites)}
                        aria-label={showFavorites ? "Close favorites" : "Open favorites"}
                        className="flex size-10 shrink-0 items-center justify-center text-[#bef264] relative z-[210]"
                    >
                        <AnimatePresence mode="wait">
                            {showFavorites ? (
                                <motion.div
                                    key="close-icon"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="heart-icon"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Heart className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* Content Section */}
                <div className="px-4 pt-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between gap-3 mb-4 text-xs font-bold leading-tight tracking-[0.2em] uppercase">
                                <h2 className="text-[#bef264]">
                                    {isSearchActive ? "Search results" : categoryLabel}
                                </h2>
                                {isSearchActive && (
                                    <span className="text-white/30 font-mono tracking-normal">
                                        {filteredItems.length} {filteredItems.length === 1 ? "match" : "matches"}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                {filteredItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-4">
                                        <Search className="w-12 h-12" />
                                        <p className="text-base">No results found.</p>
                                    </div>
                                ) : (
                                    visibleItems.map((item) => {
                                        const visibleTags = getVisiblePlatformTags(item);
                                        return (
                                        <motion.div
                                            key={item.id}
                                            onClick={() => setPreviewItem(item)}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mobile-directory-card bg-black/90 border border-white/10 p-2 flex gap-3 items-center hover:border-[#bef264]/50 group text-left w-full cursor-pointer relative overflow-hidden"
                                        >
                                            {/* Image Thumbnail */}
                                            <div className="size-10 shrink-0 bg-slate-800 relative overflow-hidden border border-white/10">
                                                {item.image ? (
                                                    <>
                                                    <span className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-bold font-mono select-none">
                                                        {item.title.charAt(0).toUpperCase()}
                                                    </span>
                                                    <Image
                                                        alt={item.title}
                                                        className="relative z-10 object-cover opacity-60"
                                                        src={item.image}
                                                        fill
                                                        sizes="40px"
                                                    />
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                                        {item.category === "Websites" && <Globe className="w-5 h-5" />}
                                                        {item.category === "Softwares" && <Monitor className="w-5 h-5" />}
                                                        {item.category === "Scripts" && <FileCode className="w-5 h-5" />}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <p className="text-[#bef264] text-sm font-bold truncate">
                                                        {item.title}
                                                    </p>
                                                    {item.isNew && (
                                                        <span className="shrink-0 px-1 py-0 text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm">
                                                            New
                                                        </span>
                                                    )}
                                                    {isSearchActive && (
                                                        <span className="shrink-0 px-1 py-0 text-[8px] font-bold uppercase text-[#bef264]/70 border border-[#bef264]/20 rounded-sm">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-[10px] font-normal truncate">
                                                    {item.description}
                                                </p>
                                                {visibleTags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {visibleTags.slice(0, 3).map(tag => (
                                                            <span key={tag} className="text-[8px] font-bold uppercase text-white/30 bg-white/5 px-1 py-0 rounded-sm">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {visibleTags.length > 3 && (
                                                            <span className="text-[8px] text-white/20">+{visibleTags.length - 3}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Heart/Favorite Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(item.id);
                                                }}
                                                aria-label={isFavorite(item.id) ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                                                aria-pressed={isFavorite(item.id)}
                                                className="p-2 shrink-0 transition-colors"
                                            >
                                                <Heart
                                                    className={`w-4 h-4 transition-colors ${isFavorite(item.id)
                                                        ? "fill-[#bef264] text-[#bef264]"
                                                        : "text-white/30"
                                                        }`}
                                                />
                                            </button>
                                        </motion.div>
                                    )})
                                )}
                                {visibleItemCount < filteredItems.length && (
                                    <ProgressiveLoadSentinel
                                        onVisible={loadMoreItems}
                                        rootMargin="600px 0px"
                                        triggerKey={`${resultSetKey}-${visibleItemCount}`}
                                        className="h-px w-full"
                                    />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Floating Fixed Navigation Area */}
                <AnimatePresence>
                    {isLocked && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-2 z-50 pointer-events-none"
                        >
                            {/* Backdrop Glow & Blur Effect */}
                            <div className="absolute inset-0 bottom-0 pointer-events-none -z-10 bg-gradient-to-t from-[#bef264]/10 to-transparent blur-xl" />

                            <div className="max-w-md mx-auto flex flex-col gap-2 items-center pointer-events-auto relative">
                                {/* Floating Search Bar */}
                                <div className="w-full">
                                    <div className="flex w-full items-stretch bg-[#111111]/80 backdrop-blur-md border border-white/10 h-12 shadow-[0_0_15px_rgba(190,242,100,0.15)]">
                                        <div className="text-[#bef264] flex items-center justify-center pl-4">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <input
                                            className="flex w-full flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-500 text-sm px-4"
                                            placeholder="Search directory..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-label="Search directory"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                aria-label="Clear search"
                                                className="px-3 text-white/40 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}

                                        {/* Sort/Filter Button */}
                                        <div className="relative border-l border-white/10 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                                aria-label="Filter by platform"
                                                aria-expanded={isSortMenuOpen}
                                                className={`px-3 h-full flex items-center justify-center transition-colors ${isSortMenuOpen || activeTag !== "all"
                                                    ? "text-[#bef264] bg-[#bef264]/10"
                                                    : "text-white/40 hover:text-white"
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
                                                        className="absolute bottom-full right-0 mb-3 w-40 bg-[#111111]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-[300] pointer-events-auto"
                                                    >
                                                        <div className="flex flex-col p-1">
                                                            <div className="px-3 py-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] border-b border-white/5 mb-1">
                                                                Filter
                                                            </div>
                                                            {tagOptions.map((tag) => (
                                                                <button
                                                                    type="button"
                                                                    key={tag.id}
                                                                    onClick={() => {
                                                                        setActiveTag(tag.id);
                                                                        setIsSortMenuOpen(false);
                                                                    }}
                                                                    className={`px-3 py-2 text-left text-xs transition-colors ${activeTag === tag.id
                                                                        ? "text-[#bef264] bg-[#bef264]/10"
                                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                                        }`}
                                                                >
                                                                    {tag.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Bottom Navbar */}
                                <div className="flex w-full bg-[#111111]/80 backdrop-blur-lg border border-white/10 p-2 shadow-lg items-center justify-around">
                                    {TABS.map((tab) => {
                                        const Icon = TAB_ICONS[tab];
                                        const isActive = activeTab === tab;
                                        return (
                                            <button
                                                type="button"
                                                key={tab}
                                                onClick={() => {
                                                    setActiveTab(tab);
                                                    setSearchQuery("");
                                                    setActiveTag("all");
                                                }}
                                                className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${isActive ? "text-[#bef264]" : "text-slate-500 hover:text-[#bef264]"
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                                <p className="text-[10px] font-bold tracking-tighter uppercase">
                                                    {tab}
                                                    <span className="ml-0.5 text-[8px] opacity-50">
                                                        {items.filter(i => i.category === tab).length}
                                                    </span>
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── HAMBURGER MENU ──────────────────────────── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="hamburger-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-[280px] max-w-[80vw] h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col z-10 pt-[72px]"
                        >
                            {/* Divider below header area */}
                            <div className="border-b border-white/10" />

                            {/* Menu Links */}
                            <div className="flex flex-col p-4 gap-2">
                                <a
                                    href="https://github.com/NippaGG/random-stuff-site"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 px-4 py-3.5 bg-white/5 border border-white/10 hover:border-[#bef264]/50 transition-colors group"
                                >
                                    <Github className="w-5 h-5 text-[#bef264]" />
                                    <div>
                                        <p className="text-white font-bold text-sm group-hover:text-[#bef264] transition-colors">
                                            GitHub Repo
                                        </p>
                                        <p className="text-slate-500 text-[10px]">
                                            View the source code
                                        </p>
                                    </div>
                                </a>

                                <a
                                    href="https://shocka.site/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 px-4 py-3.5 bg-white/5 border border-white/10 hover:border-[#bef264]/50 transition-colors group"
                                >
                                    <div className="relative w-5 h-5 rounded-sm overflow-hidden">
                                        <Image
                                            src="/icon.png"
                                            alt="Portfolio"
                                            fill
                                            sizes="20px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm group-hover:text-[#bef264] transition-colors">
                                            Portfolio
                                        </p>
                                        <p className="text-slate-500 text-[10px]">
                                            shocka.site
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* Footer in menu */}
                            <div className="mt-auto p-5 border-t border-white/10">
                                <p className="text-slate-600 text-[10px] tracking-widest uppercase">
                                    Made with ❤ by ShockaGG
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── FAVORITES PANEL ────────────────────────── */}
            <AnimatePresence>
                {showFavorites && (
                    <motion.div
                        key="favorites-panel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex justify-end"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFavorites(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-[280px] max-w-[80vw] h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col z-10 pt-[72px]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <h2 className="text-xl font-bold text-[#bef264] flex items-center gap-2">
                                    <Heart className="w-5 h-5 fill-[#bef264]" />
                                    Favorites
                                </h2>
                            </div>

                            {/* Favorites List - Scrollable Area */}
                            <div className="p-4 flex-1 overflow-y-auto">
                                {favoriteItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-4">
                                        <Heart className="w-14 h-14" />
                                        <p className="text-base text-center">No favorites yet.</p>
                                        <p className="text-sm text-center text-white/20 px-2">Tap the heart icon on any item to save it here.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {favoriteItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    setShowFavorites(false);
                                                    setPreviewItem(item);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        setShowFavorites(false);
                                                        setPreviewItem(item);
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                className="bg-black/70 border border-white/10 p-2 flex gap-3 items-center text-left w-full hover:border-[#bef264]/50 transition-colors"
                                            >
                                                <div className="size-10 shrink-0 bg-slate-800 relative overflow-hidden border border-white/10 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-60"
                                                            src={item.image}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <Terminal className="w-4 h-4 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[#bef264] text-sm font-bold truncate">{item.title}</p>
                                                    <p className="text-slate-400 text-[10px] truncate">{item.description}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(item.id);
                                                    }}
                                                    aria-label={`Remove ${item.title} from favorites`}
                                                    className="p-2 shrink-0 relative z-10"
                                                >
                                                    <Heart className="w-4 h-4 fill-[#bef264] text-[#bef264]" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── PREVIEW MODAL ──────────────────────────── */}
            <AnimatePresence>
                {previewItem && (
                    <motion.div
                        key="mobile-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-end justify-center"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewItem(null)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-h-[85vh] bg-[#0a0a0a] border-t border-white/10 overflow-y-auto z-10 rounded-t-2xl"
                        >
                            {/* Drag handle */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 bg-white/20 rounded-full" />
                            </div>

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setPreviewItem(null)}
                                aria-label="Close preview"
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>

                            {/* Image area */}
                            {(previewItem.image) && (
                                <div className="relative w-full h-48 bg-[#111] overflow-hidden flex items-center justify-center">
                                    <motion.div
                                        className="absolute inset-0 opacity-20"
                                        animate={{
                                            background: [
                                                "radial-gradient(circle at 20% 20%, #a3e635 0%, transparent 60%)",
                                                "radial-gradient(circle at 80% 80%, #a3e635 0%, transparent 60%)",
                                                "radial-gradient(circle at 20% 20%, #a3e635 0%, transparent 60%)",
                                            ],
                                        }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    />
                                    <img
                                        src={previewItem.image}
                                        alt={previewItem.title}
                                        className="relative z-10 w-20 h-20 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-5 pb-8">
                                {/* Badge */}
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[#bef264] mb-3 inline-block">
                                    {previewItem.category}
                                </span>

                                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
                                    {previewItem.title}
                                </h2>

                                <p className="text-gray-400 text-sm leading-relaxed mb-4 border-l-2 border-[#a3e635]/30 pl-3">
                                    {previewItem.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {getVisiblePlatformTags(previewItem)
                                        .map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider border border-white/10 bg-white/5 text-white/60"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 w-full">
                                    {previewItem.website && (
                                        <a
                                            href={previewItem.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#bef264] text-black font-bold text-[13px] hover:bg-white transition-colors"
                                        >
                                            Website
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    )}
                                    {previewItem.github && (
                                        <a
                                            href={previewItem.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`max-w-[50%] flex-1 flex items-center justify-center gap-2 px-4 py-3.5 transition-colors border ${previewItem.website 
                                                ? "bg-white/5 border-white/10 text-white hover:bg-white/10 text-[13px]" 
                                                : "bg-[#bef264] border-[#bef264] text-black font-bold hover:bg-white text-[13px]"}`}
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(previewItem.id);
                                        }}
                                        aria-label={isFavorite(previewItem.id) ? `Remove ${previewItem.title} from favorites` : `Add ${previewItem.title} to favorites`}
                                        aria-pressed={isFavorite(previewItem.id)}
                                        className={`px-4 py-3.5 border transition-colors ${isFavorite(previewItem.id)
                                            ? "bg-[#bef264]/20 border-[#bef264]/50 text-[#bef264]"
                                            : "bg-white/5 border-white/10 text-white/70"
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isFavorite(previewItem.id) ? "fill-[#bef264]" : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
