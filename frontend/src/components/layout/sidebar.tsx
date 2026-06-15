"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileSearch, History, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analyze", href: "/analyze", icon: FileSearch },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r border-white/10 flex flex-col h-full relative z-20">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/ResumeAnylizerMCPLOgo.png" 
              alt="Resume AI Logo" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="font-bold text-lg tracking-tight">Resume AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-xl glass bg-gradient-to-br from-primary/10 to-transparent">
          <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">Unlock unlimited parses and advanced AI insights.</p>
          <button className="w-full text-xs font-medium bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
