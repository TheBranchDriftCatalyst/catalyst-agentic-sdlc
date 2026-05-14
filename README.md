# catalyst

Private Claude Code plugin marketplace. Hosts the Catalyst family of multi-agent SDLC and workflow plugins.

## Repository layout

```
catalyst-agentic-sdlc/                  # repo root = marketplace root
├── .claude-plugin/
│   └── marketplace.json                # marketplace catalog (name: "catalyst")
└── plugins/
    ├── catalyst-sdlc-framework/        # plugin: Cognitive Council SDLC framework
    │   ├── .claude-plugin/plugin.json
    │   ├── agents/                     # 7 council experts + structured-logging-architect
    │   └── commands/                   # /sdlc-council, /sdlc-council-quick
    ├── ticket-workflows/               # plugin: structured ticket workflow
    │   ├── .claude-plugin/plugin.json  # ships PostToolUse/PreToolUse/Stop hooks
    │   ├── agents/                     # dev, review, qa, coverage
    │   ├── commands/                   # begin, status, review, qa, tech-compare, wrapup, dev
    │   └── templates/                  # context, pr-description, qa-report
    └── catalyst-meta/                  # plugin: global commands, hooks, MCP servers
        ├── .claude-plugin/plugin.json  # wires SessionStart/PreCompact/PreToolUse hooks
        ├── .mcp.json                   # bundled MCP server stack
        ├── commands/                   # memory-status, init-memory, save-context, optimize
        ├── hooks/                      # workstream-briefing, pre/post-compact, git-guard
        └── docs/                       # memory-architecture reference
```

