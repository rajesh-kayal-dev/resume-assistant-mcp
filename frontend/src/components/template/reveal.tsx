"use client";

import { useInView } from "@/hooks/use-template";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref as any}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface SectionHeadProps {
  tag: string;
  en: string;
  zh?: string;
  intro?: string;
}

export function SectionHead({ tag, en, zh, intro }: SectionHeadProps) {
  return (
    <Reveal className="mb-14">
      <div className="font-mono text-xs text-cyan-400 tracking-widest mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-cyan-400/60" />
        {tag}
      </div>
      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">{en}</h2>
      {zh && <p className="mt-2 text-base text-cyan-200/70">{zh}</p>}
      {intro && <p className="mt-5 max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed">{intro}</p>}
    </Reveal>
  );
}
