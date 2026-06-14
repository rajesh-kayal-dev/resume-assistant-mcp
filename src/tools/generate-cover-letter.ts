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

export async function generateCoverLetter(resumeText: string, jobText: string): Promise<GenerateCoverLetterResult> {
  const matchResult = await calculateAtsMatch(resumeText, jobText);
  
  const matched = matchResult.matched_keywords;
  const missing = matchResult.missing_keywords;

  const match1 = matched[0] || "[Key Skill 1]";
  const match2 = matched[1] || "[Key Skill 2]";
  const match3 = matched[2] || "[Key Skill 3]";
  const missing1 = missing[0] || "[Required Skill]";

  const template = `Dear Hiring Manager,

I am writing to express my strong interest in the open position at your company. With a solid background in ${match1} and ${match2}, I am confident in my ability to contribute effectively to your team from day one.

In my previous roles, I successfully leveraged ${match3} to drive measurable results. My hands-on experience aligns closely with the core requirements outlined in the job description. 

While my resume highlights my proficiency in these areas, I am also a fast learner. I understand this role requires familiarity with ${missing1}, and I am eager to apply my existing foundation to master it quickly.

I would welcome the opportunity to discuss how my skills and experiences align with the goals of your team. Thank you for your time and consideration.

Sincerely,
[Your Name]
[Your Contact Information]`;

  return {
    cover_letter_template: template,
  };
}
