import { useState, useEffect } from 'react';
import { PLAN_LIMITS, PlanType } from '../config/pricing';
import { getUsage, UsageData } from '../services/usageService';
import { storage } from '../services/storage';

export function usePlan() {
  const [isPro, setIsPro] = useState(storage.isPro());
  const [usage, setUsage] = useState<UsageData>(getUsage());

  useEffect(() => {
    const handleUpdate = () => {
      setIsPro(storage.isPro());
      setUsage(getUsage());
    };

    window.addEventListener('jobspark_usage_changed', handleUpdate);
    window.addEventListener('jobspark_plan_changed', handleUpdate);
    
    return () => {
      window.removeEventListener('jobspark_usage_changed', handleUpdate);
      window.removeEventListener('jobspark_plan_changed', handleUpdate);
    };
  }, []);

  const isSharedView = typeof window !== 'undefined' && window.location.search.includes('shared=');
  const plan: PlanType = (isPro || isSharedView) ? 'premium' : 'free';
  const limits = PLAN_LIMITS[plan];

  const canGenerateResume = plan === 'premium' || usage.resumeGenerations < limits.maxResumeGenerations;
  const canChat = plan === 'premium' || usage.chatMessages < limits.maxChatMessages;
  const canDownloadPDF = limits.pdfDownload || isSharedView;

  const upgradeToPro = () => {
    storage.upgradeToPro();
    window.dispatchEvent(new Event('jobspark_plan_changed'));
  };

  return {
    plan,
    limits,
    usage,
    canGenerateResume,
    canChat,
    canDownloadPDF,
    upgradeToPro,
  };
}
