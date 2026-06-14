import { z } from "zod";
import { apiClient } from "../lib/api-client.js";

export const fetchJobDescriptionSchema = {
  url: z.string().url().describe("The full URL of the job posting (e.g. LinkedIn, Greenhouse, Lever, etc.)"),
};

export interface FetchJobDescriptionResult {
  [key: string]: unknown;
  job_text: string;
  source_url: string;
  word_count: number;
}

export async function fetchJobDescription(url: string): Promise<FetchJobDescriptionResult> {
  const text = await apiClient.getJobDescription(url);
  
  // Clean up text
  const cleanText = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const wordCount = cleanText.split(/\s+/).filter(w => w.length > 0).length;

  return {
    job_text: cleanText,
    source_url: url,
    word_count: wordCount,
  };
}
