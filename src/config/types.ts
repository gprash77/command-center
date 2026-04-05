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
