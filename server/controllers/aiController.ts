import { Request, Response } from 'express';
import { generateCareerResponse, generateResumeAnalysis } from '../services/aiService';
import { chatRequestSchema, resumeAnalyzeSchema } from '../middleware/validation';

export const chatWithAI = async (req: Request, res: Response) => {
  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  const { message, history, systemInstruction } = parsed.data;
  const response = await generateCareerResponse(message, history || [], systemInstruction);
  res.json(response);
};

export const analyzeResume = async (req: Request, res: Response) => {
  const parsed = resumeAnalyzeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  const { resumeText, jobDescription } = parsed.data;
  const analysis = await generateResumeAnalysis(resumeText, jobDescription);
  res.json(analysis);
};
