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

export async function linkedinProfileOptimizer(linkedinText: string): Promise<LinkedinProfileOptimizerResult> {
  const headline_suggestions: string[] = [];
  const summary_suggestions: string[] = [];
  const general_tips: string[] = [];
  
  const text = linkedinText.toLowerCase();

  // Headline heuristic: often includes separators like | or -
  if (!text.includes("|") && !text.includes("-")) {
    headline_suggestions.push("Your headline seems simple. Try a format like 'Role | Key Skill 1 | Key Skill 2' to improve searchability.");
  } else {
    headline_suggestions.push("Your headline format looks good. Ensure it contains the exact keywords recruiters use to find your role.");
  }

  // Summary/About heuristic: Should be decent length
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 100) {
    summary_suggestions.push("Your profile text is very short. Expand your 'About' section to tell your professional story and highlight your biggest wins.");
  } else {
    summary_suggestions.push("Consider breaking up your 'About' section with bullet points or emojis to make it highly scannable.");
  }

  // General tips based on common missing elements
  if (!text.includes("skills") && !text.includes("technologies")) {
    general_tips.push("Make sure you have a dedicated 'Skills' section with at least 15-20 highly relevant endorsements.");
  }
  
  general_tips.push("Ensure your profile picture is professional and your banner image relates to your industry.");
  general_tips.push("Customize your LinkedIn URL to be just your name (e.g., linkedin.com/in/firstlast).");

  return {
    headline_suggestions,
    summary_suggestions,
    general_tips,
  };
}
