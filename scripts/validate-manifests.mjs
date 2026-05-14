#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const root = process.cwd();

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path}: invalid JSON — ${e.message}`);
    return null;
  }
}

const marketplacePath = join(root, ".claude-plugin", "marketplace.json");
if (!existsSync(marketplacePath)) {
  errors.push(`.claude-plugin/marketplace.json: missing`);
} else {
  const m = loadJson(marketplacePath);
  if (m) {
    if (!m.name) errors.push(`marketplace.json: missing required field "name"`);
    if (!m.owner?.name) errors.push(`marketplace.json: missing required field "owner.name"`);
    if (!Array.isArray(m.plugins) || m.plugins.length === 0) {
      errors.push(`marketplace.json: "plugins" must be a non-empty array`);
    } else {
      const seen = new Set();
      for (const p of m.plugins) {
        if (!p.name) errors.push(`marketplace.json: plugin entry missing "name"`);
        if (!p.source) errors.push(`marketplace.json: plugin "${p.name}" missing "source"`);
        if (seen.has(p.name)) errors.push(`marketplace.json: duplicate plugin name "${p.name}"`);
        seen.add(p.name);
        if (p.source?.startsWith("./")) {
          const pluginRoot = join(root, p.source);
          const pluginManifest = join(pluginRoot, ".claude-plugin", "plugin.json");
          if (!existsSync(pluginManifest)) {
            errors.push(`marketplace.json: plugin "${p.name}" source ${p.source} has no .claude-plugin/plugin.json`);
          }
        }
      }
    }
  }
}

const pluginsDir = join(root, "plugins");
if (existsSync(pluginsDir)) {
  for (const entry of readdirSync(pluginsDir)) {
    const dir = join(pluginsDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const manifest = join(dir, ".claude-plugin", "plugin.json");
    if (!existsSync(manifest)) {
      errors.push(`plugins/${entry}: missing .claude-plugin/plugin.json`);
      continue;
    }
    const p = loadJson(manifest);
    if (p && !p.name) errors.push(`plugins/${entry}/.claude-plugin/plugin.json: missing required field "name"`);
  }
}

if (errors.length > 0) {
  console.error("[validate-manifests] failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("[validate-manifests] all manifests OK");
