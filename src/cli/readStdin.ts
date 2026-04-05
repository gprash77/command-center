import { readFileSync } from "node:fs";

/** Reads entire stdin (for `handle -` or `handle` with no args). Trims whitespace. */
export function readStdinText(): string {
  return readFileSync(0, "utf8").trim();
}
