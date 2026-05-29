import { Request, Response, NextFunction } from 'express';
import { generateCareerResponse, generateResumeAnalysis } from '../services/aiService';
import { chatRequestSchema, resumeAnalyzeSchema } from '../middleware/validation';

export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten(),
      });
    }

    const { message, history, systemInstruction } = parsed.data;
    const response = await generateCareerResponse(message, history || [], systemInstruction);
    return res.json(response);
  } catch (error: any) {
    console.error('[aiController] Error in chatWithAI:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating AI response',
    });
  }
};

export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = resumeAnalyzeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten(),
      });
    }

    const { resumeText, jobDescription } = parsed.data;
    const analysis = await generateResumeAnalysis(resumeText, jobDescription);
    return res.json(analysis);
  } catch (error: any) {
    console.error('[aiController] Error in analyzeResume:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while analyzing resume',
    });
  }
};
