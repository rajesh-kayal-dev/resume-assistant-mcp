"use client";

import { useState, useEffect } from "react";
import { Reveal } from "@/components/template/reveal";
import { useTypewriter } from "@/hooks/use-template";
import { ArrowDown, CheckSquare, Code2, Database } from "lucide-react";
import { motion } from "framer-motion";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { Meteors } from "@/components/magicui/meteors";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

const TYPE_PHRASES = [
  "ANALYZING RESUME STRUCTURE...",
  "EXTRACTING KEYWORDS...",
  "MATCHING ATS REQUIREMENTS...",
  "GENERATING INTERVIEW QUESTIONS...",
  "OPTIMIZING LINKEDIN PROFILE...",
];

export function Hero() {
  const typed = useTypewriter(TYPE_PHRASES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden bg-neo-bg dark:bg-transparent transition-colors duration-300">
      
      {/* Magic UI Dynamic Backgrounds */}
      <RetroGrid className="z-0" />
      {mounted && <Meteors number={20} />}

      {/* Dynamic Background Elements */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Light mode radial glow */}
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,138,235,0.15), transparent 70%)",
            }}
          />
          {/* Dark mode radial glow */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(34,211,238,0.10), transparent 70%)",
            }}
          />
          
          {/* Floating Brutalist Shapes */}
          <motion.div 
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-[10%] w-20 h-20 brutal-border bg-neo-yellow hidden lg:flex items-center justify-center brutal-shadow dark:border-cyan-500/30 dark:bg-cyan-950/20 dark:shadow-none"
          >
            <Code2 size={32} className="text-black dark:text-cyan-500 opacity-50" strokeWidth={1.5} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 right-[12%] w-24 h-24 brutal-border bg-neo-pink rounded-full hidden lg:flex items-center justify-center brutal-shadow dark:border-cyan-400/30 dark:bg-cyan-900/20 dark:shadow-none"
          >
            <Database size={32} className="text-black dark:text-cyan-400 opacity-50" strokeWidth={1.5} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-[5%] w-12 h-12 brutal-border bg-white hidden lg:flex items-center justify-center brutal-shadow dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <CheckSquare size={20} className="text-black/50 dark:text-slate-600" />
          </motion.div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full text-center z-10">
        <Reveal>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 font-mono text-xs tracking-widest text-black dark:text-cyan-300 brutal-border bg-neo-yellow dark:bg-cyan-950/30 px-5 py-2.5 mb-10 brutal-shadow cursor-default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-neo-pink dark:bg-cyan-400 animate-pulse border-2 border-black dark:border-none" />
            ATS OPTIMIZATION · LIVE PREVIEW · 100% PRIVATE
          </motion.div>
        </Reveal>
        
        <Reveal delay={120}>
          <h1 className="hero-title text-6xl md:text-8xl lg:text-[130px] font-musashi font-normal tracking-wide text-black dark:text-white leading-[1.05] mb-6">
            Everything<br />
            <motion.span 
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="text-neo-pink dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-300 dark:via-teal-200 dark:to-cyan-400"
              style={{ WebkitTextStroke: "3px #000", WebkitTextFillColor: "var(--color-neo-pink)", backgroundSize: "200% auto" }}
            >
              analyzed.
            </motion.span><br />
            In seconds.
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 font-mono text-sm md:text-base text-neo-pink dark:text-cyan-300 h-8 tracking-widest font-bold">
            <span className="text-black/30 dark:text-slate-600 mr-3">&gt;</span>
            {typed}
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-3 h-5 bg-black dark:bg-cyan-400 ml-1 inline-block align-middle" 
            />
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-black/70 dark:text-slate-400 leading-relaxed font-medium bg-white/50 dark:bg-[#04060a]/50 backdrop-blur-sm p-4 rounded-sm border border-black/5 dark:border-slate-800">
            A comprehensive resume analysis system — keyword matching, skill gap detection, interview prep, and cover letter generation. Powered by 8 concurrent MCP tools.
          </p>
        </Reveal>

        <Reveal delay={420}>
          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
            <LinkTo href="/app">
              <ShimmerButton 
                shimmerColor="#ffdf00" 
                background="var(--color-neo-pink)" 
                className="w-full sm:w-auto font-mono text-sm tracking-widest font-black brutal-border brutal-shadow hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all dark:border-cyan-400 dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] dark:bg-[#04060a] !text-black dark:!text-cyan-300"
                style={{ "--bg": "var(--color-neo-pink)" } as React.CSSProperties}
              >
                START ANALYSIS
              </ShimmerButton>
            </LinkTo>
            
            <a href="#pipeline">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 2 }}
                className="w-full sm:w-auto font-mono text-sm tracking-widest px-10 py-[14px] bg-white dark:bg-transparent text-black dark:text-slate-300 font-bold brutal-border brutal-shadow hover:bg-slate-50 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3"
              >
                EXPLORE PIPELINE
                <ArrowDown size={18} strokeWidth={2.5} />
              </motion.button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LinkTo({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>;
}
