#!/usr/bin/env node
/**
 * MCP stdio: `orchestrator_ping` — health/version echo for command-center routing smoke tests.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

function readVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(here, "..", "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const server = new McpServer({ name: "command-center-meta", version: readVersion() });

server.registerTool(
  "orchestrator_ping",
  {
    description:
      "Echo text and return command-center version. Use to verify MCP wiring from command-center.",
    inputSchema: z.object({
      text: z.string().describe("Any phrase routed to this project."),
    }),
  },
  async ({ text }) => {
    const payload = {
      projectId: "command-center",
      version: readVersion(),
      received: text,
      at: new Date().toISOString(),
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    };
  },
);

async function main() {
  await server.connect(new StdioServerTransport());
}

void main();
