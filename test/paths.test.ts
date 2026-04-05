import { describe, expect, it } from "vitest";
import { expandHome } from "../src/config/paths.js";
import { homedir } from "node:os";
import { join } from "node:path";

describe("expandHome", () => {
  it("expands ~ to homedir", () => {
    expect(expandHome("~")).toBe(homedir());
  });

  it("expands ~/foo", () => {
    expect(expandHome("~/foo")).toBe(join(homedir(), "foo"));
  });

  it("leaves absolute paths unchanged", () => {
    expect(expandHome("/tmp/x")).toBe("/tmp/x");
  });
});
