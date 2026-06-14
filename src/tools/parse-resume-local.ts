import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export const parseResumeLocalSchema = {
  file_path: z.string().describe("Absolute or relative path to the local resume file (.pdf, .docx, .txt, .md)"),
};

export interface ParseResumeLocalResult {
  [key: string]: unknown;
  parsed_text: string;
  word_count: number;
}

export async function parseResumeLocal(filePath: string): Promise<ParseResumeLocalResult> {
  const resolvedPath = path.resolve(filePath);
  
  try {
    await fs.access(resolvedPath);
  } catch {
    throw new Error(`File not found or not accessible: ${resolvedPath}`);
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  let text = "";

  if (ext === ".pdf") {
    const buffer = await fs.readFile(resolvedPath);
    try {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const extracted = await extractText(pdf);
      // unpdf extractText might return arrays depending on version
      const rawText = (extracted as any).text || extracted;
      text = Array.isArray(rawText) ? rawText.join("\n") : String(rawText);
    } catch (e) {
       throw new Error(`Failed to parse PDF: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else if (ext === ".docx") {
    const buffer = await fs.readFile(resolvedPath);
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (ext === ".txt" || ext === ".md") {
    text = await fs.readFile(resolvedPath, "utf-8");
  } else {
    throw new Error(`Unsupported file type: ${ext}. Only .pdf, .docx, .txt, and .md are supported.`);
  }

  // Clean up text
  text = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  return {
    parsed_text: text,
    word_count: wordCount,
  };
}
