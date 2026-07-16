'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function ChevronLeftIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function UserIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function BellIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}

function LinkIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );
}

interface SettingsRow {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const rows: SettingsRow[] = [
  {
    label: 'Account',
    description: 'Log out or delete your account',
    icon: <UserIcon className="text-slate-400" />,
    href: '/settings/account',
  },
  {
    label: 'Notifications',
    description: 'Choose what you get alerted about',
    icon: <BellIcon className="text-slate-400" />,
    href: '/settings/notifications',
  },
  {
    label: 'Linked Accounts',
    description: 'Connected wallets and services',
    icon: <LinkIcon className="text-slate-400" />,
    href: '/settings/linked-accounts',
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4">
      {/* Same phone-frame shell as SavingsDashboard: rounded card, fixed
          aspect, scrollable content area, floating on the app background. */}
      <div className="w-full max-w-md min-h-210 bg-[#fffdfb] rounded-[2.5rem] overflow-hidden shadow-xl relative flex flex-col font-sans tracking-tight border border-slate-200/40 text-[#1A1A1A]">
        <div className="flex-1 overflow-y-auto">
          {/* Header — mirrors the dashboard's px-6 pt-7 header rhythm */}
          <div className="px-6 pt-7 pb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="p-1 -ml-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>
            <h1 className="text-xl font-semibold text-[#FF5E00] tracking-tight">Settings</h1>
          </div>

          <div className="mx-4 mt-5 mb-6 bg-white border border-slate-200/60 rounded-2xl divide-y divide-slate-100 shadow-sm shadow-slate-900/5">
            {rows.map((row) => (
              <button
                key={row.href}
                type="button"
                onClick={() => router.push(row.href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer"
              >
                {row.icon}
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-slate-700">{row.label}</span>
                  <span className="block text-xs text-slate-400">{row.description}</span>
                </span>
                <ChevronRightIcon className="text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}