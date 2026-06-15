"use client";

import { useAppStore } from "@/store/useAppStore";
import { AppSidebar } from "@/components/analyzer/app-sidebar";
import { useRouter } from "next/navigation";
import { History as HistoryIcon, Eye, Trash2, FolderOpen } from "lucide-react";

export default function HistoryPage() {
  const { history, deleteFromHistory, loadFromHistory } = useAppStore();
  const router = useRouter();

  const handleView = (id: string) => {
    loadFromHistory(id);
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen grid-bg bg-white dark:bg-transparent transition-colors duration-300">
      <AppSidebar />
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Header */}
        <div className="px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-[#060a12] h-16 transition-colors">
          <div className="flex items-center gap-3">
            <HistoryIcon size={18} className="text-slate-400 dark:text-slate-500" />
            <div>
              <h1 className="font-mono text-sm tracking-widest text-slate-900 dark:text-white">HISTORY</h1>
              <p className="text-[10px] font-mono text-slate-500">Previous analyses and resume versions</p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-8 lg:p-10 max-w-5xl">
          {history.length === 0 ? (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] p-16 text-center shadow-sm dark:shadow-none">
              <div className="flex justify-center mb-6">
                <FolderOpen size={48} strokeWidth={1} className="text-slate-300 dark:text-slate-800" />
              </div>
              <h2 className="font-mono text-sm tracking-widest mb-2 text-slate-900 dark:text-white">NO HISTORY YET</h2>
              <p className="text-sm mx-auto mb-8 max-w-md leading-relaxed text-slate-500">
                Run your first analysis to see results appear here. Your data is stored locally in your browser.
              </p>
              <button onClick={() => router.push("/app")} 
                className="font-mono text-xs tracking-widest px-7 py-3.5 bg-slate-900 dark:bg-cyan-400 text-white dark:text-[#04060a] font-medium hover:bg-slate-800 dark:hover:bg-cyan-300 shadow-md dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
                RUN FIRST ANALYSIS
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#03050a] overflow-hidden shadow-sm dark:shadow-none">
              {/* Table header */}
              <div className="grid grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_120px_100px_120px] divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c14]">
                {["RESUME", "TARGET JOB", "DATE", "ATS", "ACTIONS"].map((h) => (
                  <div
                    key={h}
                    className="px-5 py-3 font-mono text-[10px] tracking-widest text-slate-600 dark:text-cyan-500"
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              <div className="divide-y divide-slate-200 dark:divide-slate-900 bg-white dark:bg-[#04060a]">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_120px_100px_120px] divide-x divide-slate-200 dark:divide-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="px-5 py-4 font-mono text-xs truncate flex items-center text-slate-800 dark:text-slate-300">
                      {item.resumeName}
                    </div>
                    <div className="px-5 py-4 font-mono text-xs truncate flex items-center text-slate-600 dark:text-slate-500">
                      {item.jobTitle}
                    </div>
                    <div className="px-5 py-4 font-mono text-[10px] flex items-center text-slate-500 dark:text-slate-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="px-5 py-4 flex items-center">
                      <span
                        className="font-mono text-[10px] font-bold px-2 py-0.5 border rounded-sm"
                        style={{
                          background: item.atsScore >= 75 ? "rgba(52,211,153,0.1)" : item.atsScore >= 50 ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)",
                          borderColor: item.atsScore >= 75 ? "rgba(52,211,153,0.5)" : item.atsScore >= 50 ? "rgba(251,191,36,0.5)" : "rgba(248,113,113,0.5)",
                          color: item.atsScore >= 75 ? "#10b981" : item.atsScore >= 50 ? "#f59e0b" : "#ef4444",
                        }}
                      >
                        {item.atsScore}%
                      </span>
                    </div>
                    <div className="px-5 py-3 flex items-center gap-4">
                      <button
                        onClick={() => handleView(item.id)}
                        className="font-mono text-[10px] tracking-widest transition-colors hover:text-slate-900 dark:hover:text-cyan-400 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
                        title="View Results"
                      >
                        <Eye size={12} /> VIEW
                      </button>
                      <button
                        onClick={() => deleteFromHistory(item.id)}
                        className="font-mono text-[10px] tracking-widest transition-colors hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 text-slate-400 dark:text-slate-600"
                        title="Delete"
                      >
                        <Trash2 size={12} /> DEL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
