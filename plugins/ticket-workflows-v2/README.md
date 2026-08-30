# ticket-workflows-v2

Strangler-fig successor to the `ticket-workflows` plugin. It assumes the `wt` Go CLI
(`wt sprint start` / `wt ticket begin <KEY>`) now **owns orchestration** — creating the branch,
the git worktree, and the ticket context — and that the context lives **flat** under `.scratch/`
(symlinked from the central store — flat `{KEY}-{slug}` leaf, resolved by
`catalyst ticket context-dir`, never a hand-built path):

```
.scratch/
├── ticket-spec.md
├── context.md
├── evidence/
└── decisions/
```

Compared with v1, this plugin:

- **Does not** create branches, worktrees, or context directories — `wt` does that.
- Uses the **flat `.scratch/`** layout, not `.scratch/ticket-workflows/sprint/DEV-XXXX-<desc>/`.
- **Drops beads.** Tracking is via Jira + `.scratch/context.md`.
- Ships **commands only** (no hooks) during the migration, so it does not double-fire against the
  still-installed v1 plugin's hooks.

## Migration status

| Stage   | v2 command                    | Status                                   |
| ------- | ----------------------------- | ---------------------------------------- |
| Begin   | `/ticket-workflows-v2:begin`  | ✅ Migrated (thin: verify + summarize)   |
| Status  | `/ticket-workflows-v2:status` | ✅ Migrated (flat `.scratch/`, no beads) |
| Dev     | —                             | ⬜ Use v1 `/ticket-workflows:dev`        |
| Review  | —                             | ⬜ Use v1 `/ticket-workflows:review`     |
| QA      | —                             | ⬜ Use v1 `/ticket-workflows:qa`         |
| Wrap Up | —                             | ⬜ Use v1 `/ticket-workflows:wrapup`     |

The v1 `ticket-workflows` plugin remains installed and unchanged. Retire it once the remaining
stages are ported and its hooks are re-homed here.
