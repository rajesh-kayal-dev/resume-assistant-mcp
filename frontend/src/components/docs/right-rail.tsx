import { Info, ArrowRight, Share2, Rss } from "lucide-react";

export function RightRail() {
  return (
    <aside className="hidden xl:block col-span-3">
      <div className="sticky top-20 space-y-6">
        {/* On this page */}
        <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-md">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">On this page</div>
          <nav className="space-y-2 text-sm">
            <a href="#quickstart" className="block text-zinc-300 hover:text-white transition">Quickstart</a>
            <a href="#parameters" className="block text-zinc-300 hover:text-white transition">Parameters</a>
            <a href="#citations" className="block text-zinc-300 hover:text-white transition">Citations</a>
            <a href="#errors" className="block text-zinc-300 hover:text-white transition">Errors</a>
          </nav>
        </div>

        {/* Callouts */}
        <div className="ring-1 ring-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-300" />
            <div className="">
              <div className="text-sm font-medium text-zinc-200">SDKs</div>
              <p className="text-sm text-zinc-400 mt-1">Use our typed SDKs for Node and Python with built-in streaming helpers.</p>
              <div className="mt-2 flex items-center gap-2">
                <a href="#parameters" className="text-xs text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1">
                  <ArrowRight className="h-3.5 w-3.5" /> Explore SDKs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full ring-1 ring-white/10 bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">RA</div>
            <div className="">
              <div className="text-sm font-medium text-zinc-200">Maintainer</div>
              <div className="text-xs text-zinc-500">docs@resume-ai.com</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <a href="https://twitter.com/intent/tweet?text=Check%20out%20Resume%20AI%20Docs!" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900/70 px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white hover:ring-indigo-500/40 transition">
              <Share2 className="h-3.5 w-3.5" /> Share
            </a>
            <a href="https://github.com/your-username/resume-assistant-mcp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900/70 px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white hover:ring-indigo-500/40 transition">
              <Rss className="h-3.5 w-3.5" /> Subscribe
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
