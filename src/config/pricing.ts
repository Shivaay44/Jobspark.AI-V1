export type PlanType = 'free' | 'premium';

export interface PlanLimits {
  maxResumeGenerations: number;
  maxChatMessages: number;
  pdfDownload: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxResumeGenerations: 3,
    maxChatMessages: 10,
    pdfDownload: false,
  },
  premium: {
    maxResumeGenerations: Infinity,
    maxChatMessages: Infinity,
    pdfDownload: true,
  },
};
