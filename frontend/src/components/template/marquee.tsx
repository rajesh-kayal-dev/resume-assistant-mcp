"use client";

import { Zap } from "lucide-react";

interface MarqueeStripProps {
  items: string[];
}

export function MarqueeStrip({ items }: MarqueeStripProps) {
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
        background: "#ff90e8",
        padding: "0.875rem 0",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {doubled.map((m, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-[0.28em] mx-8 flex items-center gap-6 whitespace-nowrap"
            style={{ color: "#000", fontWeight: 700 }}
          >
            {m}
            <Zap size={10} strokeWidth={3} style={{ color: "rgba(0,0,0,0.4)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}
