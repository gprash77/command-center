# MCP + command-center (step-by-step)

command-center does **not** run MCP servers for you automatically. It **spawns** a short-lived process per `handle`, connects over **stdio**, calls **one tool** with your phrase as `{ text: "..." }`, then exits.

## 1. One-time: merge adapters into config

1. Copy the entries from [`mcp-five-apps.example.json`](./mcp-five-apps.example.json).
2. Paste them into **`projectAdapters`** in `~/.config/command-center/config.json` (merge with keys you already have).

If the file does not exist, create it:

```json
{
  "version": 1,
  "projectsRoot": "~/projects",
  "projectAdapters": {}
}
```

Then paste the `projectAdapters` block from the example.

## 2. Build / install each project the adapter points at

| Project | Before `handle` works |
|--------|------------------------|
| **command-center** | From `~/projects/command-center`: `npm install && npm run build` — MCP runs `dist/mcp/meta-server.js`. |
| **fantasy-football-app** | `npm install` — uses `tsx` to run `mcp/lineup-server.ts`. |
| **codex-app-builder** | `npm install` — optional: set `TMDB_API_KEY` in `.env.local` for live TMDB (see that repo’s `mcp/README.md`). |
| **codex-notifier** | `npm install` — MCP uses `tsx` to run `mcp/notify-server.ts`. macOS only for queue path. |
| **caaspp-practice** | `npm install` — MCP uses `tsx` to run `mcp/practice-server.ts`. |

## 3. Environment variables

- **Secrets are not automatic.** `command-center` passes the same **environment** as your shell to the child process (unless you set `env` on the adapter in config).

  Set keys **before** running the CLI, for example:

  ```bash
  export TMDB_API_KEY="..."   # codex-app-builder TMDB
  ```

  Or add an `env` block on a specific adapter in `config.json` (see `src/config/types.ts` / `AdapterConfig`).

- **codex-app-builder** also loads `.env.local` from its repo root inside `mcp/ideas-server.ts` when you use the MCP entrypoint (so TMDB can work without exporting in the shell).

## 4. How routing picks a project

Phrases match **keywords** in order (substring match). Examples:

- `fantasy …` → fantasy-football-app  
- `ideas …` / `app builder` → codex-app-builder  
- `orchestrator` / `command center` → command-center  
- `notifier` / `notify` → codex-notifier  
- `caaspp` / `practice` → caaspp-practice  

Use `command-center route "your phrase"` if unsure.

## 5. Smoke test

```bash
cd ~/projects/command-center
npm run build
command-center handle "orchestrator ping test"
command-center handle "fantasy lineup"
command-center handle "get ideas for a thriller"
```

## 6. Projects without MCP yet

See [`PROJECTS_INVENTORY.md`](./PROJECTS_INVENTORY.md) for the full list and what would be needed next (Python apps, static sites, Swift native, etc.).
