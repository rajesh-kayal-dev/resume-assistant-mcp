const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const MCP_URL = `${BACKEND_URL}/mcp`;

export async function callMcpTool(toolName: string, args: any) {
  try {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Unknown MCP Error");
    }

    // The backend returns { content: [{ type: "text", text: JSON.stringify(output) }], structuredContent: output }
    // Wait, the MCP protocol specifies returning { content: [...] }.
    // Let's parse the text from content[0].text
    if (data.result?.content?.[0]?.text) {
      return JSON.parse(data.result.content[0].text);
    }
    
    return data.result;
  } catch (error) {
    console.error(`Error calling MCP tool ${toolName}:`, error);
    throw error;
  }
}
