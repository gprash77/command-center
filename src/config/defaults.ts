import type { CommandCenterConfig, RouteRule } from "./types.js";

/**
 * Every folder under the default `~/projects` tree gets a route so
 * `route "<folder-name>"` and natural phrases both work.
 * Order matters: first matching keyword wins (see `routeText`).
 */
export const defaultProjectSlugs: readonly string[] = [
  "ai-news-summary",
  "alien-attack",
  "caaspp-practice",
  "codex-app-builder",
  "codex-notifier",
  "command-center",
  "fantasy-football-app",
  "missastroglow-agent",
  "starship-troopers",
  "state-tests-with-evaluation-scoring",
  "voicepress",
];

/** Extra phrases per slug (slugs themselves are always added as keywords). */
const extraKeywords: Record<string, string[]> = {
  "ai-news-summary": ["news summary", "headlines", "ai news", "digest"],
  "alien-attack": ["alien attack", "alien"],
  // Avoid keyword "test" — it is a substring of `state-tests-with-evaluation-scoring`.
  "caaspp-practice": ["caaspp", "practice"],
  // Avoid bare "codex" so it does not steal from codex-notifier; "ideas" covers the old phrase.
  "codex-app-builder": ["ideas", "idea", "app builder", "builder", "codex app"],
  "codex-notifier": ["notifier", "notify", "notifications", "codex notifier"],
  "command-center": ["orchestrator", "command center"],
  "fantasy-football-app": ["fantasy", "lineup", "football"],
  "missastroglow-agent": ["astroglow", "missastroglow"],
  "starship-troopers": ["starship", "troopers"],
  "state-tests-with-evaluation-scoring": ["state tests", "evaluation", "scoring"],
  "voicepress": ["dictation", "voice", "speech to text"],
};

function buildRoutes(): RouteRule[] {
  return defaultProjectSlugs.map((slug) => ({
    projectId: slug,
    keywords: [slug, ...(extraKeywords[slug] ?? [])],
  }));
}

export const defaultConfig: CommandCenterConfig = {
  version: 1,
  projectsRoot: "~/projects",
  routes: buildRoutes(),
};
