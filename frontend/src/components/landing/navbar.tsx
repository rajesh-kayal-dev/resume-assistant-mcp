"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { ThemeToggle } from "@/components/template/theme-toggle";

const NAV_LINKS = [
  { label: "MODULES", href: "#modules" },
  { label: "WHY", href: "#why" },
  { label: "SYSTEM", href: "#pipeline" },
  { label: "PLATFORM", href: "#results" },
  { label: "DOCS", href: "/docs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white dark:bg-[#04060a]/85 backdrop-blur-md border-b-2 dark:border-b border-black dark:border-cyan-900/40" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="ResuMate MCP Logo" className="w-8 h-8 object-contain" />
          <span className="font-mono font-bold tracking-widest text-black dark:text-white text-lg">RESUMATE MCP</span>
          <span className="hidden sm:inline font-mono text-xs text-black/50 dark:text-slate-500 tracking-wider">mcp-powered analysis</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((n) => (
            <a key={n.label} href={n.href}
              className="font-mono text-[11px] font-bold tracking-[0.2em] text-black/60 dark:text-slate-400 hover:text-neo-pink dark:hover:text-cyan-300 transition-colors">
              {n.label}
            </a>
          ))}
          <ThemeToggle />
          <Link href="/app"
            className="font-mono text-xs font-bold tracking-widest px-5 py-2.5 bg-white dark:bg-transparent text-black dark:text-cyan-300 brutal-border brutal-shadow hover:bg-slate-50 hover:translate-y-[2px] hover:shadow-none dark:hover:bg-cyan-500/10 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all">
            START ANALYSIS
          </Link>
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
