import type { CommandCenterConfig } from "./types.js";

export const defaultConfig: CommandCenterConfig = {
  version: 1,
  projectsRoot: "~/projects",
  routes: [
    {
      keywords: ["fantasy", "lineup", "football"],
      projectId: "fantasy-football-app",
    },
    {
      keywords: ["idea", "ideas", "codex", "builder"],
      projectId: "codex-app-builder",
    },
    {
      keywords: ["caaspp", "practice", "test"],
      projectId: "caaspp-practice",
    },
  ],
};
