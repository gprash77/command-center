import type { DispatchResult } from "../handle/dispatch.js";

export type HandleCommandResult = Awaited<
  ReturnType<typeof import("../ops/commands.js").handleCommand>
>;

export function resolveOutputMode(options: {
  json?: boolean;
  text?: boolean;
}): "json" | "text" {
  if (options.json && options.text) {
    return "json";
  }
  if (options.json) {
    return "json";
  }
  if (options.text) {
    return "text";
  }
  return process.stdout.isTTY ? "text" : "json";
}

function tryParseJson(s: string): unknown {
  try {
    return JSON.parse(s) as unknown;
  } catch {
    return null;
  }
}

function extractMcpFirstText(content: unknown): string | null {
  if (!Array.isArray(content)) return null;
  const first = content[0] as { type?: string; text?: string } | undefined;
  if (first?.type === "text" && typeof first.text === "string") {
    return first.text;
  }
  return null;
}

function formatFantasyLineup(p: Record<string, unknown>): string {
  const starters = p["starters"] as
    | Array<{ position: string; player: Record<string, unknown> | null }>
    | undefined;
  const lines: string[] = [];
  lines.push("Starters");
  lines.push("--------");
  for (const row of starters ?? []) {
    const name = row.player
      ? String((row.player as { name?: string }).name ?? "?")
      : "— empty —";
    const rationale = row.player
      ? String((row.player as { rationale?: string }).rationale ?? "")
      : "";
    const pts = row.player
      ? (row.player as { projectedPoints?: number }).projectedPoints
      : undefined;
    const ptsStr = typeof pts === "number" ? ` ~${pts.toFixed(1)} pts` : "";
    lines.push(`${row.position.padEnd(5)} ${name}${ptsStr}`);
    if (rationale) lines.push(`      ${rationale}`);
  }
  lines.push("");
  lines.push("Bench");
  lines.push("-----");
  const bench = (p["bench"] as Array<Record<string, unknown>> | undefined) ?? [];
  if (bench.length === 0) lines.push("(none)");
  for (const pl of bench) {
    const name = String((pl as { name?: string }).name ?? "?");
    const pts = (pl as { projectedPoints?: number }).projectedPoints;
    const ptsStr = typeof pts === "number" ? ` ~${pts.toFixed(1)} pts` : "";
    lines.push(`${name}${ptsStr}`);
  }
  lines.push("");
  const total = p["totalProjectedPoints"];
  if (typeof total === "number") {
    lines.push(`Total projected (starters): ${total.toFixed(2)}`);
  }
  const nf = p["notFound"] as string[] | undefined;
  if (nf && nf.length > 0) {
    lines.push(`Not found: ${nf.join(", ")}`);
  }
  return lines.join("\n");
}

function formatCodexIdeas(p: Record<string, unknown>): string {
  const lines: string[] = [];
  const prefs = p["prefs"] as Record<string, string> | undefined;
  if (prefs) {
    const pr = prefs;
    lines.push(
      `Preferences: ${pr.genre ?? "?"} · ${pr.mood ?? "?"} · ${pr.budget ?? "?"} · ${pr.mediaType ?? "All"}`,
    );
    lines.push("");
  }
  lines.push("Picks");
  lines.push("-----");
  let i = 1;
  const picks = p["picks"] as Array<{
    title?: string;
    type?: string;
    score?: number;
    hook?: string;
    reasons?: string[];
  }>;
  for (const pick of picks ?? []) {
    lines.push(`${i}. ${pick.title ?? "?"} (${pick.type ?? "?"}) — score ${pick.score ?? "?"}`);
    if (pick.hook) lines.push(`   ${pick.hook}`);
    if (pick.reasons?.length) lines.push(`   ${pick.reasons.join(" · ")}`);
    lines.push("");
    i++;
  }
  return lines.join("\n").trim();
}

export function formatDispatchResult(
  projectId: string,
  result: DispatchResult,
): string {
  switch (result.kind) {
    case "stub": {
      return result.payload.message;
    }
    case "http": {
      const pretty = tryParseJson(result.body);
      if (pretty !== null) {
        return JSON.stringify(pretty, null, 2);
      }
      return `HTTP ${result.status}\n\n${result.body}`;
    }
    case "script": {
      const parts = [`Exit code: ${result.exitCode ?? "?"}`];
      if (result.stdout.trim()) parts.push(result.stdout.trim());
      if (result.stderr.trim()) parts.push("stderr:\n" + result.stderr.trim());
      return parts.join("\n\n");
    }
    case "mcp": {
      const raw = extractMcpFirstText(result.content);
      if (!raw) {
        return JSON.stringify(result.content, null, 2);
      }
      if (result.isError) {
        return `MCP error:\n${raw}`;
      }
      const parsed = tryParseJson(raw);
      if (parsed && typeof parsed === "object" && parsed !== null) {
        const o = parsed as Record<string, unknown>;
        if (Array.isArray(o["starters"])) {
          return formatFantasyLineup(parsed as Record<string, unknown>);
        }
        if (Array.isArray(o["picks"])) {
          return formatCodexIdeas(parsed as Record<string, unknown>);
        }
      }
      const again = tryParseJson(raw);
      return again !== null ? JSON.stringify(again, null, 2) : raw;
    }
    default: {
      const _x: never = result;
      return JSON.stringify(_x, null, 2);
    }
  }
}

export function formatHandleForDisplay(
  payload: HandleCommandResult,
  mode: "json" | "text",
): string {
  if (mode === "json") {
    return JSON.stringify(payload, null, 2);
  }
  if (!payload.ok) {
    return (
      `No route matched.\n\n` +
      `You said: "${payload.text}"\n\n` +
      `Try: a project keyword (e.g. "fantasy lineup"), comma-separated player names, or JSON with "roster".`
    );
  }
  const header = [
    `→ ${payload.route.projectId}`,
    payload.route.matched ? `  matched: ${payload.route.keyword}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const body = formatDispatchResult(payload.route.projectId, payload.result);
  return `${header}\n\n${body}`;
}
