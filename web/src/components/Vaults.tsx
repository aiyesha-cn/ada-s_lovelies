'use client';
import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '@/lib/wallet';

interface VaultData {
  id: string;
  name: string;
  description: string | null;
  goalType: string;
  targetAmount: number;
  balance: number;
  status: string;
  vaultType: string;
  ownerPubkey: string;
  createdAt: string;
}

interface VaultsProps {
  publicKey: string | null;
  loading?: boolean;
}

function VaultCard({ vault }: { vault: VaultData }) {
  const progress = vault.targetAmount > 0
    ? Math.min(100, (vault.balance / vault.targetAmount) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800">{vault.name}</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5B4FBF]">
          {vault.vaultType}
        </span>
      </div>
      {vault.description && (
        <p className="text-xs text-slate-400">{vault.description}</p>
      )}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-slate-500">
          <span>{vault.balance.toFixed(2)} / {vault.targetAmount.toFixed(2)} USDC</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#6C5DD3] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        vault.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {vault.status}
      </span>
    </div>
  );
}

export default function Vaults({ publicKey, loading: parentLoading }: VaultsProps) {
  const [owned, setOwned] = useState<VaultData[]>([]);
  const [joined, setJoined] = useState<VaultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setOwned([]);
      setJoined([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/vaults/mine');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed to load vaults');
      setOwned(data.owned ?? []);
      setJoined(data.joined ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load vaults');
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!publicKey) {
    return (
      <div className="mx-4 mt-5 p-6 rounded-3xl bg-white border border-slate-100 text-center">
        <p className="text-xs font-bold text-slate-400">Log in to view your vaults.</p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-5 space-y-6 pb-8">
      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
          <p className="text-[11px] font-bold text-rose-600">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Vaults You Own
        </h2>
        {loading || parentLoading ? (
          <p className="text-xs text-slate-400 font-medium">Loading…</p>
        ) : owned.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">You don&apos;t own any vaults yet.</p>
        ) : (
          <div className="space-y-3">
            {owned.map((v) => <VaultCard key={v.id} vault={v} />)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Vaults You Joined
        </h2>
        {loading || parentLoading ? (
          <p className="text-xs text-slate-400 font-medium">Loading…</p>
        ) : joined.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">You haven&apos;t joined any vaults yet.</p>
        ) : (
          <div className="space-y-3">
            {joined.map((v) => <VaultCard key={v.id} vault={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}