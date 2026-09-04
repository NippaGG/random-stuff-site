"use client";

import React, { useState } from "react";
import type { Item } from "@/data/items";
import { ChameleonLogo, MagneticButton } from "./studio";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";
import { useFavorites } from "@/hooks/useFavorites";
import { Sparkles, Plus, Github, Menu, X } from "lucide-react";

export default function ClientPageLayout({ items }: { items: Item[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setMobileMenuOpen(false);
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#14334D] font-sans antialiased flex flex-col selection:bg-[#9DF71F] selection:text-[#14334D]">
      {/* Top Global Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F0F2F5]/85 backdrop-blur-md border-b border-[#D6DCE1] px-4 md:px-8 py-3 select-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChameleonLogo size={32} />
            <span className="font-phudu font-bold text-lg md:text-xl text-[#14334D] tracking-tight">
              RANDOM STUFF
            </span>
          </div>

          {/* Desktop Right Quick Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 text-[#007BE5]" />}
              href="/submit"
            >
              Submit Tool
            </MagneticButton>

            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Github className="w-3.5 h-3.5 text-[#14334D]" />}
              href="https://github.com/nipunyatawara-dev/random-stuff-site"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </MagneticButton>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="/submit"
              className="px-3 py-1.5 rounded-full bg-[#14334D] text-white text-xs font-semibold"
            >
              + Submit
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white shadow-xs text-[#14334D]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-[#D6DCE1] flex flex-col gap-2">
            {[
              { id: "all", label: "Explore All Tools" },
              { id: "Websites", label: "Websites" },
              { id: "Softwares", label: "Software" },
              { id: "Scripts", label: "Scripts & CLI" },
              { id: "stacks", label: "Curated Stacks" },
              { id: "favorites", label: `Favorites (${favorites.length})` },
            ].map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => handleSelectCategory(nav.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                  activeCategory === nav.id
                    ? "bg-white text-[#007BE5] shadow-xs"
                    : "text-[#456176]"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Studio Viewport Container */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-3 sm:p-6 flex flex-col items-center">
        {/* Main Rounded Studio Card Canvas */}
        <div className="w-full bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-12 shadow-studio-card border border-white/80 overflow-hidden">
          <HeroSection
            totalItemsCount={items.length}
            onExploreClick={() => {
              const el = document.getElementById("catalog-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          <ContentSection
            initialItems={items}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </main>

      {/* Studio Desk Footer */}
      <Footer />
    </div>
  );
}
