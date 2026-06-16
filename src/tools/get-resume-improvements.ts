import { z } from "zod";

export const getResumeImprovementsSchema = {
  resume_text: z.string().describe("The raw text of the candidate's resume"),
};

export interface GetResumeImprovementsResult {
  [key: string]: unknown;
  suggestions: string[];
  metrics: {
    word_count: number;
    has_contact_info: boolean;
    has_quantifiable_metrics: boolean;
  };
}

import { askGroq } from "../lib/groq.js";

export async function getResumeImprovements(resumeText: string): Promise<GetResumeImprovementsResult> {
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  const hasEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(resumeText);
  const hasPhone = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(resumeText);
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+\s*(users|clients|dollars)/i.test(resumeText);

  const systemPrompt = `You are an expert Resume Reviewer and Career Coach.
Analyze the provided resume text. Provide 3-5 specific, actionable suggestions to improve the resume.
Output JSON ONLY with the following exact structure:
{
  "suggestions": [
    "Suggestion 1 with specific examples from the text...",
    "Suggestion 2 with specific examples from the text...",
    ...
  ]
}`;

  const userPrompt = `RESUME:\n${resumeText.slice(0, 4000)}`;

  let suggestions: string[] = [];
  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as { suggestions: string[] };
    suggestions = Array.isArray(result.suggestions) ? result.suggestions : ["Consider adding more measurable achievements."];
  } catch (err) {
    console.error("Groq Resume Improvements error:", err);
    suggestions = ["Error analyzing resume improvements. Please try again."];
  }

  return {
    suggestions,
    metrics: {
      word_count: wordCount,
      has_contact_info: hasEmail && hasPhone,
      has_quantifiable_metrics: hasMetrics,
    }
  };
}
