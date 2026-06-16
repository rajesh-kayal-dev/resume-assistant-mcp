import { z } from "zod";

export const linkedinProfileOptimizerSchema = {
  linkedin_text: z.string().describe("The raw text copied from the candidate's LinkedIn profile"),
};

export interface LinkedinProfileOptimizerResult {
  [key: string]: unknown;
  headline_suggestions: string[];
  summary_suggestions: string[];
  general_tips: string[];
}

import { askGroq } from "../lib/groq.js";

export async function linkedinProfileOptimizer(linkedinText: string, resumeText?: string): Promise<LinkedinProfileOptimizerResult> {
  const isUrl = linkedinText.includes("http") || linkedinText.includes("linkedin.com");
  
  const systemPrompt = `You are an expert LinkedIn Profile Optimizer and Personal Branding Coach.
Review the provided professional background. Generate specific suggestions to create an outstanding LinkedIn profile for better visibility to recruiters.
Output JSON ONLY with the following exact structure:
{
  "headline_suggestions": ["Suggestion 1...", "Suggestion 2..."],
  "summary_suggestions": ["Suggestion 1...", "Suggestion 2..."],
  "general_tips": ["Tip 1...", "Tip 2..."]
}`;

  const userPrompt = isUrl 
    ? `CANDIDATE'S RESUME (Use this to generate their ideal LinkedIn profile since we cannot scrape their URL):\n${resumeText?.slice(0, 4000)}` 
    : `LINKEDIN PROFILE TEXT:\n${linkedinText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as LinkedinProfileOptimizerResult;
    return {
      headline_suggestions: Array.isArray(result.headline_suggestions) ? result.headline_suggestions : [],
      summary_suggestions: Array.isArray(result.summary_suggestions) ? result.summary_suggestions : [],
      general_tips: Array.isArray(result.general_tips) ? result.general_tips : [],
    };
  } catch (err) {
    console.error("Groq LinkedIn Optimizer error:", err);
    return {
      headline_suggestions: ["Error generating headline suggestions"],
      summary_suggestions: ["Error generating summary suggestions"],
      general_tips: ["Error generating general tips"],
    };
  }
}
