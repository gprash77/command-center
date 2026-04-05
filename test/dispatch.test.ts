import { describe, expect, it, vi, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dispatchHandle } from "../src/handle/dispatch.js";
import { defaultConfig } from "../src/config/defaults.js";

describe("dispatchHandle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stub", async () => {
    const out = await dispatchHandle(
      defaultConfig,
      "/tmp",
      "fantasy-football-app",
      "hi",
      { type: "stub" },
    );
    expect(out.kind).toBe("stub");
    if (out.kind === "stub") {
      expect(out.payload.projectId).toBe("fantasy-football-app");
    }
  });

  it("http", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("ok", { status: 200 })),
    );
    const out = await dispatchHandle(
      defaultConfig,
      "/tmp",
      "x",
      "t",
      { type: "http", url: "http://127.0.0.1:9/a" },
    );
    expect(out.kind).toBe("http");
    if (out.kind === "http") {
      expect(out.status).toBe(200);
      expect(out.body).toBe("ok");
    }
  });

  it("script uses project cwd under projectsRoot", async () => {
    const dir = mkdtempSync(join(tmpdir(), "cc-dispatch-"));
    const projectsRoot = join(dir, "projects");
    const projectId = "demo-proj";
    const proj = join(projectsRoot, projectId);
    try {
      const { mkdirSync } = await import("node:fs");
      mkdirSync(proj, { recursive: true });
      const out = await dispatchHandle(
        defaultConfig,
        projectsRoot,
        projectId,
        "abc",
        { type: "script", command: 'printf "%s" "$COMMAND_CENTER_TEXT"' },
      );
      expect(out.kind).toBe("script");
      if (out.kind === "script") {
        expect(out.exitCode).toBe(0);
        expect(out.stdout).toBe("abc");
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("mcp", async () => {
    const testDir = dirname(fileURLToPath(import.meta.url));
    const repoRoot = join(testDir, "..");
    const echoScript = join(testDir, "fixtures", "mcp-echo.mjs");
    const out = await dispatchHandle(
      defaultConfig,
      "/tmp",
      "fantasy-football-app",
      "via-dispatch",
      {
        type: "mcp",
        command: "node",
        args: [echoScript],
        tool: "echo",
        cwd: repoRoot,
      },
    );
    expect(out.kind).toBe("mcp");
    if (out.kind === "mcp") {
      expect(out.isError).toBe(false);
      expect(out.content).toEqual([
        { type: "text", text: "echo:via-dispatch" },
      ]);
    }
  });
});
