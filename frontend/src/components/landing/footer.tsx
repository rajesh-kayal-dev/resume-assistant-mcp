"use client";

import { Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 py-12 bg-white dark:bg-[#04060a]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-xs tracking-[0.25em] text-slate-500 dark:text-cyan-500">
          YOU UPLOAD THE DATA; WE BUILD THE TIDE.
        </div>
        <div className="font-mono text-xs text-slate-400 dark:text-slate-600 tracking-wider flex items-center gap-2">
          <Cpu className="text-slate-300 dark:text-cyan-700 w-4 h-4" />
          RESUME AI v1.0 · MCP INTEGRATION · © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
