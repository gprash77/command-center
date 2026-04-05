import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  StdioClientTransport,
  getDefaultEnvironment,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import type { AdapterConfig } from "../config/types.js";

export type McpAdapterConfig = Extract<AdapterConfig, { type: "mcp" }>;

export async function runMcpAdapter(
  adapter: McpAdapterConfig,
  cwd: string,
  text: string,
): Promise<{ content: unknown; isError: boolean }> {
  const transport = new StdioClientTransport({
    command: adapter.command,
    args: adapter.args ?? [],
    cwd,
    env: adapter.env
      ? { ...getDefaultEnvironment(), ...adapter.env }
      : undefined,
    stderr: "inherit",
  });

  const client = new Client({ name: "command-center", version: "0.3.0" });

  await client.connect(transport);
  try {
    const key = adapter.textArgumentKey ?? "text";
    const result = await client.callTool({
      name: adapter.tool,
      arguments: { [key]: text },
    });
    return {
      content: result.content,
      isError: result.isError === true,
    };
  } finally {
    await client.close();
  }
}
