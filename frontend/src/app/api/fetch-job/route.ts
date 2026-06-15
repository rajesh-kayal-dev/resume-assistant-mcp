import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const result = await callMcpTool("fetch_job_description", { url });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch job" }, { status: 500 });
  }
}
