import { loadConfig, resolveProjectsRoot } from "../config/loadConfig.js";
import { adapterForProject } from "../adapters/resolveAdapter.js";
import { dispatchHandle } from "../handle/dispatch.js";
import { routeTextWithHeuristics } from "../router/heuristics.js";

export function routeCommand(text: string) {
  const config = loadConfig();
  const result = routeTextWithHeuristics(text, config.routes);
  return { text, ...result };
}

export async function handleCommand(text: string) {
  const config = loadConfig();
  const root = resolveProjectsRoot(config);
  const result = routeTextWithHeuristics(text, config.routes);
  if (!result.matched) {
    return { ok: false as const, error: "No route matched" as const, text };
  }
  const adapter = adapterForProject(config, result.projectId);
  const out = await dispatchHandle(
    config,
    root,
    result.projectId,
    text,
    adapter,
  );
  return {
    ok: true as const,
    route: result,
    adapter,
    result: out,
  };
}
