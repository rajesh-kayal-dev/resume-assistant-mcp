import { describe, it, expect } from "vitest";
import { calculateAtsMatch } from "../src/tools/calculate-ats-match.js";

describe("calculateAtsMatch", () => {
  it("should match exact keywords", async () => {
    const resumeText = "I have 5 years of experience in Typescript, Node.js, and React.";
    const jobText = "Looking for a senior developer with strong typescript and react skills.";
    
    const result = await calculateAtsMatch(resumeText, jobText);
    
    expect(result.matched_keywords).toContain("typescript");
    expect(result.matched_keywords).toContain("react");
    expect(result.match_score).toBeGreaterThan(0);
  });

  it("should return missing keywords", async () => {
    const resumeText = "Experienced with Java and Spring Boot.";
    const jobText = "Required: Java, Docker, Kubernetes";
    
    const result = await calculateAtsMatch(resumeText, jobText);
    
    expect(result.matched_keywords).toContain("java");
    expect(result.missing_keywords).toContain("docker");
    expect(result.missing_keywords).toContain("kubernetes");
    expect(result.match_score).toBeLessThan(100);
  });

  it("should ignore stopwords", async () => {
    const resumeText = "the and a of in";
    const jobText = "the and a of in something";
    
    const result = await calculateAtsMatch(resumeText, jobText);
    
    expect(result.matched_keywords).not.toContain("the");
    expect(result.missing_keywords).toContain("something");
  });
});
