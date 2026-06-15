import { Search, GitBranch, ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/docs/sidebar";
import { RightRail } from "@/components/docs/right-rail";
import Link from "next/link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 min-h-screen">
      {/* Spline Background */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <iframe 
          src="https://my.spline.design/3dgradient-AcpgG6LxFkpnJSoowRHPfcbO" 
          frameBorder="0" 
          width="100%" 
          height="100%"
        />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/75 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-md bg-gradient-to-b from-zinc-800 to-zinc-900 ring-1 ring-white/10 grid place-items-center">
                <span className="text-[11px] tracking-tight font-semibold text-zinc-50">PX</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">Docs</span>
            </Link>

            {/* Search */}
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-zinc-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search docs, endpoints, guides..." 
                  className="w-full rounded-lg bg-zinc-900/80 text-sm pl-9 pr-24 h-10 outline-none ring-1 ring-white/10 focus:ring-indigo-500/40 focus:outline-none placeholder:text-zinc-500 transition text-zinc-100"
                />
                <div className="absolute inset-y-0 right-2 hidden sm:flex items-center gap-1">
                  <span className="text-[11px] text-zinc-500">to search</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              <details className="relative group">
                <summary className="list-none cursor-pointer">
                  <div className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    v1.4
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-lg bg-zinc-950 ring-1 ring-white/10 shadow-xl p-1 z-50 hidden group-open:block">
                  <a className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition" href="#">
                    v1.4 <span className="text-[10px] text-emerald-400/90">Latest</span>
                  </a>
                  <a className="block rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition" href="#">v1.3</a>
                </div>
              </details>
              <a href="#" className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                API Ref
              </a>
              <a href="#" className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Changelog
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10 grid grid-cols-12 gap-6 relative">
        <Sidebar />
        <section className="col-span-12 lg:col-span-6 space-y-6">
          {children}
        </section>
        <RightRail />
      </main>
    </div>
  );
}
