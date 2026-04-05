import { describe, expect, it } from "vitest";
import { routeText } from "../src/router/route.js";
import { defaultConfig } from "../src/config/defaults.js";

describe("routeText", () => {
  it("matches fantasy keywords", () => {
    const r = routeText("Check my fantasy lineup", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("fantasy-football-app");
    }
  });

  it("matches codex ideas", () => {
    const r = routeText("get more ideas from codex", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("codex-app-builder");
    }
  });

  it("returns unmatched for unrelated text", () => {
    const r = routeText("nothing familiar here", defaultConfig.routes);
    expect(r.matched).toBe(false);
  });

  it("is case insensitive", () => {
    const r = routeText("FANTASY", defaultConfig.routes);
    expect(r.matched).toBe(true);
  });
});
