/** Single-page UI for the local dashboard (no bundler). */
export function dashboardPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>command-center</title>
  <style>
    :root { font-family: system-ui, sans-serif; background: #0f1115; color: #e8eaed; }
    body { max-width: 52rem; margin: 2rem auto; padding: 0 1rem; }
    h1 { font-weight: 600; font-size: 1.25rem; }
    textarea {
      width: 100%; min-height: 5rem; padding: 0.75rem;
      background: #1a1d24; color: #e8eaed; border: 1px solid #2d323c;
      border-radius: 6px; font-size: 0.95rem; resize: vertical;
    }
    .row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 0.75rem 0; }
    button {
      padding: 0.45rem 1rem; border-radius: 6px; border: 1px solid #3d4450;
      background: #252a33; color: #e8eaed; cursor: pointer; font-size: 0.9rem;
    }
    button:hover { background: #2f3540; }
    button.primary { border-color: #4a6fa5; background: #1e3a5f; }
    pre {
      background: #1a1d24; border: 1px solid #2d323c; border-radius: 6px;
      padding: 1rem; overflow: auto; font-size: 0.8rem; line-height: 1.4;
    }
    .hint { font-size: 0.85rem; color: #9aa0a6; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <h1>command-center</h1>
  <p class="hint">Local only. Same routing and adapters as the CLI.</p>
  <textarea id="text" placeholder="e.g. fantasy lineup or voicepress"></textarea>
  <div class="row">
    <button type="button" class="primary" id="btnRun">Run</button>
    <span class="hint" style="align-self:center;">Optional:</span>
    <button type="button" id="btnRoute">Route only</button>
  </div>
  <p class="hint" style="margin-top:0;">Run calls routing and your adapters (same as <code>command-center handle</code>). Route only shows which project would match—no MCP or HTTP.</p>
  <pre id="out">{}</pre>
  <script>
    const out = document.getElementById("out");
    const textEl = document.getElementById("text");
    async function post(path, body) {
      const r = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json().catch(() => ({ error: "invalid JSON" }));
      if (!r.ok) throw new Error(j.error || r.statusText);
      return j;
    }
    document.getElementById("btnRoute").onclick = async () => {
      try {
        out.textContent = JSON.stringify(await post("/api/route", { text: textEl.value }), null, 2);
      } catch (e) {
        out.textContent = String(e);
      }
    };
    document.getElementById("btnRun").onclick = async () => {
      try {
        const data = await post("/api/handle", { text: textEl.value });
        out.textContent =
          typeof data.formatted === "string"
            ? data.formatted
            : JSON.stringify(data, null, 2);
      } catch (e) {
        out.textContent = String(e);
      }
    };
  </script>
</body>
</html>`;
}
