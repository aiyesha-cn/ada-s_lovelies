'use client';

import React from 'react';
import { NavIcon } from '@/app/icons';
import type { Tab } from '@/lib/dashboardTypes';

export type AppTab = Tab | 'tracker';

interface NavBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const tabs: AppTab[] = ['home', 'vaults', 'tracker', 'activity', 'profile'];

  return (
    <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 pt-3 pb-7 flex justify-between items-center z-40">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="flex-1 flex items-center justify-center"
          >
            <span
              className={`p-2 rounded-full transition-colors ${
                isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              {tab === 'tracker' ? (
                <svg
                  className={`w-5 h-5 ${isSelected ? 'text-[#FF9F1C]' : 'text-slate-400'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="Money tracker"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 15l4-6 3 3 5-8" />
                </svg>
              ) : (
                <NavIcon type={tab as Tab} active={isSelected} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}