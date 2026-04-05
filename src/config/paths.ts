import { homedir } from "node:os";
import { join } from "node:path";

/** Expands leading `~` to the user home directory. */
export function expandHome(input: string): string {
  if (input === "~") {
    return homedir();
  }
  if (input.startsWith("~/")) {
    return join(homedir(), input.slice(2));
  }
  return input;
}

export function defaultConfigPath(): string {
  return join(homedir(), ".config", "command-center", "config.json");
}
