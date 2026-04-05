#!/usr/bin/env node
import { Command } from "commander";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, resolveProjectsRoot } from "./config/loadConfig.js";
import { defaultConfigPath } from "./config/paths.js";
import { listProjectIds, projectPath } from "./projects/listProjects.js";
import { readStdinText } from "./cli/readStdin.js";
import { routeCommand, handleCommand } from "./ops/commands.js";
import { startDashboardServer } from "./dashboard/server.js";

function readVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(here, "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const program = new Command();

program
  .name("command-center")
  .description("Personal CLI orchestrator for ~/projects")
  .version(readVersion());

program
  .command("list")
  .description("List project folders under the configured projects root")
  .action(() => {
    const config = loadConfig();
    const root = resolveProjectsRoot(config);
    const ids = listProjectIds(root);
    for (const id of ids) {
      console.log(id);
    }
  });

program
  .command("route")
  .description("Show which project a phrase would route to (JSON)")
  .argument("<text>", "Natural language command")
  .action((text: string) => {
    console.log(JSON.stringify(routeCommand(text), null, 2));
  });

program
  .command("handle")
  .description(
    "Route and invoke the configured adapter (stub, http, script, or mcp)",
  )
  .argument(
    "[text]",
    "Natural language command; use `-` or omit to read from stdin (pipe or paste + Ctrl-D)",
  )
  .action(async (text: string | undefined) => {
    const resolved =
      text === undefined || text === "-" ? readStdinText() : text;
    const payload = await handleCommand(resolved);
    if (!payload.ok) {
      console.log(JSON.stringify(payload, null, 2));
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(payload, null, 2));
  });

program
  .command("dashboard")
  .description("Open a local web UI (127.0.0.1 only) for route/handle")
  .option("-p, --port <n>", "port", "3847")
  .action(async (opts: { port: string }) => {
    const port = Number.parseInt(opts.port, 10);
    if (Number.isNaN(port) || port < 0 || port > 65535) {
      console.error("Invalid port");
      process.exitCode = 1;
      return;
    }
    const { port: bound, close } = await startDashboardServer(port);
    const url = `http://127.0.0.1:${bound}`;
    console.log(`Dashboard: ${url}`);
    console.log("Ctrl+C to stop");
    process.on("SIGINT", () => {
      void close().then(() => process.exit(0));
    });
  });

program
  .command("config-path")
  .description("Print the config file path (respects COMMAND_CENTER_CONFIG)")
  .action(() => {
    console.log(process.env["COMMAND_CENTER_CONFIG"] ?? defaultConfigPath());
  });

program
  .command("doctor")
  .description("Verify projects root exists and list projects")
  .action(() => {
    const config = loadConfig();
    const root = resolveProjectsRoot(config);
    console.log(`projectsRoot: ${root}`);
    console.log(`exists: ${existsSync(root)}`);
    if (existsSync(root)) {
      const ids = listProjectIds(root);
      console.log(`count: ${ids.length}`);
      for (const id of ids) {
        console.log(`  - ${id} -> ${projectPath(root, id)}`);
      }
    }
  });

void program.parseAsync(process.argv);
