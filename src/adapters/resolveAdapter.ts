import type { AdapterConfig, CommandCenterConfig } from "../config/types.js";

export function adapterForProject(
  config: CommandCenterConfig,
  projectId: string,
): AdapterConfig {
  const a = config.projectAdapters[projectId];
  return a ?? { type: "stub" };
}
