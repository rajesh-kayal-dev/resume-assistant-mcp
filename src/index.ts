import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { z } from "zod";
import chalk from "chalk";
import { parseResumeLocal, parseResumeLocalSchema } from "./tools/parse-resume-local.js";
import { fetchJobDescription, fetchJobDescriptionSchema } from "./tools/fetch-job-description.js";
import { calculateAtsMatch, calculateAtsMatchSchema } from "./tools/calculate-ats-match.js";
import { generateInterviewQuestions, generateInterviewQuestionsSchema } from "./tools/generate-interview-questions.js";
import { getResumeImprovements, getResumeImprovementsSchema } from "./tools/get-resume-improvements.js";
import { generateCoverLetter, generateCoverLetterSchema } from "./tools/generate-cover-letter.js";
import { linkedinProfileOptimizer, linkedinProfileOptimizerSchema } from "./tools/linkedin-profile-optimizer.js";
import { skillGapAnalysis, skillGapAnalysisSchema } from "./tools/skill-gap-analysis.js";
import { analyzeCompany, analyzeCompanySchema } from "./tools/analyze-company.js";

// ============================================================================
// Dev Logging Utilities
// ============================================================================

const isDev = process.env.NODE_ENV !== "production";

function timestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function formatLatency(ms: number): string {
  if (ms < 100) return chalk.green(`${ms}ms`);
  if (ms < 500) return chalk.yellow(`${ms}ms`);
  return chalk.red(`${ms}ms`);
}

function truncate(str: string, maxLen = 60): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}

function logRequest(method: string, params?: unknown): void {
  if (!isDev) return;

  const paramsStr = params ? chalk.gray(` ${truncate(JSON.stringify(params))}`) : "";
  console.log(`${chalk.gray(`[${timestamp()}]`)} ${chalk.cyan("→")} ${method}${paramsStr}`);
}

function logResponse(method: string, result: unknown, latencyMs: number): void {
  if (!isDev) return;

  const latency = formatLatency(latencyMs);

  // For tool calls, show the result
  if (method === "tools/call" && result) {
    const resultStr = typeof result === "string" ? result : JSON.stringify(result);
    console.log(
      `${chalk.gray(`[${timestamp()}]`)} ${chalk.green("←")} ${truncate(resultStr)} ${chalk.gray(`(${latency})`)}`
    );
  } else {
    console.log(`${chalk.gray(`[${timestamp()}]`)} ${chalk.green("✓")} ${method} ${chalk.gray(`(${latency})`)}`);
  }
}

function logError(method: string, error: unknown, latencyMs: number): void {
  const latency = formatLatency(latencyMs);

  let errorMsg: string;
  if (error instanceof Error) {
    errorMsg = error.message;
  } else if (typeof error === "object" && error !== null) {
    // JSON-RPC error object has { code, message, data? }
    const rpcError = error as { message?: string; code?: number };
    errorMsg = rpcError.message || `Error ${rpcError.code || "unknown"}`;
  } else {
    errorMsg = String(error);
  }

  console.log(
    `${chalk.gray(`[${timestamp()}]`)} ${chalk.red("✖")} ${method} ${chalk.red(truncate(errorMsg))} ${chalk.gray(`(${latency})`)}`
  );
}

// ============================================================================
// MCP Server Setup
// ============================================================================

