'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { hasAccount } from '@/lib/auth/storage';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import AddTrustline from '@/components/AddTrustline';
import SavingsDashboard from '@/components/SavingsDashboard';

/* ---------- Pure Inline Decorative Icons ---------- */
function ShieldIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function SparkleStar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2c0 4.2 1.2 7 3.2 9S22 12.8 22 12s-4.8-.8-6.8-2.8S12 2 12 2z" fill="currentColor" />
      <path d="M12 22c0-4.2-1.2-7-3.2-9S2 11.2 2 12s4.8.8 6.8 2.8S12 22 12 22z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const wallet = useWallet();
  const { publicKey, connecting } = wallet;
  const [localRefreshKey, setLocalRefreshKey] = useState(0);

  const refresh = useCallback(() => setLocalRefreshKey((k) => k + 1), []);

// ── Auth gate ──────────────────────────────────────────────
  useEffect(() => {
    if (!hasAccount()) {
      router.replace('/register');
      return;
    }

    if (wallet.initialized || wallet.status === 'ready') {
      if (!wallet.publicKey || !wallet.signerAvailable) {
        router.replace('/login');
      } else {
        setAuthChecked(true);
      }
      return;
    }

    // Safety net: if wallet never finishes hydrating within 3s, don't hang forever
    const timeout = setTimeout(() => {
      if (!wallet.publicKey || !wallet.signerAvailable) {
        router.replace('/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [
    wallet.initialized,
    wallet.status,
    wallet.publicKey,
    wallet.signerAvailable,
    router,
  ]);

  const handleLogout = useCallback(async () => {
    await disconnect();                              // clears 'stella-vault.wallet'
    // clearAccount();                                   // clears the PIN-encrypted account
    // localStorage.removeItem('stella_vault_account');  // clears the auth gate flag
    router.replace('/login');
  }, [disconnect, router]);

  // Don't flash the dashboard while checking auth
  if (!authChecked) return null;

  return (
    <main className="min-h-screen w-full bg-[#FAF8F5] text-slate-800 antialiased selection:bg-[#FF5E00]/10 pb-16">
      <div className="mx-auto max-w-md px-4 py-8">
        
        {/* Core Header Section */}
        <header className="mb-6 flex items-center justify-between gap-4 px-1">
          <div>
            <div className="flex items-center gap-2.5">
              {/* Handled Mascot Replacement */}
              <div className="w-7 h-7 relative shrink-0">
                <Image 
                  src="/stellamascot.png"
                  alt="Stella Mascot"
                  fill
                  priority
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">STELLA Vault</h1>
            </div>
          </div>
          <ConnectWallet {...wallet} />
        </header>

        {/* Empty Wallet State Frame */}
        {!publicKey && !connecting && (
          <div className="mb-5 rounded-[2.2rem] border border-orange-100/30 bg-white/60 backdrop-blur-md py-10 px-6 text-center shadow-xs">
            {/* Mascot Container */}
            <div className="mx-auto mb-4 w-24 h-24 relative">
              <Image 
                src="/stellamascot.png"
                alt="Stella Mascot"
                fill
                priority
                sizes="96px"
                className="object-contain"
              />
            </div>
            <p className="text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wide">
              Authorization Credentials Required
            </p>
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed max-w-xs mx-auto">
              Connect your Freighter hardware or browser layer extension to configure your profile token variables. 
              If needed,{' '}
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#FF5E00] hover:underline"
              >
                Install Freighter Extension
              </a>{' '}
              and switch the runtime to Test Net mode.
            </p>
          </div>
        )}

        {/* On-Chain Pipeline Interaction Gate */}
        {publicKey && (
          <div className="mb-5 flex flex-wrap items-center gap-2 px-1">
            <div className="flex-1 min-w-35">
              <FundAccount publicKey={publicKey} onFunded={refresh} />
            </div>
            <div className="flex-1 min-w-35">
              <AddTrustline publicKey={publicKey} onDone={refresh} />
            </div>
          </div>
        )}

        {/* Stellar Core Performance Interface */}
        <div className="mt-2">
          <SavingsDashboard key={localRefreshKey} wallet={wallet} publicKey={publicKey} />
        </div>

        {/* Hackathon Meta Attributions */}
        <footer className="mt-12 text-center text-[10px] font-black tracking-wider text-slate-400 px-4 uppercase leading-relaxed">
          Built by Team Ada&apos;s Lovelies
          <br />
          <span className="opacity-60 font-medium lowercase tracking-normal">One secure vault and one community at a time.</span>
        </footer>
      </div>
    </main>
  );
}