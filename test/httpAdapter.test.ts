import { describe, expect, it, vi, afterEach } from "vitest";
import { runHttpAdapter } from "../src/adapters/httpAdapter.js";

describe("runHttpAdapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("GETs with default text query param", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const u = new URL(String(input));
        expect(u.searchParams.get("text")).toBe("hello world");
        return new Response('{"ok":true}', { status: 200 });
      }),
    );

    const out = await runHttpAdapter(
      { type: "http", url: "http://127.0.0.1:9/example" },
      "hello world",
    );
    expect(out.status).toBe(200);
    expect(out.body).toBe('{"ok":true}');
  });

  it("uses custom query param name", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const u = new URL(String(input));
        expect(u.searchParams.get("q")).toBe("x");
        return new Response("done", { status: 201 });
      }),
    );

    const out = await runHttpAdapter(
      {
        type: "http",
        url: "http://127.0.0.1:9/x",
        queryParam: "q",
      },
      "x",
    );
    expect(out.status).toBe(201);
    expect(out.body).toBe("done");
  });
});
