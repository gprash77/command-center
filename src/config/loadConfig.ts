import { readFileSync, existsSync } from "node:fs";
import { configSchema, type CommandCenterConfig } from "./types.js";
import { defaultConfig } from "./defaults.js";
import { defaultConfigPath, expandHome } from "./paths.js";

function readOptionalFile(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }
  return readFileSync(path, "utf8");
}

/**
 * Resolves config: optional file at `~/.config/command-center/config.json`,
 * merged on top of defaults. Override path with `COMMAND_CENTER_CONFIG` for tests.
 */
export function loadConfig(): CommandCenterConfig {
  const path = process.env["COMMAND_CENTER_CONFIG"] ?? defaultConfigPath();
  const raw = readOptionalFile(path);
  if (!raw) {
    return defaultConfig;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error(`Invalid JSON in config file: ${path}`);
  }
  const fileConfig = configSchema.partial().parse(parsed);
  const merged: CommandCenterConfig = {
    version: fileConfig.version ?? defaultConfig.version,
    projectsRoot: fileConfig.projectsRoot ?? defaultConfig.projectsRoot,
    routes: fileConfig.routes ?? defaultConfig.routes,
    projectAdapters: {
      ...defaultConfig.projectAdapters,
      ...fileConfig.projectAdapters,
    },
  };
  return configSchema.parse(merged);
}

export function resolveProjectsRoot(config: CommandCenterConfig): string {
  return expandHome(config.projectsRoot);
}
