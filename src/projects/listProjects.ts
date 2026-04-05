import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists immediate child directory names under `projectsRoot` (non-hidden only).
 */
export function listProjectIds(projectsRoot: string): string[] {
  const entries = readdirSync(projectsRoot, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

export function projectPath(projectsRoot: string, projectId: string): string {
  return join(projectsRoot, projectId);
}
