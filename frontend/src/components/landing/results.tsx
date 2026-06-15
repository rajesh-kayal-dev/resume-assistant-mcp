"use client";

import { Reveal, SectionHead } from "@/components/template/reveal";

const PLATFORM = [
  { key: "ATS SCORE", spec: "Keyword match % vs job description", zh: "Color-coded matched and missing keyword tags" },
  { key: "IMPROVEMENTS", spec: "Word count · Contact info · Action verbs", zh: "Specific, actionable tips to strengthen your resume" },
  { key: "INTERVIEW", spec: "Technical questions + HR behavioral questions", zh: "Generated from matched and missing skills in the job" },
  { key: "SKILL GAP", spec: "Phase-based learning roadmap", zh: "Prioritized list of skills to acquire for this role" },
  { key: "COVER LETTER", spec: "Personalized template using matched keywords", zh: "Ready to copy, paste, and customize" },
  { key: "LINKEDIN", spec: "Headline · Summary · General profile tips", zh: "Only shown when LinkedIn profile text is provided" },
];

export function ResultsPreview() {
  return (
    <section id="results" className="py-28 bg-white dark:bg-[#060a12] border-y border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="04 / RESULTS"
          en="Six panels. One analysis."
          zh="Everything you need to land the role"
          intro="Every result is generated specifically for your resume against the target job description. No generic advice — all context-aware output from 8 specialized MCP tools."
        />
        <Reveal>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#03050a] font-mono text-sm shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#070c14]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-slate-500">resume-ai — analysis.results</span>
              </div>
              <span className="text-xs text-slate-600 dark:text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyan-400 animate-pulse" />
                READY
              </span>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-900">
              {PLATFORM.map((p, i) => (
                <Reveal key={p.key} delay={i * 70}>
                  <div className="grid md:grid-cols-[160px_1fr] gap-2 md:gap-6 px-5 py-5 hover:bg-white dark:hover:bg-cyan-950/15 transition-colors">
                    <div className="text-slate-800 dark:text-cyan-400 text-xs tracking-widest pt-0.5">{p.key}</div>
                    <div>
                      <div className="text-slate-900 dark:text-slate-200 text-xs md:text-sm">{p.spec}</div>
                      <div className="mt-1.5 text-xs text-slate-500 font-sans">{p.zh}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-16 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8">
              Ready to land the role?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/app" className="font-mono text-xs tracking-widest px-7 py-3.5 bg-slate-900 dark:bg-cyan-400 text-white dark:text-[#04060a] font-medium hover:bg-slate-800 dark:hover:bg-cyan-300 dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
                START FREE ANALYSIS
              </a>
              <a href="/history" className="font-mono text-xs tracking-widest px-7 py-3.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-cyan-500/60 hover:text-slate-900 dark:hover:text-cyan-300 transition-all">
                VIEW HISTORY
              </a>
            </div>
            <p className="mt-6 font-mono text-xs text-slate-400 dark:text-slate-600 tracking-wider">
              NO ACCOUNT REQUIRED · NO DATA STORED · 100% FREE
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
