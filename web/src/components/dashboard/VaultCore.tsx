'use client';

import React, { useState } from 'react';

interface VaultCoreProps {
  goalProgress: number; // e.g., 72
  vaultLevel: number;   // e.g., 3
}

export default function VaultCore({ goalProgress, vaultLevel }: VaultCoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG calculations for progress ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  // Mock avatar data representing collaborative vault members
  const members = [
    { id: 1, angle: 45, color: 'bg-blue-400', initial: 'M' },
    { id: 2, angle: 165, color: 'bg-purple-400', initial: 'J' },
    { id: 3, angle: 280, color: 'bg-emerald-400', initial: 'S' },
  ];

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f172a] text-white flex flex-col items-center justify-center animate-fadeIn font-sans tracking-tight">
        {/* Deep space background with subtle stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" 
                 style={{ 
                   top: `${Math.random() * 100}%`, 
                   left: `${Math.random() * 100}%`, 
                   animationDelay: `${Math.random() * 2}s` 
                 }} 
            />
          ))}
        </div>
        
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-12 right-6 px-4 py-2 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          Close Universe
        </button>

        <h2 className="text-2xl font-bold tracking-tight mb-2">Your Vault Universe</h2>
        <p className="text-slate-400 text-sm mb-12">Swipe to explore your active savings goals.</p>

        {/* Central Expanded Node */}
        <div className="relative w-64 h-64 flex items-center justify-center animate-scaleIn">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/50" />
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-[#FF9F1C]" strokeDasharray={2 * Math.PI * 120} strokeDashoffset={(2 * Math.PI * 120) * 0.28} strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-1">Level {vaultLevel}</p>
            <p className="text-[#FF9F1C] font-semibold tracking-wider uppercase text-xs">{goalProgress}% Goal Reached</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full font-sans tracking-tight">
      
      {/* Tap Target Wrapper */}
      <button 
        onClick={() => setIsExpanded(true)}
        className="relative w-64 h-64 rounded-full flex items-center justify-center group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300"
      >
        {/* Soft Background Glow */}
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-orange-300/20 to-[#FF9F1C]/10 blur-2xl group-hover:blur-3xl transition-all" />

        {/* Orbiting Collaborative Avatars */}
        <div className="absolute inset-0 rounded-full animate-[spin_20s_linear_infinite]">
          {members.map((member) => {
            const rad = (member.angle * Math.PI) / 180;
            const x = 50 + 50 * Math.cos(rad);
            const y = 50 + 50 * Math.sin(rad);
            
            return (
              <div 
                key={member.id}
                className={`absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${member.color} text-white text-[10px] font-bold`}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)',
                  animation: 'spin 20s linear infinite reverse' // keeps text upright
                }}
              >
                {member.initial}
              </div>
            );
          })}
        </div>

        {/* Progress Ring with Milestones */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-md">
          {/* Track */}
          <circle cx="128" cy="128" r={radius} stroke="#f1f5f9" strokeWidth="12" fill="none" />
          {/* Progress */}
          <circle 
            cx="128" cy="128" r={radius} 
            stroke="#FF9F1C" strokeWidth="12" fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Milestone Stars distributed along the ring */}
          <g className="text-amber-400" style={{ transformOrigin: '128px 128px', transform: 'rotate(45deg)' }}>
            <path d="M128 40 L131 46 L138 46 L132 50 L134 56 L128 52 L122 56 L124 50 L118 46 L125 46 Z" fill="currentColor" />
          </g>
          <g className="text-slate-300" style={{ transformOrigin: '128px 128px', transform: 'rotate(180deg)' }}>
            <path d="M128 40 L131 46 L138 46 L132 50 L134 56 L128 52 L122 56 L124 50 L118 46 L125 46 Z" fill="currentColor" />
          </g>
        </svg>

        {/* Core Safe / Text */}
        <div className="relative z-10 w-36 h-36 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(255,159,28,0.3)] border border-amber-100 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">⭐ Vault</span>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none mb-1">
            Level {vaultLevel}
          </h3>
          <p className="text-xs font-semibold text-[#FF9F1C]">
            {goalProgress}% Goal
          </p>
        </div>
      </button>
    </div>
  );
}