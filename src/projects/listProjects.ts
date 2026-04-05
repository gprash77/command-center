import { readdirSync } from "node:fs";
import { isAbsolute, join } from "node:path";

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

/** Project root, or absolute `cwd`, or projectRoot + relative segment. */
export function resolveProjectCwd(
  projectsRoot: string,
  projectId: string,
  cwd: string | undefined,
): string {
  const base = projectPath(projectsRoot, projectId);
  if (cwd === undefined) {
    return base;
  }
  if (isAbsolute(cwd)) {
    return cwd;
  }
  return join(base, cwd);
}
