import { z } from "zod";
import { calculateAtsMatch } from "./calculate-ats-match.js";

export const skillGapAnalysisSchema = {
  resume_text: z.string().describe("The raw text of the candidate's resume"),
  job_text: z.string().describe("The raw text of the job description"),
};

export interface SkillGapAnalysisResult {
  [key: string]: unknown;
  missing_skills: string[];
  learning_roadmap: string[];
}

export async function skillGapAnalysis(resumeText: string, jobText: string): Promise<SkillGapAnalysisResult> {
  const matchResult = await calculateAtsMatch(resumeText, jobText);
  
  const missing = matchResult.missing_keywords;
  const roadmap: string[] = [];

  if (missing.length === 0) {
    roadmap.push("No major skill gaps identified! You seem well-qualified for this role.");
  } else {
    // Generate a basic learning roadmap based on missing keywords
    roadmap.push("Phase 1 (Immediate): Familiarize yourself with the high-level concepts of: " + missing.slice(0, 2).join(", "));
    roadmap.push("Phase 2 (Short-term): Build a small " + (missing[0] || "project") + " side-project to gain practical experience.");
    
    if (missing.length > 2) {
      roadmap.push("Phase 3 (Long-term): Take an online course covering: " + missing.slice(2, 5).join(", "));
    }
  }

  return {
    missing_skills: missing,
    learning_roadmap: roadmap,
  };
}
