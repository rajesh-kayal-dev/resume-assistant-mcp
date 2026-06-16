import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function POST(request: Request) {
  try {
    const { resumeText, jobText, linkedinText, analysisOptions = {
      resumeImprovements: true,
      interviewQuestions: true,
      skillGap: true,
      coverLetter: true,
      linkedinOptimization: true
    } } = await request.json();

    if (!resumeText || !jobText) {
      return NextResponse.json({ error: "Missing resume or job text" }, { status: 400 });
    }

    // Run analyses in parallel
    const promises = [
      callMcpTool("calculate_ats_match", { resume_text: resumeText, job_text: jobText })
    ];

    if (analysisOptions.resumeImprovements) {
      promises.push(callMcpTool("get_resume_improvements", { resume_text: resumeText }));
    } else {
      promises.push(Promise.resolve({ suggestions: [], metrics: { word_count: 0, has_contact_info: false, has_quantifiable_metrics: false } }));
    }

    if (analysisOptions.interviewQuestions) {
      promises.push(callMcpTool("generate_interview_questions", { resume_text: resumeText, job_text: jobText }));
    } else {
      promises.push(Promise.resolve({ technical_questions: [], hr_questions: [] }));
    }

    if (analysisOptions.skillGap) {
      promises.push(callMcpTool("skill_gap_analysis", { resume_text: resumeText, job_text: jobText }));
    } else {
      promises.push(Promise.resolve({ missing_skills: [], learning_roadmap: "" }));
    }

    if (analysisOptions.coverLetter) {
      promises.push(callMcpTool("generate_cover_letter", { resume_text: resumeText, job_text: jobText }));
    } else {
      promises.push(Promise.resolve({ cover_letter_template: "" }));
    }

    if (analysisOptions.companyAnalysis) {
      promises.push(callMcpTool("analyze_company", { job_text: jobText }));
    } else {
      promises.push(Promise.resolve(null));
    }

    const [atsMatch, improvements, interviewQs, skillGap, coverLetter, companyData] = await Promise.all(promises);

    let linkedinData = null;
    if (analysisOptions.linkedinOptimization && linkedinText && linkedinText.trim() !== "") {
      linkedinData = await callMcpTool("linkedin_profile_optimizer", { linkedin_text: linkedinText, resume_text: resumeText });
    }

    return NextResponse.json({
      atsScore: atsMatch.match_score,
      matchedKeywords: atsMatch.matched_keywords,
      missingKeywords: atsMatch.missing_keywords,
      jobRole: atsMatch.job_role,
      salary: atsMatch.salary,
      experienceRequired: atsMatch.experience_required,
      recommendation: atsMatch.recommendation,
      suitabilityAssessment: atsMatch.suitability_assessment,
      resumeImprovements: analysisOptions.resumeImprovements ? improvements.suggestions : null,
      resumeMetrics: analysisOptions.resumeImprovements ? improvements.metrics : null,
      technicalQuestions: analysisOptions.interviewQuestions ? interviewQs.technical_questions : null,
      hrQuestions: analysisOptions.interviewQuestions ? interviewQs.hr_questions : null,
      missingSkills: analysisOptions.skillGap ? skillGap.missing_skills : null,
      learningRoadmap: analysisOptions.skillGap ? skillGap.learning_roadmap : null,
      coverLetterTemplate: analysisOptions.coverLetter ? coverLetter.cover_letter_template : null,
      linkedinSuggestions: linkedinData ? {
        headline_suggestions: linkedinData.headline_suggestions,
        summary_suggestions: linkedinData.summary_suggestions,
        general_tips: linkedinData.general_tips
      } : null,
      companyData: analysisOptions.companyAnalysis ? companyData : null
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
