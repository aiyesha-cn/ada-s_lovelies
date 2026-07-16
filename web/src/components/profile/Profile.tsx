'use client';

import React, { useState } from 'react';
import Image from 'next/image';
<<<<<<< HEAD
import Level2Verification from './verification/Level2Verification';
import { CheckBadgeIcon, LockIcon, EditIcon, SettingsIcon } from '@/app/icons';
=======
import Level2Verification from '@/components/verification/Level2Verification';
import { CheckBadgeIcon, LockIcon, EditIcon, SettingsIcon, SparkleIcon, ChevronRightIcon, VaultIcon, StarIcon } from '@/app/icons';
>>>>>>> e95df95f74157978b495f13a648c486bade19c62

interface ProfileProps {
  publicKey: string | null;
  phpRate: number;
  purchasingPowerSaved: number;
  copied: boolean;
  onCopyAddress: () => void;
  loading: boolean;
  onRefresh: () => void;
  wallet: {
    status?: string;
    network?: string;
    provider?: string;
    signerAvailable?: boolean;
    error?: string | null;
  };
  username?: string;
  handle?: string;
  vaultsCount?: number;
  points?: number;
  avatarSrc?: string;
  phoneVerified?: boolean;
  phoneNumber?: string;
  identityVerified?: boolean;
  communityTrustUnlocked?: boolean;
  onVerifyIdentity?: () => void;
  onOpenSettings?: () => void;
}

<<<<<<< HEAD
=======
type StepState = 'done' | 'current' | 'locked';

