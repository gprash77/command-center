import { z } from "zod";

export const routeRuleSchema = z.object({
  keywords: z.array(z.string().min(1)),
  projectId: z.string().min(1),
});

export const configSchema = z.object({
  version: z.literal(1),
  projectsRoot: z.string(),
  routes: z.array(routeRuleSchema),
});

export type RouteRule = z.infer<typeof routeRuleSchema>;
export type CommandCenterConfig = z.infer<typeof configSchema>;
