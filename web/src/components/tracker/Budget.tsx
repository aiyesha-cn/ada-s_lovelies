'use client';

import React, { useState } from 'react';
import { useBudgets } from '@/lib/budgets';
import Budgets from '@/components/budgets/Budgets';

interface BudgetProps {
  loading: boolean;
  historyLength: number;
}

export default function Budget({ loading, historyLength }: BudgetProps) {
  const [showBudgets, setShowBudgets] = useState(false);
  const { budgets, spentThisMonth } = useBudgets();
  const overBudgetCount = budgets.filter((b) => spentThisMonth(b.category) > b.limit).length;

  if (loading && historyLength === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-md shadow-slate-900/5 space-y-3">
      <button
        onClick={() => setShowBudgets((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" d="M3 10h18" />
          </svg>
          Budgets
          {overBudgetCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 normal-case font-bold tracking-normal">
              {overBudgetCount} over
            </span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-300 transition-transform ${showBudgets ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showBudgets && (
        <div className="pt-1 animate-fadeIn">
          <Budgets />
        </div>
      )}
    </div>
  );
}