The repo follows the multi-plugin marketplace pattern from the Claude Code [plugin marketplace docs](https://code.claude.com/docs/en/plugin-marketplaces): a single `marketplace.json` at the root lists every plugin, each plugin lives under `plugins/<name>/` with its own `.claude-plugin/plugin.json` and component directories (`agents/`, `commands/`, `skills/`, `hooks/`).

## Install

```
# During development (local path)
/plugin marketplace add /Users/panda/catalyst-devspace/workspace/catalyst-sdlc-framework

# From GitHub
/plugin marketplace add TheBranchDriftCatalyst/catalyst-agentic-sdlc

/plugin install catalyst-sdlc-framework@catalyst
/plugin install ticket-workflows@catalyst
/plugin install catalyst-meta@catalyst
```

Installed plugins are cached at `~/.claude/plugins/cache/` — re-run `/plugin marketplace update catalyst` after structural changes to pull updated manifests.

---

## Plugin: `catalyst-sdlc-framework`

A 6-expert Cognitive Council that decomposes epics and features into structured, sequenced SDLC task manifests through a strict 5-phase deliberation protocol. The goal is to surface dissent, prevent groupthink, and produce a manifest a delivery team can turn into tickets without further refinement.

### Slash commands

| Command                      | Purpose                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `/sdlc-council <epic>`       | Full council deliberation — all 5 phases, all 6 experts. Use for complex initiatives where consensus quality matters. |
| `/sdlc-council-quick <epic>` | Single-pass decomposition for straightforward features. Faster and cheaper, no cross-critique.                        |

### The 6 experts

| Agent                    | Perspective                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `sdlc-systems-architect` | Component boundaries, API contracts, data models, integration points                   |
| `sdlc-impl-engineer`     | Code-level granularity, effort, sequencing, developer experience                       |
| `sdlc-qa-strategist`     | Test coverage, acceptance criteria, edge cases, quality gates                          |
| `sdlc-devops-delivery`   | CI/CD, infrastructure, release strategy, feature flags                                 |
| `sdlc-product-design`    | User journeys, story mapping, value delivery sequencing                                |
| `sdlc-red-team`          | Adversarial — challenges necessity, finds scope creep, argues for minimum viable scope |

### Additional design agents

| Agent                          | Purpose                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `structured-logging-architect` | Senior observability engineer — designs structured logging for Elasticsearch/Datadog. Invoke directly when needed. |

### The 5-phase protocol

```
Phase 0: Problem Framing         (orchestrator frames the epic)
Phase 1: Independent Hypothesis  (6 experts in parallel, isolated — no peer awareness)
Phase 2: Cross-Critique          (6 experts after reading ALL peer hypotheses)
Phase 3: Revision                (6 experts after reading ALL critiques)
Phase 4: Final Vote              (6 experts)
Phase 5: Synthesis               (orchestrator produces COUNCIL_VERDICT)
```

Phase gates are strict — every Phase N task completes before any Phase N+1 task begins. Phase 1 isolation is what gives the council its anti-groupthink property: experts independently anchor before they're allowed to see each other.

### Output: `COUNCIL_VERDICT`

The orchestrator returns a structured manifest:

- **Council summary** — consensus level, confidence distribution, quality metrics
- **Unified task manifest** — merged tasks by delivery phase with dependencies, effort, risk, acceptance criteria
- **Dissenting views** — minority positions the user should weigh
- **Contested items** — explicit trade-offs for user decision
- **Delivery sequence** — critical path and parallelizable work

Synthesis uses a confidence-weighted agreement matrix with an independence bonus and quorum rules, so a high-confidence Red Team objection isn't silently averaged away by five enthusiastic builders.

---

## Plugin: `ticket-workflows`

Structured ticket workflow with progressive context, beads integration, quality gates, and per-stage agents. Drives a ticket from branch creation through dev → review → QA → wrapup, accumulating evidence in `.scratch/ticket-workflows/<type>/<id>-<desc>/`.

### Slash commands

| Command                          | Purpose                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `/ticket-workflows:begin`        | Initialize branch, context dir, and beads issue                |
| `/ticket-workflows:dev`          | Plan → implement → verify → critique loop                      |
| `/ticket-workflows:status`       | Show progress including beads issue state                      |
| `/ticket-workflows:review`       | Run `code-review-agent` and generate a scorecard               |
| `/ticket-workflows:qa`           | Run `qa-agent` (test audit + manual verification)              |
| `/ticket-workflows:tech-compare` | Structured technology evaluation                               |
| `/ticket-workflows:wrapup`       | Commit, changelog fragment, push, PR description, update beads |

### Agents

`dev-agent`, `code-review-agent`, `qa-agent`, `coverage-agent` — invoked by the slash commands above.

### Hooks (auto-wired)

| Event         | Trigger           | Action                                          |
| ------------- | ----------------- | ----------------------------------------------- |
| `PostToolUse` | `git checkout -b` | Remind to run `/ticket-workflows:begin`         |
| `PreToolUse`  | `git commit`      | Warn if no changelog fragment in `changes/`     |
| `Stop`        | end of session    | Remind to update workflow context if one exists |

---

## Plugin: `catalyst-meta`

Bundles globally-useful slash commands, session hooks, and an MCP server stack. Intended to be installed once and left always-enabled — provides the workstream briefing at session start, compact protection, and the git-guard policy enforcement.

### Slash commands

| Command                        | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| `/catalyst-meta:memory-status` | Status of all three memory layers           |
| `/catalyst-meta:init-memory`   | Initialize memory layers for a new project  |
| `/catalyst-meta:save-context`  | Persist session learnings to memory-service |
| `/catalyst-meta:optimize`      | Analyze and optimize code for performance   |

### Hooks (auto-wired)

| Event                  | Script                    | Purpose                                                 |
| ---------------------- | ------------------------- | ------------------------------------------------------- |
| `SessionStart:startup` | `workstream-briefing.sh`  | Briefing (recent memories, beads status, indexed repos) |
| `SessionStart:compact` | `post-compact-context.sh` | Restore context after auto-compaction                   |
| `PreCompact`           | `pre-compact.sh`          | Preserve state and prompt memory persistence            |
| `PreToolUse:Bash`      | `git-guard.sh`            | Block destructive git ops and AI-attribution in commits |

All hook scripts live in `plugins/catalyst-meta/hooks/` and are referenced via `${CLAUDE_PLUGIN_ROOT}/hooks/<script>.sh`. They fire only when the plugin is enabled — equivalent to user-global hooks in practice if you keep the plugin always on.

---

## Adding a new plugin

1. `mkdir -p plugins/<name>/{.claude-plugin,agents,commands,skills}`
2. Create `plugins/<name>/.claude-plugin/plugin.json` with at minimum `{ "name": "<name>" }`
3. Append the plugin entry to `.claude-plugin/marketplace.json` under `plugins[]`
4. Drop agent/command/skill definitions into the component directories
5. `/plugin marketplace update catalyst` then `/plugin install <name>@catalyst`

Agent and skill names are auto-namespaced by Claude Code as `<plugin-name>:<component-name>` (e.g. `catalyst-sdlc-framework:council-orchestrator`).

---

## Development

```bash
npm install              # installs lefthook hooks via "prepare"
npm run validate:manifests
npm run lint:md          # markdownlint-cli2
npm run format           # prettier --write
npm run format:check     # prettier --check (CI uses this)
```

Pre-commit (lefthook) runs on staged files: markdownlint → prettier → manifest validation. Commit messages are linted by commitlint against [Conventional Commits](https://www.conventionalcommits.org/).

### Conventional commit format

```
<type>(<scope>): <subject>

[optional body]
[optional footer(s)]
```

| Type       | Bumps | Use for                                                  |
| ---------- | ----- | -------------------------------------------------------- |
| `feat`     | minor | new agent, command, plugin, or capability                |
| `fix`      | patch | corrections to existing prompt or manifest behavior      |
| `docs`     | none  | README and other documentation                           |
| `refactor` | none  | restructuring without behavior change                    |
| `build`    | none  | tooling, lint, prettier, lefthook config                 |
| `ci`       | none  | GitHub Actions workflows                                 |
| `chore`    | none  | maintenance (deps, version bumps); hidden from CHANGELOG |

**Scopes** (enforced by the `commitlint` key in `package.json`): `marketplace`, `sdlc-framework`, `ticket-workflows`, `catalyst-meta`, `tooling`, `docs`, `deps`, `ci`, `release`.

A `BREAKING CHANGE:` footer or `!` suffix (`feat!:`) bumps the major version.

### Cutting a release

```bash
npm run release:dry      # preview version bump + changelog diff
npm run release          # bumps package.json + plugin.json files, regenerates CHANGELOG.md, commits, tags
git push --follow-tags origin main
```

`commit-and-tag-version` infers the bump from commits since the last tag, updates `package.json` plus every plugin's `plugin.json` (see the `commit-and-tag-version.bumpFiles` array in `package.json`), and rewrites `CHANGELOG.md`. Pushing the tag triggers `.github/workflows/release.yml`, which extracts the section for that version from the changelog and creates a GitHub Release.

> Note: this marketplace is currently single-versioned — all plugins bump together. When plugins diverge enough to need independent release cycles, migrate to [changesets](https://github.com/changesets/changesets).
