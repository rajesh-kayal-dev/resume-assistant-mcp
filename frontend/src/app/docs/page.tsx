"use client";

import { useState } from "react";
import { ChevronRight, Globe, Database, FileText, Waves, List, Play, ExternalLink, Copy, Check, ShieldAlert, Timer, ThumbsUp, ThumbsDown, Link as LinkIcon, ArrowUpRight, Zap } from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("node");
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = () => {
    setFeedbackGiven(true);
    setTimeout(() => setFeedbackGiven(false), 3000);
  };

  const getCode = () => {
    if (activeTab === "curl") {
      return [
        'curl -X POST "http://localhost:3000/api/analyze" \\',
        '  -H "Authorization: Bearer $API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        "  -d '{",
        '    "resumePath": "/path/to/resume.pdf",',
        '    "jobDescriptionUrl": "https://example.com/job",',
        '    "stream": true',
        "  }'"
      ].join("\n");
    }
    if (activeTab === "node") {
      return [
        'import { ResumeClient } from "@resume-ai/sdk";',
        '',
        'const client = new ResumeClient({ apiKey: process.env.API_KEY });',
        '',
        'const analysis = await client.analyze({',
        '  resumePath: "/path/to/resume.pdf",',
        '  jobDescriptionUrl: "https://example.com/job",',
        '  stream: true,',
        '  onStream: (chunk) => process.stdout.write(chunk)',
        '});',
        '',
        'console.log(analysis.atsScore);'
      ].join("\n");
    }
    if (activeTab === "python") {
      return [
        'from resume_ai import ResumeClient',
        '',
        'client = ResumeClient(api_key="your-api-key")',
        '',
        'response = client.analyze(',
        '    resume_path="/path/to/resume.pdf",',
        '    job_url="https://example.com/job",',
        '    stream=True',
        ')',
        '',
        'for chunk in response:',
        '    print(chunk, end="")'
      ].join("\n");
    }
    return "";
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <a href="/docs" className="hover:text-zinc-300 transition">Docs</a>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <a href="/" className="hover:text-zinc-300 transition">MCP Server</a>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <span className="text-zinc-400">Analysis Endpoint</span>
      </div>

      {/* Title */}
      <div id="quickstart" className="ring-1 ring-white/10 md:p-6 bg-zinc-950/40 rounded-xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="">
            <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tight font-semibold text-zinc-50">
              Analysis API
            </h1>
            <p className="mt-2 text-sm md:text-base text-zinc-400 max-w-2xl">
              Extract keywords, calculate ATS score, generate interview questions, and build cover letters using the centralized MCP toolkit.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <Globe className="h-3.5 w-3.5 text-zinc-400" /> Web parsing
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <Database className="h-3.5 w-3.5 text-zinc-400" /> LLM execution
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <FileText className="h-3.5 w-3.5 text-zinc-400" /> PDF parsing
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <Waves className="h-3.5 w-3.5 text-zinc-400" /> SSE streaming
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <a href="#parameters" className="rounded-md bg-zinc-900/70 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center gap-2">
              <List className="h-4 w-4" />
              Endpoints
            </a>
            <a href="/app" className="hover:bg-indigo-500 transition inline-flex items-center gap-2 text-xs text-white bg-indigo-600/90 rounded-md pt-2 pr-3 pb-2 pl-3">
              Try <Play className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Quickstart Steps */}
      <div className="ring-1 ring-white/10 md:p-6 bg-zinc-950/40 rounded-xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl tracking-tight font-semibold text-zinc-100">Quickstart</h2>
          <a href="#quickstart" className="text-xs text-zinc-400 hover:text-zinc-200 transition inline-flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" /> Full guide
          </a>
        </div>
        <ol className="mt-4 space-y-3">
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30 grid place-items-center text-[11px] font-medium shrink-0">1</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-200">Start the MCP Server</div>
              <div className="text-sm text-zinc-400">Run <code className="bg-zinc-800 px-1 py-0.5 rounded">npm start</code> in your backend directory to initialize the tools.</div>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30 grid place-items-center text-[11px] font-medium shrink-0">2</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-200">Make your analysis query</div>
              <div className="text-sm text-zinc-400">Send a POST request to the analyzer endpoint with a resume path and job URL.</div>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30 grid place-items-center text-[11px] font-medium shrink-0">3</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-200">Stream the results</div>
              <div className="text-sm text-zinc-400">Use SSE to receive incremental JSON patches containing ATS scores and feedback.</div>
            </div>
          </li>
        </ol>
      </div>

      {/* Code Samples with Tabs */}
      <div className="ring-1 ring-white/10 overflow-hidden bg-zinc-950/40 rounded-xl backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-zinc-200">Analysis request</h3>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setActiveTab("curl")} className={"rounded-md px-2.5 py-1.5 text-xs ring-1 ring-white/10 transition " + (activeTab === "curl" ? "bg-zinc-900 text-white" : "text-zinc-300 hover:text-white hover:bg-zinc-900/70")}>cURL</button>
            <button onClick={() => setActiveTab("node")} className={"rounded-md px-2.5 py-1.5 text-xs ring-1 ring-white/10 transition " + (activeTab === "node" ? "bg-zinc-900 text-white" : "text-zinc-300 hover:text-white hover:bg-zinc-900/70")}>Node</button>
            <button onClick={() => setActiveTab("python")} className={"rounded-md px-2.5 py-1.5 text-xs ring-1 ring-white/10 transition " + (activeTab === "python" ? "bg-zinc-900 text-white" : "text-zinc-300 hover:text-white hover:bg-zinc-900/70")}>Python</button>
          </div>
        </div>
        <div className="border-t border-white/5 relative">
          <pre className="m-0 p-0">
            <code className="block overflow-x-auto text-[12.5px] leading-6 bg-zinc-950 p-4 md:p-5 text-zinc-200 whitespace-pre-wrap">
              {getCode()}
            </code>
          </pre>
          <button 
            onClick={() => handleCopy(getCode())}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white hover:ring-indigo-500/40 transition"
          >
            {copied ? <><Check className="h-3.5 w-3.5 text-emerald-300" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        </div>
        <div className="flex border-white/5 border-t pt-3 pr-4 pb-3 pl-4 items-center justify-between">
          <div className="text-xs text-zinc-400">
            Tip: Always use streaming for processing files to prevent timeout errors.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 text-emerald-300 px-2 py-1 text-[11px] ring-1 ring-emerald-400/20">
              <Zap className="h-3.5 w-3.5" /> Fast
            </span>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div id="parameters" className="ring-1 ring-white/10 md:p-6 bg-zinc-950/40 rounded-xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
        <h3 className="text-xl tracking-tight font-semibold text-zinc-100">Parameters</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">resumePath</div>
              <span className="text-[11px] text-zinc-400">string</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">The absolute path or URL to the target resume file (PDF/DOCX).</p>
          </div>
          <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">jobDescriptionUrl</div>
              <span className="text-[11px] text-zinc-400">string</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">The URL of the target job posting to analyze against.</p>
          </div>
          <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">stream</div>
              <span className="text-[11px] text-zinc-400">boolean</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Return results incrementally using Server-Sent Events.</p>
          </div>
          <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">includeCoverLetter</div>
              <span className="text-[11px] text-zinc-400">boolean</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Optional. Generates a targeted cover letter based on analysis.</p>
          </div>
        </div>
      </div>

      {/* Citations / Sources */}
      <div id="citations" className="ring-1 ring-white/10 md:p-6 bg-zinc-950/40 rounded-xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl tracking-tight font-semibold text-zinc-100">Related Tools</h3>
          <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 transition">
            <LinkIcon className="h-3.5 w-3.5" /> View schema
          </a>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="#" className="group rounded-lg bg-zinc-900/50 ring-1 ring-white/10 p-3 hover:ring-indigo-500/40 hover:bg-zinc-900/70 transition">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">
                Playwright MCP Integration
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </div>
            <p className="mt-1 text-xs text-zinc-400 truncate">How the system parses complex job description pages.</p>
          </a>
          <a href="#" className="group rounded-lg bg-zinc-900/50 ring-1 ring-white/10 p-3 hover:ring-indigo-500/40 hover:bg-zinc-900/70 transition">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-200">
                PDF Extraction Scripts
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </div>
            <p className="mt-1 text-xs text-zinc-400 truncate">Handling various resume formats and encodings.</p>
          </a>
        </div>
      </div>

      {/* Errors & Troubleshooting */}
      <details id="errors" className="rounded-xl bg-zinc-950/40 ring-1 ring-white/10 open:shadow-inner">
        <summary className="cursor-pointer flex pt-4 pr-5 pb-4 pl-5 backdrop-blur-md items-center justify-between">
          <div className="text-xl tracking-tight font-semibold text-zinc-100">Errors &amp; Troubleshooting</div>
          <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
              <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                Parsing Failed
              </div>
              <p className="mt-1 text-sm text-zinc-400">Usually happens when the provided PDF is an image scan rather than text.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
              <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Timer className="h-4 w-4 text-rose-400" />
                Connection Timeout
              </div>
              <p className="mt-1 text-sm text-zinc-400">The LLM took too long to respond. Enable streaming to prevent this.</p>
            </div>
          </div>
        </div>
      </details>

      {/* Feedback */}
      <div className="ring-1 ring-white/10 md:p-6 bg-zinc-950/40 rounded-xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-200">Was this page helpful?</div>
            <div className="text-xs text-zinc-500">Your feedback improves our docs experience.</div>
          </div>
          <div className="flex items-center gap-2">
            {feedbackGiven ? (
              <span className="text-sm text-emerald-400 font-medium">Thanks for your feedback!</span>
            ) : (
              <>
                <button onClick={handleFeedback} className="rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:ring-emerald-400/40 transition inline-flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Yes
                </button>
                <button onClick={handleFeedback} className="rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:ring-rose-400/40 transition inline-flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4" />
                  No
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 pb-8">
        <div className="text-xs text-zinc-500">Last updated 2 days ago • v1.4</div>
      </div>
    </>
  );
}
