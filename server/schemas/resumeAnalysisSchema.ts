import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  recruiterImpressionScore: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()).default([]),
  improvementSuggestions: z.array(z.string()).default([]),
  weakSections: z.array(z.string()).default([]),
  matchScore: z.number().min(0).max(100).optional(),
  feedback: z.string().default(''),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
