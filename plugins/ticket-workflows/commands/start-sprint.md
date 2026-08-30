# Start Sprint

Bootstrap an entire sprint at once: pull the current Jira sprint, create an isolated git **worktree** per
ticket, and run the `begin` procedure for each — so every ticket has a branch, a context directory, and a
beads issue before any coding starts.

This is the fan-out companion to `/ticket-workflows:begin` (which handles a single ticket). All per-ticket
context lives in the **one** canonical `.scratch/ticket-workflows/sprint/` folder in the main checkout — not
inside each worktree.

## Prerequisites

- Atlassian MCP access (to read the sprint) and beads (task tracking).
- A git repo with a stable integration base branch (e.g. `develop`).
- `gh` CLI (only needed when stacking a ticket on a dependency's open PR).

## Instructions

1. **Pull the sprint.** Query Jira for the caller's tickets in the active sprint:

   ```
   assignee = currentUser() AND sprint IN openSprints() ORDER BY status ASC, created ASC
   ```

   Request only small fields (`summary`, `status`, `issuetype`) to avoid oversized responses. Present the
   list back to the user as a table (ticket · type · status · summary).

2. **Confirm scope** with the user before creating anything (use AskUserQuestion):
   - **Repo + worktree location** — resolve any `<repo>` placeholder against the real path. Default to a
     single shared folder `<repo>/worktrees/DEV-XXXX-<short-desc>`.
   - **Which tickets** — all sprint tickets, or a subset (users often exclude performance/spike tickets).
   - **Branch naming** — repo convention `type/DEV-XXXX/<slug>` (feature/bugfix/chore/doc), and **reuse an
     existing branch** as the base when one already exists for a ticket.

3. **Prepare the repo (once):**

   ```bash
   git fetch origin --prune                 # refresh origin/develop + any relevant branches
   grep -qxF '/worktrees/' .git/info/exclude || printf '/worktrees/\n' >> .git/info/exclude
   mkdir -p worktrees
   ```

   Base new branches on `origin/develop` (remote ref), not the working branch — the main checkout's branch
   may be volatile.

4. **Per ticket, derive names** the same way `begin` does:
   - Type: `feature | bugfix | chore | doc` (from issue type + summary).
   - Slug: short dashed description.
   - Branch: `<type>/DEV-XXXX/<slug>` · Worktree dir: `worktrees/DEV-XXXX-<slug>`.

5. **Create the worktree** (choose the base):
   - **New ticket:** `git worktree add -b <branch> worktrees/DEV-XXXX-<slug> origin/develop`
   - **Existing branch:** `git worktree add worktrees/DEV-XXXX-<slug> <existing-branch>`
   - **Stacked on a dependency's open PR** (the ticket is blocked-by another whose PR is in review): base it
     on that PR head so the producer code is present —
     `git worktree add -B <branch> worktrees/DEV-XXXX-<slug> origin/<dep-pr-head>` (find the PR with
     `gh pr list --search "<DEP-KEY>"`). Note it will need periodic rebases and a retarget to `develop`
     once the dependency merges.

6. **Run `begin` for each ticket** (see `/ticket-workflows:begin`), with the branch already created:
   - Context dir: **`.scratch/ticket-workflows/sprint/DEV-XXXX-<slug>/`** in the **main checkout** (single
     `sprint/` folder for all active tickets; `.scratch/` is gitignored). Add `evidence/` + `decisions/`.
   - Save `ticket-spec.md` (full Jira description, acceptance, manual-test scenarios) and `context.md`
     (from the begin template, including the beads issue id, branch, and worktree path).
   - Create a beads issue per ticket (`title` `DEV-XXXX: <short desc>`, labels `["ticket-workflow","<type>"]`).

7. **Wire tracking to reality:**
   - Add beads **dependencies** for known blockers (`bd dep add <blocked> <blocker>`), including a tracker
     issue for an external/out-of-sprint blocker so `bd blocked` is accurate.
   - **Mirror Jira status:** `bd update <id> --claim` only for tickets actually In Progress; leave Backlog
     tickets `open` so `bd ready` isn't polluted.

8. **Report** a summary table: ticket → worktree → branch → base → beads id → status. Call out stacked-on-PR
   tickets, external dependencies, and any open questions surfaced by the specs.

## Notes

- **One context tree.** Everything lives under the main checkout's `.scratch/ticket-workflows/sprint/`;
  worktrees hold only code. Prior sprints are archived flat under `.scratch/ticket-workflows/legacy/`.
- **Idempotent.** Skip (and report) any worktree dir or context dir that already exists rather than failing
  the batch.
- **Don't disturb the main checkout.** Never switch its branch or touch its uncommitted changes.

## Output

Confirm:

- [ ] Sprint pulled and scope confirmed
- [ ] Worktree created per ticket (`<repo>/worktrees/DEV-XXXX-<slug>`)
- [ ] Context initialized per ticket under `.scratch/ticket-workflows/sprint/`
- [ ] Beads issue created per ticket, dependencies wired, statuses mirrored

Ready for development. Use `/ticket-workflows:status` (per worktree) or `/ticket-workflows:dev` to proceed.
