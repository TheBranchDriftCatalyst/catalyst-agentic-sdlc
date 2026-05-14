# ticket-workflows

Structured ticket workflow for Claude Code with progressive context, automated hooks, beads integration, and quality gates.

## Installation

Install via the catalyst marketplace:

```
/plugin marketplace add TheBranchDriftCatalyst/catalyst-agentic-sdlc
/plugin install ticket-workflows@catalyst
```

Hooks (PostToolUse on `git checkout -b`, PreToolUse on `git commit`, and Stop) are bundled in the plugin manifest and activate automatically when the plugin is enabled. See `.claude-plugin/plugin.json` for the exact wiring.

## Commands

| Command                          | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `/ticket-workflows:begin`        | Initialize workflow: branch, context, beads issue      |
| `/ticket-workflows:status`       | Show progress including beads issue state              |
| `/ticket-workflows:review`       | Run code review agent                                  |
| `/ticket-workflows:qa`           | Run QA agent (test audit + verification)               |
| `/ticket-workflows:tech-compare` | Structured technology evaluation                       |
| `/ticket-workflows:wrapup`       | Complete workflow: commit, changelog, PR, update beads |

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  /ticket-workflows:begin                                               │
│  ├─ Creates branch                                          │
│  ├─ Initializes .scratch/ticket-workflows/                  │
│  └─ Creates beads issue (BD-XXX) with status: in-progress   │
├─────────────────────────────────────────────────────────────┤
│  Development (manual)                                        │
│  └─ Write code, optionally /ticket-workflows:tech-compare             │
├─────────────────────────────────────────────────────────────┤
│  /ticket-workflows:review                                              │
│  └─ Spawns code-review-agent, generates scorecard           │
├─────────────────────────────────────────────────────────────┤
│  /ticket-workflows:qa                                                  │
│  └─ Spawns qa-agent, test audit + manual verification       │
├─────────────────────────────────────────────────────────────┤
│  /ticket-workflows:wrapup                                              │
│  ├─ Commit, changelog, push, PR description                 │
│  └─ Updates beads issue to status: review                   │
└─────────────────────────────────────────────────────────────┘
```

## Hooks

Wired in this plugin's `.claude-plugin/plugin.json` (auto-activates when the plugin is enabled):

| Event         | Trigger           | Action                                  |
| ------------- | ----------------- | --------------------------------------- |
| `PostToolUse` | `git checkout -b` | Remind to run `/ticket-workflows:begin` |
| `PreToolUse`  | `git commit`      | Warn if no changelog fragment           |
| `Stop`        | Session end       | Remind to update context                |

## Beads Integration

This plugin integrates with the beads issue tracker.

### On begin

- Creates a beads issue with the ticket ID and description
- Labels: `ticket-workflow`, `<type>` (feature/bugfix/etc)
- Status: `in-progress`

### On status

- Shows beads issue state, labels, recent comments

### On wrapup

- Adds comment with PR link and summary
- Updates status to `review`

## Directory Structure

```
.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/
├── context.md           # Workflow index & progress (includes beads ID)
├── ticket-spec.md       # Original ticket
├── analysis.md          # Technical approach (optional)
├── code-review.md       # Review scorecard
├── pr-description.md    # PR description
├── evidence/
│   ├── qa-report.md     # QA results
│   ├── curl-commands.md # API verification
│   ├── seeds.md         # Seed data docs
│   └── *.png            # Screenshots
└── decisions/
    └── *.md             # Tech decisions
```

## Agents

Two autonomous agents handle complex tasks:

### code-review-agent

- Reviews staged changes against comprehensive checklist
- Generates scorecard with pass/fail verdict
- Categories: Code Quality, Django, Security, Error Handling, Type Safety, Tests

### qa-agent

- Audits automated test coverage
- Executes manual verification (curl, Playwright)
- Collects evidence (responses, screenshots)
- Documents seed data requirements

## Templates

Templates in `templates/` can be customized:

- `context.md.tmpl` - Workflow context file
- `pr-description.md.tmpl` - PR description format
- `qa-report.md.tmpl` - QA report format
