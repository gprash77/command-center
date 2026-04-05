#!/usr/bin/env node
/**
 * Minimal MCP stdio server for tests: tool `echo` with `{ text: string }`.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "echo-fixture", version: "0.0.1" });
server.registerTool(
  "echo",
  {
    description: "Echo user text",
    inputSchema: z.object({ text: z.string() }),
  },
  async ({ text }) => ({
    content: [{ type: "text", text: `echo:${text}` }],
  }),
);

await server.connect(new StdioServerTransport());
