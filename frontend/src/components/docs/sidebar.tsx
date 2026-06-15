import { MessageSquare, Sparkles, Rocket, KeyRound, Zap, Search, Waves, Shuffle, Puzzle, Lock, FolderCog } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        {/* Profile / Context */}
        <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl pt-3 pr-3 pb-3 pl-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full ring-1 ring-white/10 bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">RA</div>
            <div>
              <div className="text-sm font-medium text-zinc-200 tracking-tight">Docs Assistant</div>
              <div className="text-xs text-zinc-500">Ask questions, get examples</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/app" className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center justify-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Quick Q&A
            </Link>
            <Link href="/docs#quickstart" className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center justify-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Examples
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="ring-1 ring-white/10 divide-y divide-white/5 bg-zinc-950/40 rounded-xl backdrop-blur-md">
          <div className="p-3">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Getting Started</div>
            <div className="space-y-1">
              <Link href="/docs" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Rocket className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Overview
              </Link>
              <Link href="#quickstart" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <KeyRound className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Installation
              </Link>
              <Link href="#parameters" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Zap className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Configuration
              </Link>
            </div>
          </div>

          <div className="p-3">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">MCP Tools</div>
            <div className="space-y-1">
              <Link href="#quickstart" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Resume Analysis
              </Link>
              <Link href="#parameters" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <MessageSquare className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Interview Prep
              </Link>
              <Link href="#citations" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Waves className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Cover Letter
              </Link>
              <Link href="#citations" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Shuffle className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                LinkedIn Optimization
              </Link>
            </div>
          </div>

          <div className="p-3">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Guides</div>
            <div className="space-y-1">
              <Link href="#errors" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Puzzle className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Custom Prompts
              </Link>
              <Link href="#errors" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <Lock className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Data Privacy
              </Link>
              <Link href="#errors" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition">
                <FolderCog className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                Deploying Claude
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
