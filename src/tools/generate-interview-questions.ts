import { z } from "zod";
import { calculateAtsMatch } from "./calculate-ats-match.js";

export const generateInterviewQuestionsSchema = {
  resume_text: z.string().describe("The raw text of the candidate's resume"),
  job_text: z.string().describe("The raw text of the job description"),
};

export interface GenerateInterviewQuestionsResult {
  [key: string]: unknown;
  technical_questions: string[];
  hr_questions: string[];
}

import { askGroq } from "../lib/groq.js";

export async function generateInterviewQuestions(resumeText: string, jobText: string): Promise<GenerateInterviewQuestionsResult> {
  const systemPrompt = `You are an expert Technical Interviewer and HR Recruiter.
Given the candidate's resume and the target job description, generate 3 highly specific technical interview questions and 3 HR/behavioral interview questions. 
The technical questions should probe specific skills mentioned in the job description, especially if the candidate is missing them or claiming them.
Output JSON ONLY with the following exact structure:
{
  "technical_questions": ["question 1", "question 2", "question 3"],
  "hr_questions": ["question 1", "question 2", "question 3"]
}`;

  const userPrompt = `JOB DESCRIPTION:\n${jobText.slice(0, 4000)}\n\nRESUME:\n${resumeText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as GenerateInterviewQuestionsResult;
    return {
      technical_questions: Array.isArray(result.technical_questions) ? result.technical_questions : ["Could you walk me through your technical experience?"],
      hr_questions: Array.isArray(result.hr_questions) ? result.hr_questions : ["Why are you interested in this role?"],
    };
  } catch (err) {
    console.error("Groq Interview Questions error:", err);
    return {
      technical_questions: ["Error generating technical questions."],
      hr_questions: ["Error generating HR questions."],
    };
  }
}
