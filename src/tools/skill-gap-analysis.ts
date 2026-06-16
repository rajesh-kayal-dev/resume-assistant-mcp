import { z } from "zod";
import { calculateAtsMatch } from "./calculate-ats-match.js";

export const skillGapAnalysisSchema = {
  resume_text: z.string().describe("The raw text of the candidate's resume"),
  job_text: z.string().describe("The raw text of the job description"),
};

import { askGroq } from "../lib/groq.js";

export interface SkillGapAnalysisResult {
  [key: string]: unknown;
  missing_skills: string[];
  learning_roadmap: string;
}

export async function skillGapAnalysis(resumeText: string, jobText: string): Promise<SkillGapAnalysisResult> {
  const systemPrompt = `You are an expert Career Coach and Technical Mentor.
Identify exactly which key skills from the job description are missing in the candidate's resume.
Then, generate a concise, actionable, step-by-step learning roadmap (with estimated timeframes) to acquire those missing skills.
Output JSON ONLY with the following exact structure:
{
  "missing_skills": ["skill 1", "skill 2"],
  "learning_roadmap": "A paragraph or markdown-formatted string with step-by-step instructions..."
}`;

  const userPrompt = `JOB DESCRIPTION:\n${jobText.slice(0, 4000)}\n\nRESUME:\n${resumeText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as SkillGapAnalysisResult;
    return {
      missing_skills: Array.isArray(result.missing_skills) ? result.missing_skills : [],
      learning_roadmap: typeof result.learning_roadmap === 'string' ? result.learning_roadmap : "No roadmap available.",
    };
  } catch (err) {
    console.error("Groq Skill Gap error:", err);
    return {
      missing_skills: ["Error generating skill gap analysis"],
      learning_roadmap: "Error generating learning roadmap.",
    };
  }
}
