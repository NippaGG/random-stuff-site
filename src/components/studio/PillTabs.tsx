"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface PillTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface PillTabsProps {
  tabs: PillTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  layoutIdPrefix?: string;
}

export const PillTabs: React.FC<PillTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutIdPrefix = 'pillTab',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1.5 rounded-full bg-[#E8ECEF]/80 backdrop-blur-xs border border-white/60 shadow-inner ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none flex items-center gap-2 ${
              isActive ? 'text-[#14334D]' : 'text-[#456176] hover:text-[#14334D]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}Indicator`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white shadow-studio-button border border-white/80"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#9DF71F]/30 text-[#14334D] font-bold' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
