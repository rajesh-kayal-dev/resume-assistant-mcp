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
}

// Very basic stopword list to filter out noise
const STOPWORDS = new Set([
  "the", "and", "a", "to", "of", "in", "i", "is", "that", "it", "on", "you",
  "this", "for", "but", "with", "are", "have", "be", "at", "or", "as", "was",
  "so", "if", "out", "not", "we", "my", "your", "they", "from", "by", "about",
  "will", "would", "can", "an", "all", "has", "do", "what", "their", "get", "like"
]);

/**
 * Extracts potential keywords from text.
 * A real ATS uses NLP (NER) to find skills. We use a heuristic:
 * words/phrases that are capitalized, or technical terms.
 * For this simple version, we'll just extract unique non-stopwords longer than 3 chars.
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));
  
  return Array.from(new Set(words));
}

export async function calculateAtsMatch(resumeText: string, jobText: string): Promise<CalculateAtsMatchResult> {
  const jobKeywords = extractKeywords(jobText);
  const resumeTextLower = resumeText.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of jobKeywords) {
    // Simple exact word boundary match
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(resumeTextLower)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  // Calculate score based on percentage of job keywords found in resume
  // Real ATS systems are more complex, but this is a good proxy.
  const score = jobKeywords.length > 0 
    ? Math.round((matched.length / jobKeywords.length) * 100) 
    : 0;

  return {
    match_score: score,
    missing_keywords: missing.slice(0, 20), // return top 20 missing
    matched_keywords: matched.slice(0, 20),
  };
}
