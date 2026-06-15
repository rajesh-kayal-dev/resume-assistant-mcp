"use client";

import { Reveal, SectionHead } from "@/components/template/reveal";
import { CheckCircle } from "lucide-react";

const RESULTS_PREVIEW = [
  { key: "ATS SCORE",    spec: "Keyword match % vs job description",          detail: "Color-coded matched and missing keyword tags" },
  { key: "IMPROVEMENTS", spec: "Word count · Contact info · Action verbs",    detail: "Specific, actionable tips to strengthen your resume" },
  { key: "INTERVIEW",    spec: "Technical questions + HR behavioral questions", detail: "Generated from matched and missing skills in the job" },
  { key: "SKILL GAP",   spec: "Phase-based learning roadmap",                 detail: "Prioritized list of skills to acquire for this role" },
  { key: "COVER LETTER", spec: "Personalized template using matched keywords",  detail: "Ready to copy, paste, and customize" },
  { key: "LINKEDIN",     spec: "Headline · Summary · General profile tips",    detail: "Only shown when LinkedIn profile text is provided" },
];

export function ResultsPreview() {
  return (
    <section
      id="results"
      className="py-28"
      style={{ background: "#f4f4f0", borderTop: "1px solid rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="04 / RESULTS"
          title="Six panels. One analysis."
          subtitle="Everything you need to land the role"
          intro="Every result is generated specifically for your resume against the target job description. No generic advice — all context-aware output from 8 specialized MCP tools."
        />

        <Reveal>
          {/* Terminal-style spec table — matches TIDE Platform section */}
          <div
            style={{
              border: "1px solid #000",
              background: "#fff",
              boxShadow: "6px 6px 0 #000",
            }}
          >
            {/* Terminal title bar */}
            <div
              style={{
                background: "#ffc900",
                borderBottom: "1px solid #000",
                padding: "0.625rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {["#dc2626", "#f59e0b", "#22c55e"].map((c) => (
                  <span
                    key={c}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "9999px",
                      background: c,
                      border: "1px solid rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
                <span
                  className="ml-2 font-mono text-xs font-bold"
                  style={{ color: "#000" }}
                >
                  resume-ai — analysis.results
                </span>
              </div>
              <span className="font-mono text-xs flex items-center gap-1.5 font-bold" style={{ color: "#000" }}>
                <span className="status-dot online" />
                READY
              </span>
            </div>

            {/* Rows */}
            <div>
              {RESULTS_PREVIEW.map((p, i) => (
                <Reveal key={p.key} delay={i * 60}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "180px 1fr",
                      borderBottom: i < RESULTS_PREVIEW.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8fe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      className="font-mono text-xs tracking-widest font-bold pt-0.5 px-5 py-5"
                      style={{ color: "#000" }}
                    >
                      {p.key}
                    </div>
                    <div className="px-5 py-5" style={{ borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
                      <div className="font-mono text-xs md:text-sm font-semibold" style={{ color: "#000" }}>
                        {p.spec}
                      </div>
                      <div className="mt-1.5 text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>
                        {p.detail}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
