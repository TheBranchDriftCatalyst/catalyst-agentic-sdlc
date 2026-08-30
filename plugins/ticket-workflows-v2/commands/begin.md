# Begin Ticket (v2)

Hydrate and verify the ticket context that `wt sprint start` already created, summarize the
spec, and mark development in progress.

> **What changed from v1:** orchestration (branch, worktree, context directory, and dropping the
> ticket spec) is now owned by the `wt sprint start` / `wt ticket begin <KEY>` Go CLI. This command
> **does not** create branches, worktrees, or directories, and **does not** create a beads issue.
> Tracking is via Jira + `.scratch/context.md` only. See the plugin `README.md` for migration status.

## Context layout (produced by `wt sprint start`)

`wt` writes the ticket context to a central store — flat `{KEY}-{slug}` leaf, resolved by
`catalyst ticket context-dir` (never a hand-built path) — and symlinks the worktree's `.scratch`
to it, so inside the checkout the context is **flat**:

```
.scratch/
├── ticket-spec.md     # full Jira spec + acceptance criteria
├── context.md         # workflow context tracker (this workflow's index)
├── evidence/          # QA evidence (populated later)
└── decisions/         # decision records (populated later)
```

There is **no** `.scratch/ticket-workflows/sprint/DEV-XXXX-<desc>/` nesting in v2.

## Instructions

1. **Verify the context exists.** Confirm `.scratch/ticket-spec.md` and `.scratch/context.md` are
   present:

   ```bash
   ls .scratch/ticket-spec.md .scratch/context.md
   ```

   If either is missing, **stop** and tell the user to run the orchestrator first — do not create
   anything yourself:

   > No `.scratch` context found for this branch. Run `wt sprint start` (whole sprint) or
   > `wt ticket begin <KEY>` (single ticket) to create the branch/worktree and ticket context,
   > then re-run `/ticket-workflows-v2:begin`.

2. **Load the context.** Read `.scratch/ticket-spec.md` (the full spec + acceptance criteria) and
   `.scratch/context.md` (the tracker). Confirm the branch matches the ticket:

   ```bash
   git branch --show-current
   ```

3. **Summarize the ticket into `context.md`.** Fill the `### Ticket Summary` section with 3–5
   bullets (goal, acceptance criteria, scope/out-of-scope) and add any early `### Implementation
   Notes` you already know. Keep the `**Full details:** ticket-spec.md` pointer.

4. **Mark progress.** In `.scratch/context.md`, set:
   - `- [x] Begin Ticket - Context initialized (by wt sprint start)`
   - `- [ ] Development - Implementation in progress`

5. **No beads.** Do not create or update any beads issue. If the ticket needs sub-task tracking,
   use the Jira link in `context.md`.

## Output

Confirm:

- [ ] `.scratch` context verified (`ticket-spec.md`, `context.md` present)
- [ ] Ticket spec read and summarized into `context.md`
- [ ] Progress updated (Begin ✅, Development in progress)

Ready for development. Use `/ticket-workflows-v2:status` to check progress.

> **Note:** `dev`, `review`, `qa`, and `wrapup` are not yet migrated to v2. Continue to use the v1
> commands (`/ticket-workflows:dev`, `/ticket-workflows:review`, `/ticket-workflows:qa`,
> `/ticket-workflows:wrapup`) for those stages until they are ported.
