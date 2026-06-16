"use client";

import { Reveal, SectionHead } from "@/components/template/reveal";
import { FileText, Link2, Target, PenLine, MessageSquare, BarChart2, Mail, Share2, Zap, Lock, Crosshair } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";

const TOOLS = [
  { icon: FileText,     label: "PARSE RESUME",    sub: "PDF, DOCX, TXT" },
  { icon: Link2,        label: "FETCH JOB URL",   sub: "Auto-extraction" },
  { icon: Target,       label: "ATS SCORING",     sub: "Keyword matching" },
  { icon: PenLine,      label: "IMPROVEMENTS",    sub: "Actionable tips" },
  { icon: MessageSquare,label: "INTERVIEW PREP",  sub: "Technical + HR Qs" },
  { icon: BarChart2,    label: "SKILL GAP",       sub: "Learning roadmap" },
  { icon: Mail,         label: "COVER LETTER",    sub: "Tailored template" },
  { icon: Share2,       label: "LINKEDIN OPT.",   sub: "Profile optimizer" },
];

const WHY = [
  {
    icon: Zap,
    en: "Powered by MCP",
    zh: "基於 MCP 架構",
    body: "Instead of monolithic AI prompts, our system orchestrates multiple specialized MCP tools running concurrently for unmatched accuracy.",
  },
  {
    icon: Lock,
    en: "100% Local Processing",
    zh: "完全本地化處理",
    body: "Your resume and job data never leave your browser. Analysis runs instantly without storing your personal information on our servers.",
  },
  {
    icon: Crosshair,
    en: "Context-Aware Results",
    zh: "具備上下文感知的結果",
    body: "Generic advice is useless. Every interview question, skill gap, and cover letter is generated specifically for your resume against the target job.",
  },
];

export function Features() {
  return (
    <>
      <section id="modules" className="py-28 bg-neo-bg dark:bg-transparent transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-black dark:bg-cyan-500" />
                <span className="font-mono text-xs font-bold tracking-widest text-black dark:text-cyan-500">01 / MODULES</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-musashi font-normal tracking-wider text-black dark:text-white mb-2">
                Everything inside
              </h2>
              <p className="text-black/60 dark:text-slate-400 font-medium mb-8">同一套系統,涵蓋每一個營運環節</p>
              <p className="text-lg text-black/70 dark:text-slate-300 max-w-3xl">
                Eight operational modules, one core AI engine. No waiting between steps.
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 brutal-border bg-black dark:bg-slate-900 brutal-shadow gap-px">
            {TOOLS.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.label} delay={i * 60}>
                  <MagicCard
                    gradientColor="rgba(255,138,235,0.15)"
                    className="group !rounded-none !bg-white dark:!bg-[#04060a] !border-none p-8 h-[160px] flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-cyan-950/20 transition-colors cursor-default relative overflow-hidden"
                  >
                    <Icon className="text-3xl text-black/70 dark:text-slate-500 group-hover:text-neo-pink dark:group-hover:text-cyan-300 transition-colors z-20 relative" strokeWidth={1.5} />
                    <div className="z-20 relative">
                      <div className="font-mono text-sm font-bold tracking-widest text-black dark:text-white group-hover:text-black dark:group-hover:text-white">{m.label}</div>
                      <div className="mt-1 text-xs text-black/50 dark:text-slate-500 font-medium group-hover:text-black/70 dark:group-hover:text-slate-400">{m.sub}</div>
                    </div>
                  </MagicCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="why" className="py-28 bg-white dark:bg-[#060a12] border-y-2 dark:border-y border-black dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-black dark:bg-cyan-500" />
                <span className="font-mono text-xs font-bold tracking-widest text-black dark:text-cyan-500">02 / WHY</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-musashi font-normal tracking-wider text-black dark:text-white mb-2">
                Built as one. Not assembled.
              </h2>
              <p className="text-black/60 dark:text-slate-400 font-medium mb-8">一體成形,而非拼裝整合</p>
              <p className="text-lg text-black/70 dark:text-slate-300 max-w-3xl leading-relaxed">
                Most tools give you a generic chat box. ResuMate MCP is engineered as a single analytical pipeline designed specifically to get you hired.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <Reveal key={w.en} delay={i * 130} className="h-full">
                  <div className="group brutal-border bg-white dark:bg-[#04060a] p-10 h-full brutal-shadow hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 brutal-border bg-neo-yellow dark:bg-transparent flex items-center justify-center mb-8 brutal-shadow">
                      <Icon className="text-2xl text-black dark:text-cyan-400" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white">{w.en}</h3>
                    <p className="mt-1 text-sm text-black/50 dark:text-cyan-200/60 font-medium">{w.zh}</p>
                    <p className="mt-6 text-base text-black/70 dark:text-slate-400 leading-relaxed">{w.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
