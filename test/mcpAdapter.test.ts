import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runMcpAdapter } from "../src/adapters/mcpAdapter.js";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "..");
const echoScript = join(testDir, "fixtures", "mcp-echo.mjs");

describe("runMcpAdapter", () => {
  it("calls echo tool over stdio", async () => {
    const out = await runMcpAdapter(
      {
        type: "mcp",
        command: "node",
        args: [echoScript],
        tool: "echo",
      },
      repoRoot,
      "hello-mcp",
    );
    expect(out.isError).toBe(false);
    expect(out.content).toEqual([
      { type: "text", text: "echo:hello-mcp" },
    ]);
  });

});