function IdentityStep({
  index,
  state,
  label,
  sublabel,
  isLast,
  rightSlot,
  children,
}: {
  index: number;
  state: StepState;
  label: string;
  sublabel?: string;
  isLast?: boolean;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5 px-4 py-3.5">
      {/* Rail: marker + connecting line */}
      <div className="flex flex-col items-center">
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-normal shrink-0 transition-colors ${
            state === 'done'
              ? 'bg-emerald-400 text-white'
              : state === 'current'
              ? 'bg-[#A0F0F0] text-[#0A4B4E] ring-4 ring-[#E0FBFB]'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          {state === 'done' ? <CheckBadgeIcon className="w-3.5 h-3.5" /> : index}
        </span>
        {!isLast && (
          <span
            className={`w-px flex-1 mt-1.5 min-h-4 ${state === 'done' ? 'bg-emerald-200' : 'bg-slate-100'}`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-medium tracking-tight ${state === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
            {label}
          </span>
          {rightSlot}
        </div>
        {sublabel && (
          <p className={`text-[11px] font-light mt-0.5 ${state === 'locked' ? 'text-slate-300' : 'text-slate-400'}`}>{sublabel}</p>
        )}
        {children}
      </div>
    </div>
  );
}

>>>>>>> e95df95f74157978b495f13a648c486bade19c62
export default function Profile({
  wallet,
  username = 'Starry Voyager',
  handle = 'stella_user_882',
  vaultsCount = 12,
  points = 2450,
  avatarSrc = '/stellamascot.png',
  phoneVerified = true,
  phoneNumber = '+63 917 •• •• 213',
  identityVerified = false,
  communityTrustUnlocked = false,
  onVerifyIdentity,
  onOpenSettings,
}: ProfileProps) {
  const { network } = wallet || {};
<<<<<<< HEAD

  // Controls the Level 2 verification modal. Kept local to Profile since the
  // gate + wizard is self-contained; onVerifyIdentity is still fired so a
  // parent (e.g. to refetch user/points) can react if it needs to.
=======
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
  const [showLevel2, setShowLevel2] = useState(false);

  const handleLevelUpClick = () => {
    setShowLevel2(true);
    onVerifyIdentity?.();
  };

<<<<<<< HEAD
  return (
    <div className="px-6 py-2 space-y-7 animate-fade-in">
          {/* Top bar */}
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-semibold text-[#FF5E00] tracking-tight">Profile</h3>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Open settings"
              className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <SettingsIcon className="w-5 h-5 transition-colors" />
            </button>
          </div>

      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full bg-linear-to-b from-orange-50 to-orange-100 border-4 border-white shadow-md shadow-orange-900/10 overflow-hidden relative">
=======
  const level = phoneVerified ? (identityVerified ? (communityTrustUnlocked ? 3 : 2) : 1) : 0;

  const journeyMessage =
    level >= 3
      ? "You've unlocked every level. Nicely done!"
      : level >= 1
      ? 'Your journey has just begun. Keep going!'
      : 'Verify your phone to get started.';

  return (
    <div className="px-6 py-2 space-y-7 animate-fade-in">
    {/* Top bar */}
    <div className="flex justify-between items-center px-1">
    <h3 className="text-xl font-semibold text-[#FF5E00] tracking-tight">Profile</h3>
      <button
      type="button"
      onClick={onOpenSettings}
      aria-label="Open settings"
      className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-600">
      <SettingsIcon className="w-5 h-5 transition-colors" />
      </button>
    </div>

      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-orange-50/60 overflow-hidden relative">
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
            <Image
              src={avatarSrc}
              alt="Profile avatar"
              fill
              priority
<<<<<<< HEAD
              sizes="80px"
              className="object-contain p-2"
=======
              sizes="96px"
              className="object-contain p-3"
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
            />
          </div>
          <button
            type="button"
            aria-label="Edit avatar"
<<<<<<< HEAD
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#FF5E00] text-white flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-[#e65300] transition-colors"
          >
            <EditIcon />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">{username}</h2>
          <p className="text-xs font-medium text-slate-400">@{handle}</p>
        </div>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 bg-white border border-slate-200/60 rounded-2xl py-2.5 text-center shadow-sm shadow-slate-900/5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Vaults</p>
            <p className="text-base font-semibold text-slate-800 mt-0.5">{vaultsCount}</p>
          </div>
          <div className="flex-1 bg-white border border-slate-200/60 rounded-2xl py-2.5 text-center shadow-sm shadow-slate-900/5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Points</p>
            <p className="text-base font-semibold text-slate-800 mt-0.5">{points.toLocaleString()}</p>
=======
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-[#FF5E00] flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-orange-50 active:scale-90 transition-all"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">{username}</h2>
            {level > 0 && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF5E00] bg-orange-50 rounded-full px-2 py-0.5">
                Lvl {level}
              </span>
            )}
          </div>
          <p className="text-xs font-light text-slate-400">@{handle}</p>
          <p className="text-[11px] font-light text-slate-400 pt-1">{journeyMessage}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white w-full max-w-xs grid grid-cols-2 divide-x divide-slate-100">
          <div className="flex flex-col items-center text-center py-5 px-3">
            <VaultIcon className="w-5 h-5 text-[#FF9F1C]" />
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 mt-2">Vaults</span>
            <p className="text-2xl font-semibold text-slate-800 tracking-tight mt-0.5">{vaultsCount}</p>
            <p className="text-[10px] font-light text-slate-400 mt-0.5">Active vaults</p>
          </div>
          <div className="flex flex-col items-center text-center py-5 px-3">
            <StarIcon className="w-5 h-5 text-[#FF9F1C]" />
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 mt-2">Points</span>
            <p className="text-2xl font-semibold text-slate-800 tracking-tight mt-0.5">{points.toLocaleString()}</p>
            <p className="text-[10px] font-light text-slate-400 mt-0.5">Total points</p>
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
          </div>
        </div>
      </div>

      {/* Progressive identity */}
<<<<<<< HEAD
      <div className="space-y-2.5">
        <div className="px-1">
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Progressive Identity</h3>
          <p className="text-xs font-normal text-slate-400">Verify your account to unlock premium vaults</p>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl divide-y divide-slate-100">
          {/* Level 1 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-300 w-4">1</span>
              <span className="text-sm font-medium text-slate-700">Phone Verified</span>
            </div>
            {phoneVerified && <CheckBadgeIcon className="text-emerald-500 shrink-0" />}
          </div>

          {/* Level 2 */}
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-300 w-4">2</span>
                <span className="text-sm font-medium text-slate-700">Identity Details</span>
              </div>
              {identityVerified && <CheckBadgeIcon className="text-emerald-500 shrink-0" />}
            </div>
            {!identityVerified && (
              <button
                onClick={handleLevelUpClick}
                className="w-full py-2 rounded-xl bg-[#FF5E00] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#e65300] active:scale-95 transition-all cursor-pointer"
              >
                Level Up
              </button>
            )}
          </div>

          {/* Level 3 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-300 w-4">3</span>
              <span className={`text-sm font-medium ${communityTrustUnlocked ? 'text-slate-700' : 'text-slate-400'}`}>Community Trust</span>
            </div>
            {communityTrustUnlocked ? (
              <CheckBadgeIcon className="text-emerald-500 shrink-0" />
            ) : (
              <LockIcon className="text-slate-300 shrink-0" />
            )}
          </div>
=======
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Progressive Identity</h3>
          <p className="text-xs font-light text-slate-400 mt-0.5">Verify your account to unlock premium vaults</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <IdentityStep
            index={1}
            state="done"
            label="Phone Verified"
            sublabel={phoneVerified ? phoneNumber : undefined}
            rightSlot={
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 shrink-0">Verified</span>
            }
          />

          <IdentityStep
            index={2}
            state={identityVerified ? 'done' : 'current'}
            label="Identity Details"
            sublabel={identityVerified ? 'Verified' : 'Government ID + selfie check'}
          >
            {!identityVerified && (
              <button
                onClick={handleLevelUpClick}
                className="mt-2.5 w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-[#FF9F1C]/50 text-[#FF9F1C] text-[11px] font-semibold uppercase tracking-widest hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Level Up
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </IdentityStep>

          <IdentityStep
            index={3}
            state={communityTrustUnlocked ? 'done' : 'locked'}
            label="Community Trust"
            sublabel={communityTrustUnlocked ? 'Unlocked' : 'Unlocks after Level 2'}
            isLast
            rightSlot={
              !communityTrustUnlocked && <LockIcon className="text-slate-300 w-3.5 h-3.5" />
            }
          />
        </div>

        <div className="flex items-center gap-2 bg-orange-50/70 rounded-xl px-4 py-3">
          <SparkleIcon className="w-3.5 h-3.5 text-[#FF9F1C] shrink-0" />
          <p className="text-[11px] font-light text-slate-500">Higher levels unlock bigger vault limits and more features!</p>
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
        </div>
      </div>

      {/* Level 2 verification modal */}
      {showLevel2 && (
        <div
<<<<<<< HEAD
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
=======
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4"
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLevel2(false);
          }}
        >
<<<<<<< HEAD
          <Level2Verification
            currentPoints={points}
            verifiedPhone={phoneNumber}
            onClose={() => setShowLevel2(false)}
            onComplete={() => {
              setShowLevel2(false);
            }}
          />
=======
          <div className="w-full max-w-md transform scale-100 transition-transform">
            <Level2Verification
              currentPoints={points}
              verifiedPhone={phoneNumber}
              onClose={() => setShowLevel2(false)}
              onComplete={() => {
                setShowLevel2(false);
              }}
            />
          </div>
>>>>>>> e95df95f74157978b495f13a648c486bade19c62
        </div>
      )}
    </div>
  );
}