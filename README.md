# command-center

Personal CLI orchestrator: route natural-language commands to projects under `~/projects`. **v2** adds per-project **HTTP** and **shell script** adapters (plus **stub** default).

## Requirements

- Node.js 20+

## Install

```bash
cd ~/projects/command-center
npm install
npm run build
```

Run locally:

```bash
node dist/cli.js --help
# or
npm start -- --help
```

Optional global link:

```bash
npm link
command-center --help
```

## Commands

| Command | Description |
|--------|-------------|
| `command-center list` | List project folder names under your configured projects root |
| `command-center route "<text>"` | Show JSON route result (keyword → project) |
| `command-center handle "<text>"` | Route + run adapter (stub, http, or script — see config) |
| `command-center doctor` | Print resolved `projectsRoot` and list folders |
| `command-center config-path` | Show config file path (`COMMAND_CENTER_CONFIG` overrides) |

## Configuration

Default file: `~/.config/command-center/config.json` (optional). If missing, built-in defaults apply (see `src/config/defaults.ts`).

**Built-in defaults** include every folder name under your typical `~/projects` list (11 apps), each with the **folder slug** as a keyword plus a few extra phrases. You can smoke-test routing with:

```bash
node dist/cli.js route "ai-news-summary"
node dist/cli.js route "voicepress"
```

Routing is **substring** match on keywords (first hit wins). Avoid short keywords that appear inside another project’s slug; defaults are tuned for that.

Example (optional `projectAdapters` — omit = stub only for that app):

```json
{
  "version": 1,
  "projectsRoot": "~/projects",
  "routes": [
    { "keywords": ["fantasy", "lineup"], "projectId": "fantasy-football-app" }
  ],
  "projectAdapters": {
    "fantasy-football-app": {
      "type": "http",
      "url": "http://127.0.0.1:3456/orchestrator"
    },
    "codex-app-builder": {
      "type": "script",
      "command": "node ./scripts/command-center-hook.mjs"
    }
  }
}
```

- **http**: `GET` to `url` with the user text in a query param (default name `text`; set `queryParam` to rename).
- **script**: runs `sh -c <command>` with `cwd` = that project folder; user text is in env **`COMMAND_CENTER_TEXT`**.

## GitHub

Create the remote repository under **gprash77** with the same name as this folder:

```bash
git remote add origin https://github.com/gprash77/command-center.git
git branch -M main
git push -u origin main
```

## Development

```bash
npm test
npm run typecheck
```

## Roadmap

- **v2** (current): HTTP + script adapters, golden routing fixtures (`test/fixtures/golden-routing.json`)
- **v3**: VoicePress handoff + MCP pilots
- **v4**: Optional dashboard / agent orchestrator
