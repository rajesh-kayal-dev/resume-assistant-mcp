import { z } from "zod";
import { calculateAtsMatch } from "./calculate-ats-match.js";

export const generateCoverLetterSchema = {
  resume_text: z.string().describe("The raw text of the candidate's resume"),
  job_text: z.string().describe("The raw text of the job description"),
};

export interface GenerateCoverLetterResult {
  [key: string]: unknown;
  cover_letter_template: string;
}

import { askGroq } from "../lib/groq.js";

export async function generateCoverLetter(resumeText: string, jobText: string): Promise<GenerateCoverLetterResult> {
  const systemPrompt = `You are an expert Career Coach and Professional Resume Writer.
Write a highly compelling, personalized cover letter for the candidate based on their resume and the target job description.
The cover letter should be professional, highlight their most relevant achievements, and directly address the requirements of the job.
Output JSON ONLY with the following exact structure:
{
  "cover_letter_template": "The full text of the cover letter..."
}`;

  const userPrompt = `JOB DESCRIPTION:\n${jobText.slice(0, 4000)}\n\nRESUME:\n${resumeText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as GenerateCoverLetterResult;
    return {
      cover_letter_template: typeof result.cover_letter_template === 'string' ? result.cover_letter_template : "Error: Could not generate cover letter.",
    };
  } catch (err) {
    console.error("Groq Cover Letter error:", err);
    return {
      cover_letter_template: "Error generating cover letter. Please try again.",
    };
  }
}
