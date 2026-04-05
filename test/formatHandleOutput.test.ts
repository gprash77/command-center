import { describe, expect, it } from "vitest";
import { formatDispatchResult } from "../src/cli/formatHandleOutput.js";

describe("formatDispatchResult", () => {
  it("formats fantasy-style MCP JSON", () => {
    const text = JSON.stringify({
      starters: [
        { position: "QB", player: { name: "Test QB", projectedPoints: 20, rationale: "note" } },
      ],
      bench: [],
      totalProjectedPoints: 20,
      notFound: [],
    });
    const out = formatDispatchResult("fantasy-football-app", {
      kind: "mcp",
      isError: false,
      content: [{ type: "text", text }],
    });
    expect(out).toContain("Starters");
    expect(out).toContain("Test QB");
    expect(out).toContain("Total projected");
  });
});
