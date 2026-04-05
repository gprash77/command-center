import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig } from "../src/config/loadConfig.js";

describe("loadConfig", () => {
  let prev: string | undefined;
  let tmpDir: string;

  beforeEach(() => {
    prev = process.env["COMMAND_CENTER_CONFIG"];
    tmpDir = mkdtempSync(join(tmpdir(), "cc-test-"));
  });

  afterEach(() => {
    if (prev === undefined) {
      delete process.env["COMMAND_CENTER_CONFIG"];
    } else {
      process.env["COMMAND_CENTER_CONFIG"] = prev;
    }
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("merges partial file over defaults", () => {
    const configPath = join(tmpDir, "config.json");
    writeFileSync(
      configPath,
      JSON.stringify({ version: 1, projectsRoot: "/custom/root" }),
      "utf8",
    );
    process.env["COMMAND_CENTER_CONFIG"] = configPath;
    const c = loadConfig();
    expect(c.projectsRoot).toBe("/custom/root");
    expect(c.routes.length).toBeGreaterThan(0);
    expect(c.projectAdapters).toEqual({});
  });

  it("merges projectAdapters over defaults", () => {
    const configPath = join(tmpDir, "config.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        version: 1,
        projectAdapters: {
          "fantasy-football-app": {
            type: "http",
            url: "http://127.0.0.1:1/x",
          },
        },
      }),
      "utf8",
    );
    process.env["COMMAND_CENTER_CONFIG"] = configPath;
    const c = loadConfig();
    expect(c.projectAdapters["fantasy-football-app"]?.type).toBe("http");
  });
});
