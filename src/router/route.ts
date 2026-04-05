import type { RouteRule } from "../config/types.js";

export type RouteResult =
  | {
      matched: true;
      projectId: string;
      keyword: string;
      ruleIndex: number;
    }
  | {
      matched: false;
    };

/**
 * Case-insensitive substring match: first rule whose first matching keyword wins.
 */
export function routeText(text: string, rules: RouteRule[]): RouteResult {
  const lower = text.toLowerCase();
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (!rule) {
      continue;
    }
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return {
          matched: true,
          projectId: rule.projectId,
          keyword: kw,
          ruleIndex: i,
        };
      }
    }
  }
  return { matched: false };
}
