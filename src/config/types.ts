import { z } from "zod";

export const routeRuleSchema = z.object({
  keywords: z.array(z.string().min(1)),
  projectId: z.string().min(1),
});

export const adapterConfigSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stub") }),
  z.object({
    type: z.literal("http"),
    url: z.string().url(),
    /** Query param name for the user text (GET). Default: `text`. */
    queryParam: z.string().min(1).optional(),
  }),
  z.object({
    type: z.literal("script"),
    /** Passed to `sh -c` on macOS/Linux; cwd is the project folder. */
    command: z.string().min(1),
  }),
  z.object({
    type: z.literal("mcp"),
    /** Executable to spawn (e.g. `node` or `npx`). */
    command: z.string().min(1),
    args: z.array(z.string()).optional(),
    /**
     * Working directory for the MCP server process: omit = project root;
     * absolute path or path relative to that project.
     */
    cwd: z.string().optional(),
    /** Tool name to invoke with `callTool`. */
    tool: z.string().min(1),
    /** Property name for the user phrase in tool `arguments` (default: `text`). */
    textArgumentKey: z.string().min(1).optional(),
    env: z.record(z.string(), z.string()).optional(),
  }),
]);

export const configSchema = z.object({
  version: z.literal(1),
  projectsRoot: z.string(),
  routes: z.array(routeRuleSchema),
  /** Per-project adapter; omitted entries default to stub. */
  projectAdapters: z.record(z.string(), adapterConfigSchema).default({}),
});

export type RouteRule = z.infer<typeof routeRuleSchema>;
export type AdapterConfig = z.infer<typeof adapterConfigSchema>;
export type CommandCenterConfig = z.infer<typeof configSchema>;
