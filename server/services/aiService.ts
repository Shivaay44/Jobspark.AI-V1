import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { buildCareerPrompt, CAREER_COACH_PROMPT } from "../prompts/careerCoachPrompt";
import { buildResumePrompt, RESUME_IMPROVEMENT_PROMPT } from "../prompts/resumePrompt";
import { withTimeout } from "../utils/timeout";
import { ResumeAnalysisSchema } from "../schemas/resumeAnalysisSchema";
import { cleanResumeText } from "../utils/cleanResume";

dotenv.config();

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: {
    text: string;
  }[];
}

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY environment variable. Please make sure GEMINI_API_KEY is configured in Settings > Secrets.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Check standard Google API error properties
  if (error.status === 'UNAVAILABLE' || error.status === 'RESOURCE_EXHAUSTED') {
    return true;
  }
  if (error.code === 503 || error.code === 429) {
    return true;
  }
  
  // Inspect JSON error message or stringified error representation case-insensitively
  const message = (error.message || '').toLowerCase();
  if (
    message.includes('503') ||
    message.includes('429') ||
    message.includes('rate') ||
    message.includes('limit') ||
    message.includes('exceeded') ||
    message.includes('quota') ||
    message.includes('exhausted') ||
    message.includes('unavailable') ||
    message.includes('high demand') ||
    message.includes('temporary') ||
    message.includes('try again')
  ) {
    return true;
  }
  
  try {
    const serialized = JSON.stringify(error).toLowerCase();
    if (
      serialized.includes('503') ||
      serialized.includes('429') ||
      serialized.includes('rate') ||
      serialized.includes('limit') ||
      serialized.includes('exceeded') ||
      serialized.includes('quota') ||
      serialized.includes('exhausted') ||
      serialized.includes('unavailable') ||
      serialized.includes('high demand')
    ) {
      return true;
    }
  } catch (e) {}

  return false;
}

async function executeWithRetryAndFallback<T>(
  action: (model: string) => Promise<T>
): Promise<T> {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;
  const isVercel = !!process.env.VERCEL;

  for (let mIndex = 0; mIndex < models.length; mIndex++) {
    const model = models[mIndex];
    // Reduce retries in Vercel environment to fit under the strict 10s gateway timeout
    const maxRetries = isVercel ? 0 : (mIndex === 0 ? 2 : 1);
    let delay = isVercel ? 200 : 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[AI] Attempting action using model: ${model} (attempt ${attempt + 1}/${maxRetries + 1})`);
        return await action(model);
      } catch (error: any) {
        lastError = error;
        console.error(`[AI] Error on model ${model} (attempt ${attempt + 1}):`, error.message || error);

        if (!isRetryableError(error)) {
          console.log("[AI] Non-retryable error, propagating immediately.");
          throw error;
        }

        if (attempt < maxRetries) {
          console.log(`[AI] Retryable error encountered. Backing off for ${delay}ms before next attempt...`);
          await sleep(delay);
          delay *= 2; // Exponential backoff
        } else {
          console.log(`[AI] Max attempts reached for model ${model}.`);
        }
      }
    }
  }

  throw lastError || new Error("Failed to execute GenAI action with all retryable models.");
}

// STEP 28 — ADD AI RETRY SYSTEM (PROFESSIONAL)
async function generateWithRetry(
  generateFn: () => Promise<any>,
  retries = 2
) {
  let lastError;

  for (
    let i = 0;
    i <= retries;
    i++
  ) {
    try {
      return await generateFn();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function generateCareerResponse(
  message: string,
  history: ChatHistoryItem[] = [],
  systemInstruction?: string
) {
  const client = getAiClient();
  const prompt = buildCareerPrompt(message);
  const isVercel = !!process.env.VERCEL;

  const result = await executeWithRetryAndFallback(async (model) => {
    const chat = client.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction || CAREER_COACH_PROMPT,
        maxOutputTokens: 4096,
        temperature: 0.8,
      },
      history: history,
    });

    return await withTimeout(
      chat.sendMessage({ message: prompt }),
      isVercel ? 8000 : 30000
    );
  });

  let responseText = result.text || "";
  const isResumeDoc = 
    (systemInstruction && (systemInstruction.toLowerCase().includes("markdown") || systemInstruction.toLowerCase().includes("resume"))) ||
    message.toLowerCase().includes("resume") ||
    message.toLowerCase().includes("cv");

  if (isResumeDoc) {
    if (responseText) {
      responseText = cleanResumeText(responseText);
    }
    
    // STEP 5 — DEBUG QUICKLY
    console.log("AI Generated Resume Response:\n", responseText);
    
    // STEP 26 — ADD AI OUTPUT VALIDATION
    if (
      !responseText ||
      responseText.length < 300
    ) {
      throw new Error(
        "Generated resume content is incomplete."
      );
    }

    // STEP 27 — ADD SECTION COMPLETENESS CHECK
    const requiredSections = [
      "summary",
      "experience",
      "skills",
    ];

    for (const section of requiredSections) {
      if (
        !responseText
          .toLowerCase()
          .includes(section)
      ) {
        console.warn(
          `Missing section: ${section}`
        );
      }
    }
  }

  return { text: responseText };
}

export async function generateResumeAnalysis(resumeText: string, jobDescription?: string) {
  const client = getAiClient();
  let prompt = buildResumePrompt(resumeText);
  if (jobDescription) {
    prompt += `\n\nMatch it against this Job Description:\n\n${jobDescription}\n\n`;
  }
  const isVercel = !!process.env.VERCEL;

  const model = {
    generateContent: async (promptText: string) => {
      return await executeWithRetryAndFallback(async (modelName) => {
        return await withTimeout(
          client.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
              systemInstruction: `${RESUME_IMPROVEMENT_PROMPT}\n\nYou are Jobspark.AI. Provide a JSON response with:
              - atsScore (0-100)
              - recruiterImpressionScore (0-100)
              - missingKeywords (array)
              - improvementSuggestions (array)
              - weakSections (array)
              - matchScore (0-100, if JD provided)
              - feedback (string)`,
              responseMimeType: "application/json",
              maxOutputTokens: 4096,
              temperature: 0.8,
            }
          }),
          isVercel ? 8000 : 30000
        );
      });
    }
  };

  const response = await generateWithRetry(
    async () => {
      return await model.generateContent(
        prompt
      );
    }
  );

  const parsed = JSON.parse(response.text || "{}");
  return ResumeAnalysisSchema.parse(parsed);
}

export async function generateImprovedSection(section: string, content: string): Promise<string> {
  const client = getAiClient();
  const prompt = `You are a world-class senior resume editor and career advisor.
Professionally rewrite and improve the following resume ${section} text to make it sound achievement-oriented, metrics-driven, recruiter-attractive, and ATS-optimized.
Maintain truthfulness, improve flow, and correct any grammatical errors.

Original Content:
${content}

Return ONLY the improved text. Do not provide preface, notes, lists, or markdown wrapper blocks. Just raw, polished paragraphs ready to be pasted inside the resume.`;
  const isVercel = !!process.env.VERCEL;

  const result = await executeWithRetryAndFallback(async (modelName) => {
    return await withTimeout(
      client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          maxOutputTokens: 2048,
          temperature: 0.8,
        }
      }),
      isVercel ? 8000 : 30000
    );
  });

  return result.text?.trim() || content;
}


