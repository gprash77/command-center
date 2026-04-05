import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runScriptAdapter } from "../src/adapters/scriptAdapter.js";

describe("runScriptAdapter", () => {
  it("runs sh -c with COMMAND_CENTER_TEXT", async () => {
    const dir = mkdtempSync(join(tmpdir(), "cc-script-"));
    try {
      const out = await runScriptAdapter({
        cwd: dir,
        command: 'printf "%s" "$COMMAND_CENTER_TEXT"',
        text: "ping",
      });
      expect(out.exitCode).toBe(0);
      expect(out.stdout).toBe("ping");
      expect(out.stderr).toBe("");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
