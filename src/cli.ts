#!/usr/bin/env node
import { Command } from "commander";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, resolveProjectsRoot } from "./config/loadConfig.js";
import { defaultConfigPath } from "./config/paths.js";
import { runStubAdapter } from "./adapters/stubAdapter.js";
import { listProjectIds, projectPath } from "./projects/listProjects.js";
import { routeText } from "./router/route.js";

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
    const config = loadConfig();
    const result = routeText(text, config.routes);
    console.log(JSON.stringify({ text, ...result }, null, 2));
  });

program
  .command("handle")
  .description("Route and invoke the stub adapter (JSON)")
  .argument("<text>", "Natural language command")
  .action((text: string) => {
    const config = loadConfig();
    const result = routeText(text, config.routes);
    if (!result.matched) {
      console.log(
        JSON.stringify(
          { ok: false, error: "No route matched", text },
          null,
          2,
        ),
      );
      process.exitCode = 1;
      return;
    }
    const out = runStubAdapter({ projectId: result.projectId, text });
    console.log(JSON.stringify({ ok: true, route: result, result: out }, null, 2));
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

program.parse(process.argv);
