# Workflow Status

Show current workflow status for the active branch, including beads issue state.

## Instructions

1. **Get current branch**:

   ```bash
   git branch --show-current
   ```

2. **Find context directory** — canonical path is
   `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/`, derived
   from the current branch:

   ```bash
   BRANCH=$(git branch --show-current)
   TYPE="${BRANCH%%/*}"
   REST="${BRANCH#*/}"
   TICKET="${REST%%/*}"
   DESC="${REST#*/}"
   WORKFLOW_DIR=".scratch/ticket-workflows/${TYPE}/${TICKET}-${DESC}"
   ```

   If `$WORKFLOW_DIR` does not exist, report "No workflow initialized for
   this branch".

3. **Read context.md** and display:
   - Ticket info (ID, type, created date, beads issue)
   - Workflow progress (which stages complete)
   - Artifacts status
   - Recent summaries

4. **Check beads issue** using MCP tools:

   Use `mcp__plugin_beads_beads__show` with the issue ID from context.md.
   Report:
   - Current status
   - Labels
   - Recent comments
   - Dependencies (if any)

5. **Check git status**:
   - Uncommitted changes
   - Commits ahead of remote
   - Missing changelog fragment

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  WORKFLOW STATUS: DEV-XXXX                                   ║
╠══════════════════════════════════════════════════════════════╣
║  Branch: feature/DEV-1234/user-metrics                       ║
║  Type: feature                                               ║
║  Started: 2024-01-15                                         ║
║  Beads: BD-001 (in-progress)                                 ║
╠══════════════════════════════════════════════════════════════╣
║  PROGRESS                                                    ║
║  ✅ Begin Ticket                                             ║
║  ✅ Development                                              ║
║  ⏳ Code Review                                              ║
║  ⬜ QA                                                       ║
║  ⬜ Wrap Up                                                  ║
╠══════════════════════════════════════════════════════════════╣
║  ARTIFACTS                                                   ║
║  ✅ ticket-spec.md                                           ║
║  ✅ analysis.md                                              ║
║  ⬜ code-review.md                                           ║
║  ⬜ evidence/qa-report.md                                    ║
║  ⬜ pr-description.md                                        ║
╠══════════════════════════════════════════════════════════════╣
║  GIT STATUS                                                  ║
║  3 uncommitted changes                                    ║
║  📤 2 commits ahead of origin                                ║
║  No changelog fragment                                   ║
╠══════════════════════════════════════════════════════════════╣
║  BEADS ISSUE: BD-001                                         ║
║  Status: in-progress                                         ║
║  Labels: ticket-workflow, feature                            ║
║  Last comment: "Started implementation"                      ║
╚══════════════════════════════════════════════════════════════╝
```

## Next Steps

Based on status, suggest next action:

- If no review → "Run /ticket-workflows:review"
- If no QA → "Run /ticket-workflows:qa"
- If all ready → "Run /ticket-workflows:wrapup"
