import { test, expect } from "@playwright/test";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

test.describe("Full-Stack Integration", () => {
  test("Backend /health returns healthy status", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/health`);
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    expect(body.status).toBe("healthy");
  });

  test("Backend /ping returns alive status with timestamp", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/ping`);
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    expect(body.status).toBe("alive");
    expect(body.timestamp).toBeDefined();
  });

  test("Backend MCP tools/list returns registered tools", async ({ request }) => {
    const resp = await request.post(`${BACKEND_URL}/mcp`, {
      data: {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      },
    });
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    const toolNames = body.result.tools.map((t: { name: string }) => t.name);
    expect(toolNames).toContain("parse_resume_local");
    expect(toolNames).toContain("fetch_job_description");
    expect(toolNames).toContain("calculate_ats_match");
    expect(toolNames).toContain("generate_interview_questions");
    expect(toolNames).toContain("get_resume_improvements");
    expect(toolNames).toContain("generate_cover_letter");
    expect(toolNames).toContain("skill_gap_analysis");
    expect(toolNames).toContain("analyze_company");
    expect(toolNames.length).toBeGreaterThanOrEqual(8);
  });

  test("Frontend landing page loads successfully", async ({ page }) => {
    const resp = await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("Frontend app page renders without crash", async ({ page }) => {
    const resp = await page.goto(`${FRONTEND_URL}/app`, { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("End-to-end: backend health → frontend loads → ping returns alive", async ({ request, page }) => {
    const health = await request.get(`${BACKEND_URL}/health`);
    expect(health.ok()).toBe(true);

    const homeResp = await page.goto(FRONTEND_URL, { waitUntil: "domcontentloaded" });
    expect(homeResp?.status()).toBe(200);
    const title = await page.title();
    expect(title).toContain("ResuMate");

    const ping = await request.get(`${BACKEND_URL}/ping`);
    expect(ping.ok()).toBe(true);
    const pingBody = await ping.json();
    expect(pingBody.status).toBe("alive");
  });
});
