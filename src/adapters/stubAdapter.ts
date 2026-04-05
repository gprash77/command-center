import type { StubAdapterRequest, StubAdapterResult } from "./types.js";

/** Placeholder adapter until HTTP/MCP are wired (v2+). */
export function runStubAdapter(req: StubAdapterRequest): StubAdapterResult {
  return {
    adapter: "stub",
    projectId: req.projectId,
    text: req.text,
    message: `[stub] No backend call yet for "${req.projectId}".`,
  };
}
