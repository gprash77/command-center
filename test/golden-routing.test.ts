import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { routeText } from "../src/router/route.js";
import { defaultConfig } from "../src/config/defaults.js";

const here = dirname(fileURLToPath(import.meta.url));

type Row = { text: string; projectId: string | null };

describe("golden routing fixtures", () => {
  it("matches expectations.json rows", () => {
    const raw = readFileSync(join(here, "fixtures", "golden-routing.json"), "utf8");
    const rows = JSON.parse(raw) as Row[];
    for (const row of rows) {
      const r = routeText(row.text, defaultConfig.routes);
      if (row.projectId === null) {
        expect(r.matched, row.text).toBe(false);
      } else {
        expect(r.matched, row.text).toBe(true);
        if (r.matched) {
          expect(r.projectId, row.text).toBe(row.projectId);
        }
      }
    }
  });
});
