import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function POST(request: Request) {
  try {
    const { resumeText, jobText, linkedinText } = await request.json();

    if (!resumeText || !jobText) {
      return NextResponse.json({ error: "Missing resume or job text" }, { status: 400 });
    }

    // Run analyses in parallel
    const [
      atsMatch,
      improvements,
      interviewQs,
      skillGap,
      coverLetter
    ] = await Promise.all([
      callMcpTool("calculate_ats_match", { resume_text: resumeText, job_text: jobText }),
      callMcpTool("get_resume_improvements", { resume_text: resumeText }),
      callMcpTool("generate_interview_questions", { resume_text: resumeText, job_text: jobText }),
      callMcpTool("skill_gap_analysis", { resume_text: resumeText, job_text: jobText }),
      callMcpTool("generate_cover_letter", { resume_text: resumeText, job_text: jobText })
    ]);

    let linkedinData = null;
    if (linkedinText && linkedinText.trim() !== "") {
      linkedinData = await callMcpTool("linkedin_profile_optimizer", { linkedin_text: linkedinText });
    }

    return NextResponse.json({
      atsScore: atsMatch.match_score,
      matchedKeywords: atsMatch.matched_keywords,
      missingKeywords: atsMatch.missing_keywords,
      resumeImprovements: improvements.suggestions,
      resumeMetrics: improvements.metrics,
      technicalQuestions: interviewQs.technical_questions,
      hrQuestions: interviewQs.hr_questions,
      missingSkills: skillGap.missing_skills,
      learningRoadmap: skillGap.learning_roadmap,
      coverLetterTemplate: coverLetter.cover_letter_template,
      linkedinSuggestions: linkedinData ? {
        headline_suggestions: linkedinData.headline_suggestions,
        summary_suggestions: linkedinData.summary_suggestions,
        general_tips: linkedinData.general_tips
      } : null
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
