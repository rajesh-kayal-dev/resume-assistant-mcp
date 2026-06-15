"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-cyan-900/40 p-1 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full shadow-sm flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          x: isDark ? 28 : 0,
          backgroundColor: isDark ? "#04060a" : "#ffffff",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
            x: isDark ? -2 : -10,
            y: isDark ? -2 : -10,
          }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 rounded-full bg-cyan-400 absolute"
        />
        {/* Sun dot */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="w-2 h-2 rounded-full bg-slate-300"
        />
      </motion.div>
    </button>
  );
}
