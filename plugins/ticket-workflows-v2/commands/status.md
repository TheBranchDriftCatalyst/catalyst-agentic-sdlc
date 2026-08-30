# Workflow Status (v2)

Show the current workflow status for the active branch, read from the flat `.scratch/` context
that `wt sprint start` created.

> **What changed from v1:** the context is now flat at `.scratch/` (no
> `.scratch/ticket-workflows/sprint/DEV-XXXX-<desc>/` nesting), and there is **no beads** section —
> tracking is via Jira + `.scratch/context.md`.

## Instructions

1. **Get the current branch:**

   ```bash
   git branch --show-current
   ```

2. **Locate the context — it is flat at `.scratch/`.** No path derivation from the branch is needed:

   ```bash
   ls .scratch/context.md
   ```

   If `.scratch/context.md` does not exist, report: "No workflow context for this branch — run
   `wt sprint start` (or `wt ticket begin <KEY>`), then `/ticket-workflows-v2:begin`."

3. **Read `.scratch/context.md`** and display:
   - Ticket info (ID, type, created date, **Jira link**)
   - Workflow progress (which stages are complete)
   - Artifacts status
   - Recent summaries

4. **Check git status:**
   - Uncommitted changes
   - Commits ahead of remote
   - Missing changelog fragment (`changes/`)

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  WORKFLOW STATUS: DEV-XXXX                                    ║
╠══════════════════════════════════════════════════════════════╣
║  Branch: feature/DEV-1234/user-metrics                        ║
║  Type: feature                                                ║
║  Started: 2026-01-15                                          ║
║  Jira: https://protecht-inc.atlassian.net/browse/DEV-1234     ║
╠══════════════════════════════════════════════════════════════╣
║  PROGRESS                                                     ║
║  ✅ Begin Ticket                                              ║
║  ✅ Development                                               ║
║  ⏳ Code Review                                               ║
║  ⬜ QA                                                        ║
║  ⬜ Wrap Up                                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ARTIFACTS                                                    ║
║  ✅ ticket-spec.md                                            ║
║  ✅ analysis.md                                               ║
║  ⬜ code-review.md                                            ║
║  ⬜ evidence/qa-report.md                                     ║
║  ⬜ pr-description.md                                         ║
╠══════════════════════════════════════════════════════════════╣
║  GIT STATUS                                                   ║
║  3 uncommitted changes                                       ║
║  📤 2 commits ahead of origin                                 ║
║  ⚠  No changelog fragment                                    ║
╚══════════════════════════════════════════════════════════════╝
```

## Next Steps

Based on status, suggest the next action. `dev`/`review`/`qa`/`wrapup` are not yet migrated to v2,
so point at the v1 commands for now:

- If no development → "Run `/ticket-workflows-v2:begin`, then `/ticket-workflows:dev`"
- If no review → "Run `/ticket-workflows:review`"
- If no QA → "Run `/ticket-workflows:qa`"
- If all ready → "Run `/ticket-workflows:wrapup`"
