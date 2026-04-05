import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { formatHandleForDisplay } from "../cli/formatHandleOutput.js";
import { routeCommand, handleCommand } from "../ops/commands.js";
import { dashboardPageHtml } from "./pageHtml.js";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(
  res: ServerResponse,
  status: number,
  body: unknown,
): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

/**
 * Local dashboard: binds to 127.0.0.1 only.
 * @param port 0 = random (useful in tests)
 */
export function startDashboardServer(port: number): Promise<{
  port: number;
  close: () => Promise<void>;
}> {
  const server = createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(dashboardPageHtml());
        return;
      }
      if (req.method === "POST" && req.url === "/api/route") {
        const raw = await readBody(req);
        let body: { text?: string };
        try {
          body = JSON.parse(raw) as { text?: string };
        } catch {
          json(res, 400, { error: "Invalid JSON" });
          return;
        }
        const text = typeof body.text === "string" ? body.text : "";
        json(res, 200, routeCommand(text));
        return;
      }
      if (req.method === "POST" && req.url === "/api/handle") {
        const raw = await readBody(req);
        let body: { text?: string };
        try {
          body = JSON.parse(raw) as { text?: string };
        } catch {
          json(res, 400, { error: "Invalid JSON" });
          return;
        }
        const text = typeof body.text === "string" ? body.text : "";
        const result = await handleCommand(text);
        const formatted = formatHandleForDisplay(result, "text");
        json(res, 200, { ...result, formatted });
        return;
      }
      json(res, 404, { error: "Not found" });
    } catch (e) {
      json(res, 500, {
        error: e instanceof Error ? e.message : "Internal error",
      });
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.removeListener("error", reject);
      const addr = server.address();
      const p =
        typeof addr === "object" && addr && "port" in addr ? addr.port : port;
      resolve({
        port: p,
        close: () =>
          new Promise((res, rej) => server.close((err) => (err ? rej(err) : res()))),
      });
    });
  });
}
