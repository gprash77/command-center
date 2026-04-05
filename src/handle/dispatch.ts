import type { AdapterConfig, CommandCenterConfig } from "../config/types.js";
import { runStubAdapter } from "../adapters/stubAdapter.js";
import { runHttpAdapter } from "../adapters/httpAdapter.js";
import { runScriptAdapter } from "../adapters/scriptAdapter.js";
import { runMcpAdapter } from "../adapters/mcpAdapter.js";
import { projectPath, resolveProjectCwd } from "../projects/listProjects.js";

export type DispatchResult =
  | { kind: "stub"; payload: ReturnType<typeof runStubAdapter> }
  | { kind: "http"; status: number; body: string }
  | { kind: "script"; exitCode: number | null; stdout: string; stderr: string }
  | { kind: "mcp"; content: unknown; isError: boolean };

export async function dispatchHandle(
  config: CommandCenterConfig,
  projectsRoot: string,
  projectId: string,
  text: string,
  adapter: AdapterConfig,
): Promise<DispatchResult> {
  switch (adapter.type) {
    case "stub":
      return { kind: "stub", payload: runStubAdapter({ projectId, text }) };
    case "http":
      return { kind: "http", ...(await runHttpAdapter(adapter, text)) };
    case "script": {
      const cwd = projectPath(projectsRoot, projectId);
      return {
        kind: "script",
        ...(await runScriptAdapter({
          cwd,
          command: adapter.command,
          text,
        })),
      };
    }
    case "mcp": {
      const cwd = resolveProjectCwd(projectsRoot, projectId, adapter.cwd);
      const out = await runMcpAdapter(adapter, cwd, text);
      return { kind: "mcp", ...out };
    }
    default: {
      const _exhaustive: never = adapter;
      return _exhaustive;
    }
  }
}
