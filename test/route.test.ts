import { describe, expect, it } from "vitest";
import { routeText } from "../src/router/route.js";
import { defaultConfig, defaultProjectSlugs } from "../src/config/defaults.js";

describe("routeText", () => {
  it("matches fantasy keywords", () => {
    const r = routeText("Check my fantasy lineup", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("fantasy-football-app");
    }
  });

  it("matches codex ideas (ideas keyword, not bare codex)", () => {
    const r = routeText("get more ideas from codex", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("codex-app-builder");
    }
  });

  it("matches codex for movie / recommendation phrasing", () => {
    const r = routeText("movie recommendation for tonight", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("codex-app-builder");
    }
  });

  it("returns unmatched for unrelated text", () => {
    const r = routeText("nothing familiar here xyz123", defaultConfig.routes);
    expect(r.matched).toBe(false);
  });

  it("is case insensitive", () => {
    const r = routeText("FANTASY", defaultConfig.routes);
    expect(r.matched).toBe(true);
  });

  it("every default project slug routes to itself", () => {
    for (const slug of defaultProjectSlugs) {
      const r = routeText(slug, defaultConfig.routes);
      expect(r.matched, `expected slug "${slug}" to match`).toBe(true);
      if (r.matched) {
        expect(r.projectId).toBe(slug);
      }
    }
  });

  it("codex-notifier wins on notifier keyword before other projects", () => {
    const r = routeText("check the notifier queue", defaultConfig.routes);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.projectId).toBe("codex-notifier");
    }
  });
});
