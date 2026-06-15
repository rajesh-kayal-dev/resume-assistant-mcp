"use client";

import { useState, useEffect } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-cyan-950/40">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 to-teal-300 transition-[width] duration-100"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  );
}
