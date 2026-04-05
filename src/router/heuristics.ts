import type { RouteRule } from "../config/types.js";
import type { RouteResult } from "./route.js";
import { routeText } from "./route.js";

const FANTASY_PROJECT_ID = "fantasy-football-app";

/** Two+ words, letters/apostrophe/hyphen only (player names). */
function segmentLooksLikePersonName(segment: string): boolean {
  const s = segment.trim();
  if (s.length < 3 || s.length > 80) return false;
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  return words.every((w) => /^[A-Za-z][A-Za-z'.-]*$/.test(w));
}

/**
 * Comma-separated player names (no fantasy keywords) → fantasy MCP.
 */
function looksLikeCommaSeparatedPlayerList(text: string): boolean {
  if (!text.includes(",")) return false;
  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 2 && parts.every(segmentLooksLikePersonName);
}

/**
 * Lineup JSON body (routes to fantasy before MCP parses it).
 */
function looksLikeLineupJson(text: string): boolean {
  const t = text.trim();
  if (!t.startsWith("{")) return false;
  return /"roster"\s*:\s*\[/.test(t);
}

/**
 * Keyword routing first; then fantasy-specific heuristics for player lists / JSON roster.
 */
export function routeTextWithHeuristics(
  text: string,
  rules: RouteRule[],
): RouteResult {
  const direct = routeText(text, rules);
  if (direct.matched) {
    return direct;
  }
  if (looksLikeLineupJson(text) || looksLikeCommaSeparatedPlayerList(text)) {
    return {
      matched: true,
      projectId: FANTASY_PROJECT_ID,
      keyword: "(fantasy roster hint)",
      ruleIndex: -1,
    };
  }
  return { matched: false };
}
