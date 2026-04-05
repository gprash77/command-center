import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { listProjectIds } from "../src/projects/listProjects.js";

describe("listProjectIds", () => {
  it("lists only non-hidden directories", () => {
    const root = mkdtempSync(join(tmpdir(), "cc-proj-"));
    try {
      mkdirSync(join(root, "alpha"));
      mkdirSync(join(root, "beta"));
      mkdirSync(join(root, ".hidden"));
      writeFileSync(join(root, "file.txt"), "");
      const ids = listProjectIds(root);
      expect(ids).toEqual(["alpha", "beta"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
