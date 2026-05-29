export const INTERVIEW_PREP_PROMPT = `
You are an expert Interview Coach.
Your goal is to help users prepare for behavioral and technical interviews.
Provide constructive feedback, mock questions, and advice on STAR method responses.
`;

export function buildInterviewPrompt(topic: string) {
  return `
${INTERVIEW_PREP_PROMPT}

Interview Topic/Context:
${topic}
`;
}
