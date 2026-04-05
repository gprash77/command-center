import { describe, expect, it } from "vitest";
import { startDashboardServer } from "../src/dashboard/server.js";

describe("dashboard server", () => {
  it("serves HTML and route API", async () => {
    const { port, close } = await startDashboardServer(0);
    try {
      const base = `http://127.0.0.1:${port}`;
      const r0 = await fetch(base + "/");
      expect(r0.status).toBe(200);
      expect(await r0.text()).toContain("command-center");

      const r1 = await fetch(base + "/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "voicepress" }),
      });
      expect(r1.status).toBe(200);
      const j = (await r1.json()) as { matched?: boolean; projectId?: string };
      expect(j.matched).toBe(true);
      expect(j.projectId).toBe("voicepress");

      const r2 = await fetch(base + "/api/handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "voicepress" }),
      });
      expect(r2.status).toBe(200);
      const h = (await r2.json()) as { formatted?: string; ok?: boolean };
      expect(h.ok).toBe(true);
      expect(typeof h.formatted).toBe("string");
      expect(h.formatted).toContain("voicepress");
    } finally {
      await close();
    }
  });
});
