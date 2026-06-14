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

const ACTION_VERBS = ["developed", "led", "managed", "designed", "implemented", "improved", "increased", "reduced", "spearheaded"];

export async function getResumeImprovements(resumeText: string): Promise<GetResumeImprovementsResult> {
  const suggestions: string[] = [];
  
  // 1. Word count heuristic
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 150) {
    suggestions.push("Your resume is quite short. Consider adding more detail to your work experiences or projects.");
  } else if (wordCount > 600) {
    suggestions.push("Your resume is quite long. Consider keeping it to a single page by being more concise and focusing on your most relevant achievements.");
  }

  // 2. Contact info heuristic
  const hasEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(resumeText);
  const hasPhone = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(resumeText);
  
  if (!hasEmail || !hasPhone) {
    suggestions.push("ATS parsers might struggle to find your contact information. Ensure your phone number and email are clearly listed at the top.");
  }

  // 3. Action verbs heuristic
  const lowerText = resumeText.toLowerCase();
  let verbCount = 0;
  for (const verb of ACTION_VERBS) {
    if (lowerText.includes(verb)) {
      verbCount++;
    }
  }
  if (verbCount < 3) {
    suggestions.push("We detected very few strong action verbs (e.g., 'developed', 'led', 'improved'). Starting bullet points with action verbs makes a stronger impact.");
  }

  // 4. Quantifiable metrics heuristic
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+\s*(users|clients|dollars)/i.test(resumeText);
  if (!hasMetrics) {
    suggestions.push("Your resume lacks quantifiable metrics. Try to include numbers to demonstrate your impact (e.g., 'improved performance by 20%', 'led a team of 5').");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your resume looks solidly formatted with good length, contact info, and metrics!");
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
