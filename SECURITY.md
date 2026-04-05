# Security

## Threat model

command-center is a **local** tool: it runs adapters on your machine, binds the dashboard to **127.0.0.1** only, and reads config from your user config path. Treat any **script**, **HTTP**, or **MCP** adapter as **trusted code** with the same privileges as your user.

## Secrets

- **Do not commit** API keys, tokens, database URLs, or personal paths you consider sensitive.
- Keep secrets in **environment variables** or files that are **gitignored** (e.g. `.env`, `.env.local`).
- User config is usually **`~/.config/command-center/config.json`** — outside this repository. If you paste an example config into the repo, use **placeholders only** (see `docs/mcp-five-apps.example.json`).
- Downstream apps (e.g. TMDB, Supabase) load their own env files; never copy real values into this repo.

## Reporting

If you find a security issue in this project, open a private report with the maintainer or use GitHub **Security advisories** if enabled for the repository.

## Supply chain

- Pin dependencies via **`package-lock.json`** (commit it).
- Review **`npm audit`** periodically before releases.
