#!/bin/bash
set -e

URL=${MCP_URL:-"http://localhost:3000/mcp"}

echo "Running MCP Protocol Smoke Test against $URL"
echo "----------------------------------------"

# Helper to send curl requests to the streamable HTTP endpoint
mcp_req() {
  local method=$1
  local params=$2
  
  if [ -z "$params" ]; then
    params="{}"
  fi
  
  curl -s -X POST "$URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d "{\"jsonrpc\":\"2.0\",\"method\":\"$method\",\"id\":1,\"params\":$params}"
}

echo "1. Initialization handshake"
mcp_req "initialize" "{\"protocolVersion\":\"2024-11-05\",\"capabilities\":{},\"clientInfo\":{\"name\":\"test-client\",\"version\":\"1.0.0\"}}" | grep -q "resume-assistant-mcp"
echo "✅ Handshake successful"

echo "2. List tools"
mcp_req "tools/list" | grep -q "parse_resume_local"
echo "✅ Tools listed successfully"

echo "3. Test calculate_ats_match tool"
mcp_req "tools/call" "{\"name\":\"calculate_ats_match\",\"arguments\":{\"resume_text\":\"Experienced with typescript and node\",\"job_text\":\"typescript node javascript\"}}" | grep -q "match_score"
echo "✅ Tool call successful"

echo "----------------------------------------"
echo "🎉 All smoke tests passed!"
