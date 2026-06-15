"use client";

import { Zap } from "lucide-react";

const MARQUEE = [
  "FILE PARSING", "URL EXTRACTION", "ATS SCORING", "KEYWORD MATCHING", 
  "SKILL GAP ANALYSIS", "INTERVIEW GENERATOR", "COVER LETTER WRITER", "LINKEDIN AUDIT"
];

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE];
  
  return (
    <div className="border-y-2 dark:border-y border-black dark:border-cyan-900/40 bg-neo-pink dark:bg-[#060a12] py-4 overflow-hidden" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span key={i} className="font-mono text-xs font-bold tracking-[0.3em] text-black dark:text-cyan-600 mx-10 flex items-center gap-10 whitespace-nowrap">
            {m}
            <Zap className="text-black dark:text-cyan-800 w-4 h-4" strokeWidth={3} />
          </span>
        ))}
      </div>
    </div>
  );
}
