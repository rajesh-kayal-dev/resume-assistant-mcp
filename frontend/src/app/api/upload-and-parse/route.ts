import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";

export async function POST(request: Request) {
  let tmpPath: string | null = null;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to temp file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    tmpPath = join(os.tmpdir(), `resume-${uniqueSuffix}${ext}`);
    
    await writeFile(tmpPath, buffer);

    // Call MCP tool
    const result = await callMcpTool("parse_resume_local", {
      file_path: tmpPath,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 });
  } finally {
    // Cleanup
    if (tmpPath) {
      try {
        await unlink(tmpPath);
      } catch (e) {
        console.error("Failed to cleanup tmp file:", e);
      }
    }
  }
}
