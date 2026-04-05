# ~/projects inventory (what exists vs what’s wired)

| Folder | Stack / notes | MCP in repo | command-center |
|--------|-----------------|-------------|------------------|
| **fantasy-football-app** | Next + Sleeper lineup | `get_optimal_lineup` | Use `mcp-five-apps.example.json` |
| **codex-app-builder** | Next + TMDB | `get_watch_ideas` | Needs `TMDB_API_KEY` for live data |
| **command-center** | This CLI | `orchestrator_ping` | Requires `npm run build` for `dist/mcp/meta-server.js` |
| **codex-notifier** | Shell + Node agent | `enqueue_notification` | macOS queue; run `notifier-agent` for real banners |
| **caaspp-practice** | Next + Supabase | `get_practice_question` | Local question data; no DB for this tool |
| **voicepress** | Swift macOS app | — | No Node MCP; native binary only |
| **ai-news-summary** | Python | — | Would need Python MCP or HTTP bridge |
| **missastroglow-agent** | Python | — | Same |
| **alien-attack** | Static HTML | — | Placeholder / demo |
| **starship-troopers** | Static HTML | — | Placeholder / demo |
| **state-tests-with-evaluation-scoring** | README only | — | Not implemented |
| **command-center** (meta) | — | See above | — |

**Implemented in this pass:** five MCP adapters (fantasy, codex-app-builder, command-center, codex-notifier, caaspp-practice) with example config and [MCP_SETUP.md](./MCP_SETUP.md).
