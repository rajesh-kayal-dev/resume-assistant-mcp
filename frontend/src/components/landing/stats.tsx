"use client";

import { Reveal } from "@/components/template/reveal";
import { useCountUp, useInView } from "@/hooks/use-template";

const STATS = [
  { value: 8, suffix: "", label: "MCP TOOLS", zh: "Concurrent specialized agents" },
  { value: 30, suffix: "s", label: "ANALYSIS TIME", zh: "Average turnaround time" },
  { value: 100, suffix: "%", label: "LOCAL", zh: "Privacy guaranteed" },
];

function StatItem({ stat, start, delay }: { stat: any; start: boolean; delay: number }) {
  const v = useCountUp(stat.value, start);
  return (
    <Reveal delay={delay} className="text-center">
      <div className="font-mono text-6xl md:text-7xl font-semibold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-cyan-200 dark:to-cyan-500">
        {v}{stat.suffix}
      </div>
      <div className="mt-3 font-mono text-xs tracking-widest text-slate-500 dark:text-slate-400">{stat.label}</div>
      <div className="mt-1 text-xs text-slate-400 dark:text-slate-600">{stat.zh}</div>
    </Reveal>
  );
}

export function Stats() {
  const [ref, visible] = useInView(0.3);
  return (
    <section ref={ref as any} className="py-24 border-b border-slate-200 dark:border-slate-900">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} start={visible} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
