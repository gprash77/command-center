import { describe, expect, it } from "vitest";
import { runStubAdapter } from "../src/adapters/stubAdapter.js";

describe("runStubAdapter", () => {
  it("returns stub payload", () => {
    const r = runStubAdapter({ projectId: "demo", text: "hello" });
    expect(r.adapter).toBe("stub");
    expect(r.projectId).toBe("demo");
    expect(r.text).toBe("hello");
    expect(r.message).toContain("demo");
  });
});
