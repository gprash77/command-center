# command-center

Personal CLI orchestrator: route natural-language commands to projects under `~/projects`. Supports **stub**, **HTTP**, **shell script**, and **MCP (stdio)** adapters per project.

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
| `command-center handle "<text>"` | Route + run adapter (see config). Use `-` or omit text to **read from stdin** |
| `command-center doctor` | Print resolved `projectsRoot` and list folders |
| `command-center config-path` | Show config file path (`COMMAND_CENTER_CONFIG` overrides) |

### Stdin (VoicePress / clipboard)

- Pipe: `printf 'fantasy lineup' | node dist/cli.js handle -`
- macOS clipboard: `pbpaste | node dist/cli.js handle -`
- Or paste into the terminal after `node dist/cli.js handle` and press **Ctrl-D** to end stdin

## Configuration

Default file: `~/.config/command-center/config.json` (optional). If missing, built-in defaults apply (see `src/config/defaults.ts`).

**Built-in defaults** include every folder name under your typical `~/projects` list (11 apps), each with the **folder slug** as a keyword plus a few extra phrases. You can smoke-test routing with:

```bash
node dist/cli.js route "ai-news-summary"
node dist/cli.js route "voicepress"
```

Routing is **substring** match on keywords (first hit wins). Avoid short keywords that appear inside another project’s slug; defaults are tuned for that.

Example (`projectAdapters` — omit = stub only for that app):

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
    },
    "some-app": {
      "type": "mcp",
      "command": "node",
      "args": ["./mcp-server.mjs"],
      "tool": "do_something",
      "cwd": ".",
      "textArgumentKey": "text"
    }
  }
}
```

- **http**: `GET` to `url` with the user text in a query param (default name `text`; set `queryParam` to rename).
- **script**: runs `sh -c <command>` with `cwd` = that project folder; user text is in env **`COMMAND_CENTER_TEXT`**.
- **mcp**: spawns **`command`** with **`args`** (optional), **`cwd`** optional (default = project root; absolute or relative to that project). Calls MCP tool **`tool`** with arguments `{ "<textArgumentKey>": "<phrase>" }` (default key `text`). Uses the official MCP TypeScript SDK over stdio.

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

- **v2**: HTTP + script adapters, golden routing fixtures (`test/fixtures/golden-routing.json`)
- **v3** (current): stdin `handle`, MCP stdio adapter, integration tests with `test/fixtures/mcp-echo.mjs`
- **v4**: Optional dashboard / agent orchestrator
