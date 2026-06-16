import { z } from "zod";
import { askGroq } from "../lib/groq.js";

export const analyzeCompanySchema = {
  job_text: z.string().describe("The raw text of the job description"),
};

export interface AnalyzeCompanyResult {
  [key: string]: unknown;
  company_name: string;
  website_domain: string;
  industry: string;
  location: string;
  company_size: string;
  founded_year: string;
  about: string;
}

export async function analyzeCompany(jobText: string): Promise<AnalyzeCompanyResult> {
  const systemPrompt = `You are an expert Corporate Researcher.
Review the provided job description, identify the hiring company, and provide a detailed company profile using your internal knowledge combined with the job description details.
Output JSON ONLY with the following exact structure:
{
  "company_name": "<The name of the hiring company>",
  "website_domain": "<The company's primary website domain, e.g., 'google.com', 'bairesdev.com'. IMPORTANT: Omit 'https://www.'>",
  "industry": "<Primary industry or working area>",
  "location": "<Headquarters or primary location>",
  "company_size": "<Estimated employee count, e.g., '1,000-5,000 employees'>",
  "founded_year": "<Year founded, e.g., '2009'>",
  "about": "<A detailed 3-4 sentence paragraph summarizing what the company does, its mission, and its market presence.>"
}`;

  const userPrompt = `JOB DESCRIPTION:\n${jobText.slice(0, 4000)}`;

  try {
    const jsonStr = await askGroq(systemPrompt, userPrompt);
    const result = JSON.parse(jsonStr) as AnalyzeCompanyResult;
    return {
      company_name: result.company_name || "Unknown Company",
      website_domain: result.website_domain || "example.com",
      industry: result.industry || "Information Technology",
      location: result.location || "Global / Remote",
      company_size: result.company_size || "Unknown",
      founded_year: result.founded_year || "Unknown",
      about: result.about || "No detailed company information could be generated at this time.",
    };
  } catch (err) {
    console.error("Groq Company Analysis error:", err);
    return {
      company_name: "Analysis Error",
      website_domain: "example.com",
      industry: "Error",
      location: "Error",
      company_size: "Error",
      founded_year: "Error",
      about: "An error occurred while generating the company profile.",
    };
  }
}
