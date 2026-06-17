"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AppSidebar } from "@/components/analyzer/app-sidebar";
import { useCountUp } from "@/hooks/use-template";
import jsPDF from "jspdf";
import { FileUp, FileText, Link2, Download, AlertTriangle, Loader2, Check, X, ChevronRight, Copy, ScanLine } from "lucide-react";

// ── Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "ats", label: "ATS MATCH", zh: "系統匹配" },
  { id: "improvements", label: "IMPROVEMENTS", zh: "履歷優化" },
  { id: "interview", label: "INTERVIEW", zh: "面試準備" },
  { id: "skills", label: "SKILL GAP", zh: "技能落差" },
  { id: "coverLetter", label: "COVER LETTER", zh: "求職信" },
  { id: "linkedin", label: "LINKEDIN", zh: "社群優化" },
  { id: "company", label: "COMPANY", zh: "公司資訊" },
];

export default function AnalyzerPage() {
  const {
    jobUrl, setJobUrl, linkedinText, setLinkedinText,
    isAnalyzing, error, progress, results, file, setFile, analyze
  } = useAppStore();

  const [activeTab, setActiveTab] = useState("ats");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-switch tabs based on results
  useEffect(() => {
    if (results && activeTab === "ats") {
      setActiveTab("ats");
    }
  }, [results]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleRun = () => {
    if (!file || !jobUrl) return;
    setActiveTab("ats");
    analyze();
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.text("Resume Analysis Report", 20, 20);
    doc.save("analysis-report.pdf");
  };

  const ProgressRing = ({ value }: { value: number }) => {
    const v = useCountUp(value, true);
    const dashArray = 283;
    const dashOffset = dashArray - (dashArray * v) / 100;
    const color = v >= 75 ? "#34d399" : v >= 50 ? "#fbbf24" : "#f87171"; // emerald, amber, red

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={dashArray} strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="font-mono text-3xl font-semibold text-slate-900 dark:text-white">{v}%</span>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">MATCH</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen grid-bg bg-white dark:bg-transparent transition-colors duration-300">
      <AppSidebar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Col: Config */}
        <div className="w-full lg:w-[400px] border-r border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-[#060a12] flex flex-col transition-colors">
          <div className="p-6 border-b border-slate-200 dark:border-slate-900">
            <h1 className="font-mono font-bold tracking-widest text-slate-900 dark:text-white text-sm">ANALYZER</h1>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Workspace / New Analysis</p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* 01 RESUME */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-transparent">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-cyan-400 rounded-full" />
                <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-slate-400">01 / RESUME</span>
              </div>
              <div
                className={`p-6 text-center cursor-pointer transition-colors ${
                  file ? "bg-slate-50 dark:bg-cyan-950/10" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file" className="hidden" ref={fileInputRef}
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <div className="flex justify-center mb-3">
                  {file ? <FileText className="text-slate-800 dark:text-cyan-400" size={32} /> : <FileUp className="text-slate-400 dark:text-slate-600" size={32} />}
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {file ? file.name : "DROP FILE HERE"}
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  {file ? "Click to change" : "PDF or DOCX · Max 5MB"}
                </div>
              </div>
            </div>

            {/* 02 TARGET JOB */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-transparent">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-slate-400">02 / TARGET JOB</span>
              </div>
              <div className="flex items-center px-4 py-3 bg-white dark:bg-[#04060a]">
                <Link2 size={14} className="text-slate-400 dark:text-slate-600 mr-3" />
                <input
                  type="url"
                  placeholder="https://..."
                  className="bg-transparent border-none outline-none font-mono text-xs text-slate-900 dark:text-white w-full placeholder-slate-400 dark:placeholder-slate-700"
                  value={jobUrl} onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>
            </div>

            {/* 03 LINKEDIN */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-transparent">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-slate-400">03 / LINKEDIN (OPT)</span>
              </div>
              <input
                type="text"
                placeholder="Paste LinkedIn URL (e.g. www.linkedin.com/in/you)"
                className="w-full bg-white dark:bg-[#04060a] p-4 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 outline-none"
                value={linkedinText} onChange={(e) => setLinkedinText(e.target.value)}
              />
            </div>

            {/* 04 ANALYSIS OPTIONS */}
            <details className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none">
              <summary className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer list-none bg-slate-50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-slate-400">04 / ANALYSIS OPTIONS</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked disabled className="w-4 h-4 accent-cyan-400" />
                  <span className="font-mono text-xs text-slate-500">ATS Match (Required)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).resumeImprovements} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ resumeImprovements: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">Resume Improvements</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).interviewQuestions} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ interviewQuestions: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">Interview Questions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).skillGap} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ skillGap: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">Skill Gap Analysis</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).coverLetter} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ coverLetter: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">Generate Cover Letter</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).linkedinOptimization} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ linkedinOptimization: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">LinkedIn Optimization</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" 
                    checked={useAppStore(s => s.analysisOptions).companyAnalysis} 
                    onChange={(e) => useAppStore.getState().setAnalysisOptions({ companyAnalysis: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 group-hover:ring-2 ring-cyan-400/30 transition-all" />
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">Company Research</span>
                </label>
              </div>
            </details>

            {error && (
              <div className="p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-mono text-xs flex items-start gap-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={!file || !jobUrl || isAnalyzing}
              className={`w-full py-4 font-mono text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                !file || !jobUrl
                  ? "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-transparent"
                  : isAnalyzing
                  ? "bg-slate-200 dark:bg-cyan-900 text-slate-600 dark:text-cyan-400 cursor-wait"
                  : "bg-slate-900 dark:bg-cyan-400 text-white dark:text-[#04060a] hover:bg-slate-800 dark:hover:bg-cyan-300 shadow-md dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  {progress}
                </>
              ) : (
                <>
                  <ScanLine size={16} />
                  RUN DEEP ANALYSIS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Output */}
        <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
          {!results ? (
            <div className="flex-1 flex items-center justify-center p-8 pointer-events-none">
              <div className="text-[80px] md:text-[120px] lg:text-[180px] font-bold text-slate-100 dark:text-slate-800/10 leading-none text-center select-none">
                AWAITING<br/>ANALYSIS
              </div>
            </div>
          ) : (
            <>
              {/* Tab Bar */}
              <div className="flex items-center overflow-x-auto border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-[#060a12] scrollbar-hide px-4">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex flex-col px-6 py-4 border-b-2 transition-all whitespace-nowrap outline-none ${
                      activeTab === t.id
                        ? "border-slate-900 dark:border-cyan-400 bg-slate-50 dark:bg-cyan-950/20"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <span className={`font-mono text-xs tracking-widest ${activeTab === t.id ? "text-slate-900 dark:text-cyan-300 font-bold" : "text-slate-500 dark:text-slate-400"}`}>
                      {t.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">{t.zh}</span>
                  </button>
                ))}
                
                <div className="ml-auto pr-4 flex items-center gap-4 border-l border-slate-200 dark:border-slate-900 pl-4 py-3">
                  <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    ANALYSIS COMPLETE
                  </div>
                  <button onClick={exportPDF} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors" title="Export PDF">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto space-y-8 pb-20">
                  
                  {activeTab === "ats" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm dark:shadow-none">
                        <ProgressRing value={typeof results.atsScore === 'number' ? results.atsScore : 0} />
                        <div className="flex-1">
                          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">ATS Compatibility</h2>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-lg mb-6">
                            Based on our semantic analysis, your resume matches {typeof results.atsScore === 'number' ? results.atsScore : 0}% of the target job requirements.
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            {["Keywords", "Formatting", "Impact"].map((cat, i) => (
                              <div key={cat} className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#04060a] p-4 text-center">
                                <div className="font-mono text-xl text-slate-900 dark:text-white">{[typeof results.atsScore === 'number' ? results.atsScore : 0, 95, 85][i]}%</div>
                                <div className="font-mono text-[10px] text-slate-500 mt-1 uppercase">{cat}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 shadow-sm dark:shadow-none">
                          <div className="font-mono text-xs tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
                            <Check size={14} /> MATCHED KEYWORDS
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(results.matchedKeywords ?? []).map((kw: string) => (
                              <span key={kw} className="px-3 py-1 font-mono text-[10px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 shadow-sm dark:shadow-none">
                          <div className="font-mono text-xs tracking-widest text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                            <X size={14} /> MISSING KEYWORDS
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(results.missingKeywords ?? []).map((kw: string) => (
                              <span key={kw} className="px-3 py-1 font-mono text-[10px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Job Suitability Accordions */}
                      <div className="space-y-4">
                        <details className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none" open>
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                              <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-cyan-400 uppercase">Job Breakdown</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                              <div>
                                <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Role</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{results.jobRole || "Not found"}</div>
                              </div>
                              <div>
                                <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Salary</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{results.salary || "Not disclosed"}</div>
                              </div>
                              <div>
                                <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Experience</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{results.experienceRequired || "Not specified"}</div>
                              </div>
                            </div>
                          </div>
                        </details>

                        <details className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] shadow-sm dark:shadow-none" open>
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-1.5 h-1.5 rounded-full ${results.recommendation === "Highly Suitable" ? "bg-emerald-400" : results.recommendation === "Moderately Suitable" ? "bg-yellow-400" : "bg-red-400"}`} />
                              <span className="font-mono text-[10px] tracking-widest text-slate-600 dark:text-cyan-400 uppercase">Suitability Assessment</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="pt-6">
                              <div className={`inline-block px-3 py-1 mb-4 font-mono text-[10px] uppercase border text-slate-900 dark:text-white ${results.recommendation === "Highly Suitable" ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20" : results.recommendation === "Moderately Suitable" ? "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-950/20" : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20"}`}>
                                {results.recommendation || "Assessment"}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {results.suitabilityAssessment || "No detailed assessment provided."}
                              </p>
                            </div>
                          </div>
                        </details>
                      </div>

                    </div>
                  )}

                  {activeTab === "improvements" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      {!results.resumeImprovements ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">Resume Improvements analysis was skipped.</p>
                        </div>
                      ) : (
                        (results.resumeImprovements || []).map((imp: string, i: number) => (
                          <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 hover:border-slate-300 dark:hover:border-cyan-900 transition-colors shadow-sm dark:shadow-none">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded bg-slate-50 dark:bg-[#04060a] border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 mt-1 text-slate-600 dark:text-cyan-400 font-mono text-xs">
                                {i+1}
                              </div>
                              <div>
                                <h3 className="text-slate-900 dark:text-white font-medium mb-2">Suggestion {i+1}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{imp}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "interview" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      {!results.technicalQuestions ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">Interview Questions analysis was skipped.</p>
                        </div>
                      ) : (
                        [
                          ...(results.technicalQuestions || []).map((q: string) => ({ category: "Technical", question: q })),
                          ...(results.hrQuestions || []).map((q: string) => ({ category: "HR", question: q }))
                        ].map((q: any, i: number) => (
                          <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 hover:border-slate-300 dark:hover:border-cyan-900 shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-start mb-4">
                              <span className="px-2 py-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase">
                                {q.category}
                              </span>
                            </div>
                            <h3 className="text-lg text-slate-900 dark:text-white font-medium mb-3">{q.question}</h3>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-8 animate-in fade-in duration-500 shadow-sm dark:shadow-none">
                      {!results.missingSkills ? (
                        <div className="text-center">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">Skill Gap Analysis was skipped.</p>
                        </div>
                      ) : (
                        <>
                          <div className="relative pl-8">
                            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />
                            {(results.missingSkills || []).map((skill: string, i: number) => (
                              <div key={i} className="relative pb-10 last:pb-0">
                                <span className="absolute -left-8 top-1 w-4 h-4 border-2 border-slate-800 dark:border-cyan-500 bg-white dark:bg-[#04060a]" style={{ marginLeft: "1px" }} />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{skill}</h3>
                              </div>
                            ))}
                          </div>
                          {results.learningRoadmap && (
                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                              <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Learning Roadmap</h3>
                              <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">{results.learningRoadmap}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === "coverLetter" && (
                    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] animate-in fade-in duration-500 shadow-sm dark:shadow-none">
                      {!results.coverLetterTemplate ? (
                        <div className="p-12 text-center">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">Cover Letter Generation was skipped.</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-[#070c14]">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/70" />
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
                              <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/70" />
                              <span className="ml-3 font-mono text-xs text-slate-500">cover-letter.txt</span>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(results.coverLetterTemplate || "")}
                              className="flex items-center gap-2 font-mono text-[10px] text-slate-600 dark:text-cyan-400 hover:text-slate-900 dark:hover:text-cyan-300 transition-colors"
                            >
                              <Copy size={12} /> COPY TEXT
                            </button>
                          </div>
                          <div className="p-8 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {results.coverLetterTemplate}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === "linkedin" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      {!useAppStore.getState().analysisOptions.linkedinOptimization ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">LinkedIn Optimization was skipped.</p>
                          <button onClick={() => setActiveTab("ats")} className="font-mono text-xs text-slate-800 dark:text-cyan-400 hover:underline">
                            ← BACK TO ATS
                          </button>
                        </div>
                      ) : !linkedinText || !results.linkedinSuggestions ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">No LinkedIn profile text provided during analysis.</p>
                          <button onClick={() => setActiveTab("ats")} className="font-mono text-xs text-slate-800 dark:text-cyan-400 hover:underline">
                            ← BACK TO ATS
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 shadow-sm dark:shadow-none">
                            <div className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-cyan-500 mb-4 uppercase">Headline Suggestions</div>
                            <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                              {results.linkedinSuggestions.headline_suggestions?.map((opt: string, i: number) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 shadow-sm dark:shadow-none">
                            <div className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-cyan-500 mb-4 uppercase">Summary Suggestions</div>
                            <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                              {results.linkedinSuggestions.summary_suggestions?.map((opt: string, i: number) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-6 shadow-sm dark:shadow-none">
                            <div className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-cyan-500 mb-4 uppercase">General Tips</div>
                            <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                              {results.linkedinSuggestions.general_tips?.map((opt: string, i: number) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === "company" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {!useAppStore.getState().analysisOptions.companyAnalysis ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">Company Research was skipped.</p>
                          <button onClick={() => setActiveTab("ats")} className="font-mono text-xs text-slate-800 dark:text-cyan-400 hover:underline">
                            ← BACK TO ATS
                          </button>
                        </div>
                      ) : !results.companyData ? (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-12 text-center shadow-sm dark:shadow-none">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">No Company details could be extracted.</p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-8 shadow-sm dark:shadow-none relative overflow-hidden">
                          {/* Top Section with Logo and Name */}
                          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
                            {results.companyData.website_domain && results.companyData.website_domain !== "example.com" ? (
                              <img 
                                src={`https://logo.clearbit.com/${results.companyData.website_domain}`} 
                                alt={`${results.companyData.company_name} Logo`} 
                                className="w-24 h-24 object-contain bg-white rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-2"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            ) : (
                              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center font-mono text-4xl text-slate-400">
                                {results.companyData.company_name.charAt(0)}
                              </div>
                            )}
                            <div className="text-center md:text-left flex-1">
                              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{results.companyData.company_name}</h2>
                              <a href={`https://${results.companyData.website_domain}`} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono text-sm flex items-center justify-center md:justify-start gap-2">
                                <Link2 size={14} /> {results.companyData.website_domain}
                              </a>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div>
                              <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Industry</div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{results.companyData.industry}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Location</div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{results.companyData.location}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Company Size</div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{results.companyData.company_size}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[10px] text-slate-500 mb-1 uppercase">Founded</div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{results.companyData.founded_year}</div>
                            </div>
                          </div>

                          {/* About Section */}
                          <div>
                            <div className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-cyan-500 mb-4 uppercase">About the Company</div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                              {results.companyData.about}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
