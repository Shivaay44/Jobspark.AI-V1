import { toast } from 'sonner';
import { ResumeData } from '../types';
import { apiFetch } from './api';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendChatMessage(message: string, history: ChatMessage[] = [], systemInstruction?: string) {
  const promise = apiFetch<{ text: string }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history, systemInstruction }),
  });

  toast.promise(promise, {
    loading: 'Generating AI response...',
    success: 'AI response compiled!',
    error: 'Failed to generate AI response. Please try again.',
  });

  return promise;
}

export async function generateResumeContent(data: ResumeData) {
  const fullName = data.personalInfo?.fullName?.trim() || "Candidate";
  const headline = data.personalInfo?.headline?.trim() || "Full Stack Developer";

  const prompt = `You are a professional resume writer. 

**STRICT FIDELITY RULES** (never break):
- Name: exactly **${fullName}**
- Headline: exactly **${headline}**
- Use ONLY the data below. Do not mix with any other person or previous tests.
- Never add unrelated professions (no surgeon, doctor, etc.).

**ENHANCEMENT RULES**:
- Write a strong 4-6 line professional summary.
- For each experience: create **4-5 strong achievement bullets** using action verbs and metrics where logical.
- Improve projects with 2-3 good bullets each.

**User Data (use only this)**:
${JSON.stringify(data, null, 2)}

Output clean Markdown resume only.`;

  const systemInstruction = `Strict resume writer. Always respect exact name and headline. Enhance content intelligently but stay truthful to provided data. Never hallucinate unrelated details.`;

  const response = await sendChatMessage(prompt, [], systemInstruction);
  let text = response.text;

  // Cleanup any leakage
  text = text.replace(/```[\s\S]*?```/g, '').trim();
  text = text.replace(/"name":|"headline":/gi, '');

  return text;
}

export async function analyzeResume(resumeText: string, jobDescription?: string) {
  const promise = apiFetch<any>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  toast.promise(promise, {
    loading: 'Analyzing resume with AI models...',
    success: 'Deep analysis completed successfully!',
    error: (err) => `Analysis failed: ${err.message || 'Server error'}`,
  });

  return promise;
}

export async function improveSection(section: string, content: string) {
  const promise = apiFetch<{ improved: string }>('/api/improve', {
    method: 'POST',
    body: JSON.stringify({ section, content }),
  });

  toast.promise(promise, {
    loading: 'Generating professionally enhanced text...',
    success: 'Content enhanced successfully!',
    error: 'Failed to enhance content.',
  });

  return promise;
}
