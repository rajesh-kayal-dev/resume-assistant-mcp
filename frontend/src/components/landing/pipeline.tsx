"use client";

import { useState } from "react";
import { Reveal } from "@/components/template/reveal";
import { Upload, Link2, Settings2, FileText, CheckCircle2 } from "lucide-react";

const NODES = [
  { id: "01", icon: Upload, en: "UPLOAD", zh: "上傳履歷", body: "We parse your PDF or DOCX resume locally. No data is stored on external servers." },
  { id: "02", icon: Link2, en: "TARGET", zh: "目標職缺", body: "Paste a job description URL. We extract the key requirements, skills, and culture fit automatically." },
  { id: "03", icon: Settings2, en: "ANALYZE", zh: "MCP 分析", body: "Our parallel AI tools cross-reference your resume with the job description to calculate an ATS match score." },
  { id: "04", icon: FileText, en: "GENERATE", zh: "產出結果", body: "We instantly generate missing keywords, custom interview questions, and a tailored cover letter." },
  { id: "05", icon: CheckCircle2, en: "APPLY", zh: "準備投遞", body: "Export your results. You are now equipped with a highly optimized resume and interview strategy." },
];

export function Pipeline() {
  const [active, setActive] = useState<number | null>(null);
  const node = active !== null ? NODES[active] : null;

  return (
    <section id="pipeline" className="py-28 bg-neo-bg dark:bg-transparent transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-black dark:bg-cyan-500" />
              <span className="font-mono text-xs font-bold tracking-widest text-black dark:text-cyan-500">03 / SYSTEM</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-musashi font-normal tracking-wider text-black dark:text-white mb-2">
              One upload. End to end.
            </h2>
            <p className="text-black/60 dark:text-slate-400 font-medium mb-8">一筆履歷的完整路徑</p>
            <p className="text-lg text-black/70 dark:text-slate-300 max-w-3xl leading-relaxed">
              Five stages, one system. Hover over each node to see its scope of operation.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="brutal-border bg-white dark:bg-[#060a12] p-8 md:p-14 brutal-shadow transition-colors duration-300">
            {/* pipeline */}
            <div className="relative pt-8 pb-10">
              <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-0.5 bg-black dark:bg-slate-800 hidden md:block">
                <span className="signal-dot" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3 relative">
                {NODES.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      aria-label={`${n.en} ${n.zh}`}
                      className="group flex md:flex-col items-center md:items-center gap-4 md:gap-0 text-left md:text-center outline-none bg-white dark:bg-transparent z-10"
                    >
                      <div
                        className={`w-20 h-20 shrink-0 border-2 dark:border flex items-center justify-center bg-white dark:bg-[#04060a] transition-all duration-300 ${
                          active === i
                            ? "border-black dark:border-cyan-400 text-black dark:text-cyan-300 node-active"
                            : "border-black/30 dark:border-slate-700 text-black/60 dark:text-slate-500 group-hover:border-black dark:group-hover:border-cyan-600 group-hover:text-black dark:group-hover:text-cyan-500"
                        }`}
                      >
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      <div className="md:mt-6 bg-white dark:bg-[#060a12] px-2">
                        <div className="font-mono text-xs font-bold text-black/40 dark:text-cyan-600 mb-1">{n.id}</div>
                        <div className={`font-mono text-sm font-bold tracking-widest transition-colors ${active === i ? "text-neo-pink dark:text-cyan-300" : "text-black dark:text-white"}`}>
                          {n.en}
                        </div>
                        <div className="text-xs text-black/50 dark:text-slate-500 font-medium mt-1">{n.zh}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* detail panel */}
            <div className="mt-8 border-t-2 dark:border-t border-black dark:border-slate-800 pt-8 min-h-[140px]">
              <div className="font-mono text-xs font-bold tracking-widest text-black/60 dark:text-cyan-500 mb-4 flex items-center gap-2">
                <Upload size={14} />
                {node ? `${node.id} — ${node.en} / ${node.zh}` : "PIPELINE — 預設說明"}
              </div>
              <p className="text-base md:text-lg text-black/80 dark:text-slate-300 leading-relaxed max-w-4xl transition-opacity duration-300 font-medium">
                {node ? node.body : "Upload a resume and paste a job URL — five MCP AI tools run in parallel, delivering ATS scores, interview questions, skill gaps, and a cover letter in seconds."}
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-[10px] font-bold text-black/40 dark:text-slate-600 tracking-widest uppercase">
            THE MOVING SIGNAL TRACES DATA THROUGH THE SYSTEM — 光點即資料的系統路徑
          </p>
        </Reveal>
      </div>
    </section>
  );
}
