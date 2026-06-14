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

export async function generateInterviewQuestions(resumeText: string, jobText: string): Promise<GenerateInterviewQuestionsResult> {
  const matchResult = await calculateAtsMatch(resumeText, jobText);
  
  const techQuestions: string[] = [];
  
  // Generate questions based on matched keywords (to verify experience)
  const matched = matchResult.matched_keywords.slice(0, 3);
  for (const keyword of matched) {
    techQuestions.push(`Your resume indicates experience with ${keyword}. Can you walk me through a specific project where you utilized this?`);
  }

  // Generate questions based on missing keywords (to probe for unlisted experience)
  const missing = matchResult.missing_keywords.slice(0, 2);
  for (const keyword of missing) {
    techQuestions.push(`This role requires strong knowledge of ${keyword}. Can you describe your familiarity with it, even if it's not explicitly on your resume?`);
  }

  // Fallback if no keywords found
  if (techQuestions.length === 0) {
    techQuestions.push("Can you describe a challenging technical problem you solved recently?");
    techQuestions.push("How do you ensure the quality and reliability of your work?");
  }

  const hrQuestions = [
    "Why are you interested in this particular role based on the job description?",
    "Tell me about a time you had to adapt to a significant change in a project's requirements.",
    "Where do you see your career progressing in the next 2-3 years, and how does this role fit that vision?"
  ];

  return {
    technical_questions: techQuestions,
    hr_questions: hrQuestions,
  };
}