// Build a FRESH MCP server per request.
//
// In stateless streamable-HTTP mode the MCP SDK allows a Server to be connected
// to exactly ONE transport. Reusing a single module-scope instance throws
// "Already connected to a transport" on the second connection — and Cloud Run
// opens several (startup probe + real requests). So always create a new server
// (and a new transport) inside the request handler below.
function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "resume-assistant-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "parse_resume_local",
    {
      title: "Parse Resume Local",
      description: "Extract raw text from a local PDF, DOCX, TXT, or MD file.",
      inputSchema: {
        file_path: z.string().describe("Absolute or relative path to the local resume file (.pdf, .docx, .txt, .md)")
      },
    },
    async (args) => {
      const output = await parseResumeLocal(args.file_path);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "fetch_job_description",
    {
      title: "Fetch Job Description",
      description: "Scrape the raw text of a job posting from a URL.",
      inputSchema: {
        url: z.string().url().describe("The full URL of the job posting (e.g. LinkedIn, Greenhouse, Lever, etc.)")
      },
    },
    async (args) => {
      const output = await fetchJobDescription(args.url);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "calculate_ats_match",
    {
      title: "Calculate ATS Match",
      description: "Calculate keyword overlap and ATS match score.",
      inputSchema: {
        resume_text: z.string().describe("The raw parsed text of the candidate's resume"),
        job_text: z.string().describe("The raw text of the job description")
      },
    },
    async (args) => {
      const output = await calculateAtsMatch(args.resume_text, args.job_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "generate_interview_questions",
    {
      title: "Generate Interview Questions",
      description: "Generate technical and HR interview questions based on match results.",
      inputSchema: {
        resume_text: z.string().describe("The raw text of the candidate's resume"),
        job_text: z.string().describe("The raw text of the job description")
      },
    },
    async (args) => {
      const output = await generateInterviewQuestions(args.resume_text, args.job_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "get_resume_improvements",
    {
      title: "Get Resume Improvements",
      description: "Analyze resume content and provide actionable tips.",
      inputSchema: {
        resume_text: z.string().describe("The raw text of the candidate's resume")
      },
    },
    async (args) => {
      const output = await getResumeImprovements(args.resume_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "generate_cover_letter",
    {
      title: "Generate Cover Letter",
      description: "Generate a targeted cover letter template.",
      inputSchema: {
        resume_text: z.string().describe("The raw text of the candidate's resume"),
        job_text: z.string().describe("The raw text of the job description")
      },
    },
    async (args) => {
      const output = await generateCoverLetter(args.resume_text, args.job_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "linkedin_profile_optimizer",
    {
      title: "LinkedIn Profile Optimizer",
      description: "Analyze LinkedIn profile text and suggest improvements.",
      inputSchema: {
        linkedin_text: z.string().describe("The raw text copied from the candidate's LinkedIn profile, or their LinkedIn URL"),
        resume_text: z.string().optional().describe("The raw text of the candidate's resume, used as a fallback if a URL is provided")
      },
    },
    async (args) => {
      const output = await linkedinProfileOptimizer(args.linkedin_text, args.resume_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "skill_gap_analysis",
    {
      title: "Skill Gap Analysis",
      description: "Compare resume against job to identify missing skills and generate a learning roadmap.",
      inputSchema: {
        resume_text: z.string().describe("The raw text of the candidate's resume"),
        job_text: z.string().describe("The raw text of the job description")
      },
    },
    async (args) => {
      const output = await skillGapAnalysis(args.resume_text, args.job_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "analyze_company",
    {
      title: "Analyze Company",
      description: "Extract company details and research from the job description.",
      inputSchema: {
        job_text: z.string().describe("The raw text of the job description")
      },
    },
    async (args) => {
      const output = await analyzeCompany(args.job_text);
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  return server;
}

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();
app.use(express.json());

// Health check endpoint (required for Cloud Run)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

// MCP endpoint with dev logging
app.post("/mcp", async (req: Request, res: Response) => {
  const startTime = Date.now();
  const body = req.body;

  // Extract method and params from JSON-RPC request
  const method = body?.method || "unknown";
  const params = body?.params;

  // Log incoming request
  if (method === "tools/call") {
    const toolName = params?.name || "unknown";
    const toolArgs = params?.arguments;
    logRequest(`tools/call ${chalk.bold(toolName)}`, toolArgs);
  } else if (method !== "notifications/initialized") {
    logRequest(method, params);
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  // Capture response body for logging
  let responseBody = "";
  const originalWrite = res.write.bind(res) as typeof res.write;
  const originalEnd = res.end.bind(res) as typeof res.end;

  res.write = function (chunk: unknown, encodingOrCallback?: BufferEncoding | ((error: Error | null | undefined) => void), callback?: (error: Error | null | undefined) => void) {
    if (chunk) {
      responseBody += typeof chunk === "string" ? chunk : Buffer.from(chunk as ArrayBuffer).toString();
    }
    return originalWrite(chunk as string, encodingOrCallback as BufferEncoding, callback);
  };

  res.end = function (chunk?: unknown, encodingOrCallback?: BufferEncoding | (() => void), callback?: () => void) {
    if (chunk) {
      responseBody += typeof chunk === "string" ? chunk : Buffer.from(chunk as ArrayBuffer).toString();
    }

    // Log response
    if (method !== "notifications/initialized") {
      const latency = Date.now() - startTime;

      try {
        const rpcResponse = JSON.parse(responseBody) as { result?: unknown; error?: unknown };

        if (rpcResponse?.error) {
          logError(method, rpcResponse.error, latency);
        } else if (method === "tools/call") {
          const content = (rpcResponse?.result as { content?: Array<{ text?: string }> })?.content;
          const resultText = content?.[0]?.text;
          logResponse(method, resultText, latency);
        } else {
          logResponse(method, null, latency);
        }
      } catch {
        logResponse(method, null, latency);
      }
    }

    return originalEnd(chunk as string, encodingOrCallback as BufferEncoding, callback);
  };

  res.on("close", () => {
    transport.close();
  });

  // Fresh server instance per request (see createMcpServer above) — required for
  // stateless streamable-HTTP so a second connection never reuses a transport.
  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// JSON error handler (Express defaults to HTML errors)
app.use((_err: unknown, _req: Request, res: Response, _next: Function) => {
  res.status(500).json({ error: "Internal server error" });
});

// ============================================================================
// Start Server
// ============================================================================

const port = parseInt(process.env.PORT || "8080");
const httpServer = app.listen(port, () => {
  console.log();
  console.log(chalk.bold("MCP Server running on"), chalk.cyan(`http://localhost:${port}`));
  console.log(`  ${chalk.gray("Health:")} http://localhost:${port}/health`);
  console.log(`  ${chalk.gray("MCP:")}    http://localhost:${port}/mcp`);

  if (isDev) {
    console.log();
    console.log(chalk.gray("─".repeat(50)));
    console.log();
  }
});

// Graceful shutdown for Cloud Run (SIGTERM before kill)
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  httpServer.close(() => {
    process.exit(0);
  });
});
