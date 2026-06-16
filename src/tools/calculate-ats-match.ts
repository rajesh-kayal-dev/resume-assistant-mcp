import { z } from "zod";

export const calculateAtsMatchSchema = {
  resume_text: z.string().describe("The raw parsed text of the candidate's resume"),
  job_text: z.string().describe("The raw text of the job description"),
};

export interface CalculateAtsMatchResult {
  [key: string]: unknown;
  match_score: number;
  missing_keywords: string[];
  matched_keywords: string[];
  job_role: string;
  salary: string;
  experience_required: string;
  recommendation: string;
  suitability_assessment: string;
}

import { askGroq } from "../lib/groq.js";

export async function calculateAtsMatch(resumeText: string, jobText: string): Promise<CalculateAtsMatchResult> {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.
You will be provided with a candidate's resume and a job description. 
Your task is to analyze the keyword match between the two, extract key job details, and provide a brutally honest suitability assessment.
Output JSON ONLY with the following exact structure:
{
  "match_score": <number between 0 and 100>,
  "missing_keywords": ["<keyword1>", "<keyword2>", ...],
  "matched_keywords": ["<keyword1>", "<keyword2>", ...],
  "job_role": "<The exact job title>",
  "salary": "<Salary range if mentioned, otherwise 'Not disclosed'>",
  "experience_required": "<Years of experience required, e.g., '3-5 years', or 'Not specified'>",
  "recommendation": "<Exactly one of: 'Highly Suitable', 'Moderately Suitable', 'Not Suitable'>",
  "suitability_assessment": "<A detailed 2-3 sentence explanation of WHY they are or aren't a fit based on their resume vs the job requirements>"
}
Provide up to 20 missing keywords and 20 matched keywords. Focus on hard skills, technologies, and specific domain expertise.`;

  const userPrompt = `JOB DESCRIPTION:\n${jobText.slice(0, 4000)}\n\nRESUME:\n${resumeText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as CalculateAtsMatchResult;
    return {
      match_score: typeof result.match_score === 'number' ? result.match_score : 50,
      missing_keywords: Array.isArray(result.missing_keywords) ? result.missing_keywords : [],
      matched_keywords: Array.isArray(result.matched_keywords) ? result.matched_keywords : [],
      job_role: result.job_role || "Unknown Role",
      salary: result.salary || "Not disclosed",
      experience_required: result.experience_required || "Not specified",
      recommendation: result.recommendation || "Moderately Suitable",
      suitability_assessment: result.suitability_assessment || "No detailed assessment provided.",
    };
  } catch (err) {
    console.error("Groq ATS Match error:", err);
    return {
      match_score: 0,
      missing_keywords: ["Error analyzing ATS match"],
      matched_keywords: [],
      job_role: "Error",
      salary: "Error",
      experience_required: "Error",
      recommendation: "Error",
      suitability_assessment: "An error occurred while analyzing suitability.",
    };
  }
}
