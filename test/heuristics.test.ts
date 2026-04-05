import { describe, expect, it } from "vitest";
import { routeTextWithHeuristics } from "../src/router/heuristics.js";
import { defaultConfig } from "../src/config/defaults.js";

describe("routeTextWithHeuristics", () => {
  it("routes comma-separated player names to fantasy without keywords", () => {
    const r = routeTextWithHeuristics(
      "Patrick Mahomes, Travis Kelce, Christian McCaffrey",
      defaultConfig.routes,
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("fantasy-football-app");
      expect(r.ruleIndex).toBe(-1);
    }
  });

  it("routes JSON with roster array to fantasy", () => {
    const r = routeTextWithHeuristics(
      '{"roster":["Josh Allen","Saquon Barkley"],"week":3}',
      defaultConfig.routes,
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("fantasy-football-app");
    }
  });

  it("still prefers keyword match when present", () => {
    const r = routeTextWithHeuristics("fantasy lineup", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("fantasy-football-app");
      expect(r.ruleIndex).toBeGreaterThanOrEqual(0);
    }
  });
});
