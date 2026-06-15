"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, ScanLine, History, Home } from "lucide-react";
import { ThemeToggle } from "@/components/template/theme-toggle";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-[#04060a] flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-900">
        <Link href="/" className="flex items-center gap-2 group">
          <Cpu className="text-slate-800 dark:text-cyan-400 w-5 h-5 transition-colors" />
          <span className="font-mono font-semibold tracking-widest text-slate-900 dark:text-white transition-colors">RESUME AI</span>
        </Link>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2">
        <Link 
          href="/app" 
          className={`px-6 py-3 flex items-center gap-3 transition-colors font-mono text-xs tracking-widest ${
            pathname === "/app" 
              ? "bg-white dark:bg-cyan-950/20 text-slate-900 dark:text-cyan-300 border-r-2 border-slate-900 dark:border-cyan-400 shadow-sm dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-white/50 dark:hover:bg-slate-900/50"
          }`}
        >
          <ScanLine size={16} />
          ANALYZE
        </Link>
        <Link 
          href="/history" 
          className={`px-6 py-3 flex items-center gap-3 transition-colors font-mono text-xs tracking-widest ${
            pathname === "/history" 
              ? "bg-white dark:bg-cyan-950/20 text-slate-900 dark:text-cyan-300 border-r-2 border-slate-900 dark:border-cyan-400 shadow-sm dark:shadow-none" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-white/50 dark:hover:bg-slate-900/50"
          }`}
        >
          <History size={16} />
          HISTORY
        </Link>
        <Link 
          href="/" 
          className="px-6 py-3 flex items-center gap-3 transition-colors font-mono text-xs tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-white/50 dark:hover:bg-slate-900/50 mt-auto mb-4"
        >
          <Home size={16} />
          HOME
        </Link>
      </nav>

      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-500 dark:text-cyan-400">MCP SERVER</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate">
            localhost:8080
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
