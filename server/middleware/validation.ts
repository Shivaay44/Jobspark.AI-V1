import { z } from 'zod';
import { MAX_RESUME_LENGTH } from '../prompts/resumePrompt';

export const chatHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(
      z.object({
        text: z.string(),
      })
    ),
  })
);

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(100000),
  history: chatHistorySchema.optional(),
  systemInstruction: z.string().optional(),
});

export const resumeAnalyzeSchema = z.object({
  resumeText: z.string().min(1).max(MAX_RESUME_LENGTH),
  jobDescription: z.string().optional(),
});
