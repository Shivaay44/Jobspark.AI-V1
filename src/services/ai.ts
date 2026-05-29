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

  const prompt = `You are a world-class senior resume writer. Create a highly professional, ATS-friendly resume.

Return **ONLY valid JSON**. No markdown block formatting, no extra commentary, no explanations. 

Ensure the output is robust, matching this interface:
{
  "name": "${fullName}",
  "headline": "${headline}",
  "summary": "Professional summary paragraph. 1st person implied, telemetry-free, recruiter-attractive.",
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "Start Date (e.g., Oct 2021)",
      "endDate": "End Date or Present",
      "bullets": [
        "First professional achievement bullet starting with active verb and including result/impact. At least 12-25 words.",
        "Second professional achievement bullet starting with active verb."
      ]
    }
  ],
  "skills": ["TypeScript", "React", "Node.js"],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Title",
      "year": "Graduation Year"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "bullets": ["First project achievement bullet.", "Second project bullet."],
      "technologies": ["React", "Tailwind CSS"]
    }
  ]
}

CRITICAL RULES:
1. DO NOT include candidate name, resume title, section headings, or markdown headings inside the generated string text values.
2. Only generate pure content for each section. For example, "summary" must contain ONLY summary text (no header title), "experience" bullets must contain ONLY the bullet text themselves (no asterisks, lists, etc.).
3. Keep experience bullets professional and achievement-oriented (Action Verb + Responsibility + Result + Impact). Each bullet must contain at least 12-20 words.
4. If some lists in user data are empty, professionally expand them based on target role or keep them aligned with target profile.

User Data:
${JSON.stringify(data, null, 2)}`;

  const systemInstruction = `Always output clean, professional structured JSON only. Never output Markdown prose or explanations. Follow the exact JSON schema requested.`;

  const response = await sendChatMessage(prompt, [], systemInstruction);
  return response.text;
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
