import React, { useState } from 'react';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { toast } from 'sonner';

interface Props {
  allowed: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PremiumGate({
  allowed,
  children,
  fallback,
}: Props) {
  const { upgradeToPro } = usePlan();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      upgradeToPro();
      toast.success('Successfully upgraded to PREMIUM! 🎉 All limits removed!');
      setIsUpgrading(false);
    }, 800);
  };

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 text-center space-y-4 max-w-md mx-auto shadow-xl ring-1 ring-white/10">
        <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
          <Crown className="w-6 h-6 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-30" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Premium Feature
          </h4>
          <p className="text-slate-300 text-sm">
            Upgrade to the Pro tier to instantly bypass download limits, save unlimited resumes, and unlock continuous AI career chats.
          </p>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-500 hover:opacity-90 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
        >
          {isUpgrading ? 'Activating Pro...' : 'Upgrade to Pro - ₹499/mo'}
        </button>
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Secure stripe checkout simulation ● Instant access</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
