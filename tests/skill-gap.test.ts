import { describe, it, expect } from "vitest";
import { skillGapAnalysis } from "../src/tools/skill-gap-analysis.js";

describe("skillGapAnalysis", () => {
  it("should generate a learning roadmap when skills are missing", async () => {
    const resumeText = "I know html and css.";
    const jobText = "Looking for html, css, and javascript knowledge.";
    
    const result = await skillGapAnalysis(resumeText, jobText);
    
    expect(result.missing_skills).toContain("javascript");
    expect(result.learning_roadmap.length).toBeGreaterThan(0);
    expect(result.learning_roadmap[0]).toContain("Phase 1");
  });

  it("should congratulate if no missing skills", async () => {
    const resumeText = "I have experience in typescript and node.";
    const jobText = "typescript node";
    
    const result = await skillGapAnalysis(resumeText, jobText);
    
    expect(result.missing_skills).toHaveLength(0);
    expect(result.learning_roadmap[0]).toContain("No major skill gaps identified!");
  });
});
