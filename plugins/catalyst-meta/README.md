# catalyst-meta

Meta-plugin that bundles the user's globally-useful agents, slash commands, and session hooks. Designed to be kept always-enabled — install it once and leave it on.

## Installation

```
/plugin marketplace add TheBranchDriftCatalyst/catalyst-agentic-sdlc
/plugin install catalyst-meta@catalyst
```

## Contents

### Agents

| Agent                          | Purpose                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `structured-logging-architect` | Senior observability engineer for designing and implementing structured logging (Elasticsearch/Datadog) |

### Slash commands

| Command                        | Purpose                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `/catalyst-meta:memory-status` | Report status of memory-service, codebase-memory, and claude-context layers |
| `/catalyst-meta:init-memory`   | Initialize all three memory layers for a new project                        |
| `/catalyst-meta:save-context`  | Persist session decisions and learnings to memory-service                   |
| `/catalyst-meta:optimize`      | Analyze and optimize code for performance                                   |

### Hooks (wired via `plugin.json`)

| Event                  | Script                    | Purpose                                                                |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------- |
| `SessionStart:startup` | `workstream-briefing.sh`  | Produce the briefing (recent memories, beads status, indexed projects) |
| `SessionStart:compact` | `post-compact-context.sh` | Restore key context after auto-compaction                              |
| `PreCompact`           | `pre-compact.sh`          | Preserve session state and prompt memory persistence before compaction |
| `PreToolUse:Bash`      | `git-guard.sh`            | Block destructive git ops and AI-attribution in commit messages        |

All hook scripts live in `hooks/` and are invoked via `${CLAUDE_PLUGIN_ROOT}/hooks/<name>.sh`. They activate automatically when the plugin is enabled and stop firing if you disable or uninstall it.

See `hooks/HOOKS-LIFECYCLE.md` for the lifecycle and matcher semantics.

## Bundled MCP servers (`.mcp.json`)

The plugin ships an `.mcp.json` that defines the user's standard MCP stack: `playwright`, `filesystem`, `memory`, `sequential-thinking`, `context7`, `claude-context`, `codebase-memory`, `atlassian`, `memory-service`. When catalyst-meta is enabled, Claude Code starts these MCP servers automatically.

**Secrets:** `OPENAI_API_KEY` is read from the shell environment via `${OPENAI_API_KEY}` — never commit a literal key. Export it in your shell rc:

```bash
export OPENAI_API_KEY="sk-proj-..."   # in ~/.zshrc, ~/.bashrc, or a tools-env file
```

**Optional: symlink for global scope.** Plugin MCPs only activate when the plugin is enabled. If you want them loaded in every Claude Code session everywhere — even outside this repo — symlink the plugin's `.mcp.json` to `~/.mcp.json`. Three ways to invoke:

```bash
# from the marketplace repo root (recommended — uses npm alias)
npm run mcp:link
npm run mcp:unlink

# or directly (works from any cwd; the script resolves its own location)
./plugins/catalyst-meta/scripts/install-mcp-symlink.sh
./plugins/catalyst-meta/scripts/install-mcp-symlink.sh --uninstall

# or post-install, from the plugin cache
~/.claude/plugins/cache/catalyst/catalyst-meta/scripts/install-mcp-symlink.sh
```

The script backs up any existing `~/.mcp.json` to `~/.mcp.json.pre-catalyst-meta` before linking. It links to wherever it was invoked from — running it from the source tree links to the source, running it from the plugin cache links to the cache.

## Reference docs

`docs/memory-architecture.md` is a versioned snapshot documenting the three-layer memory architecture (semantic search via `claude-context`, structural code graph via `codebase-memory`, persistent agent memory via `memory-service`). Treat it as reference documentation, not active configuration.

## Scope note

Plugin hooks fire only when the plugin is enabled in the active project. Because catalyst-meta is intended to be always-enabled, this is equivalent to user-global behavior in practice — but it means disabling the plugin will stop the briefing, compact protection, and git-guard from running.
