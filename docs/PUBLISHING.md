# Before you push (checklist)

Use this before **`git push`** so keys and junk never hit GitHub.

## 1. Diff and status

```bash
git status
git diff
```

## 2. Never commit

- `.env`, `.env.local`, `.env.*` (except optional `.env.example` with **empty** values)
- `node_modules/`
- OS paths under your home directory if pasted into tracked files
- Real **`TMDB_API_KEY`**, Supabase keys, or any third-party tokens

## 3. Quick secret grep (optional)

From the repo root:

```bash
git grep -iE 'api[_-]?key|secret|token|password' -- ':!node_modules' ':!package-lock.json' ':!dist'
```

Inspect hits — env **variable names** are fine; literal long strings are not.

## 4. Config examples

Repo JSON under **`docs/*.example.json`** should contain **only** adapter **shapes** (command, args, tool names), not credentials.

## 5. Push

```bash
git add -A
git commit -m "Your message"
git push origin main
```

Use branch/PR workflow if your team requires it.
