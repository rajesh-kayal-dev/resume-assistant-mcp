export async function callMcpTool(toolName: string, args: Record<string, any>) {
  try {
    const response = await fetch("http://localhost:8080/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
