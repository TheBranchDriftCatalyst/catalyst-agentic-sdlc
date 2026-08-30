# Begin Ticket

Initialize a new ticket workflow with branch creation, context setup, and beads tracking.

## Instructions

1. **Wait** for user to provide ticket specification (upload or paste)

2. **Parse** the ticket to extract:
   - Ticket ID (e.g., DEV-XXXX)
   - Type: feature | bugfix | chore | doc
   - Short description for branch name
   - Acceptance criteria (for beads issue)

3. **Create branch** using format:

   ```
   <type>/DEV-XXXX/<short-description>
   ```

   Examples:
   - `feature/DEV-1234/user-metrics-export`
   - `bugfix/DEV-5678/fix-login-redirect`

4. **Initialize context directory** using the shared resolver — never hand-build
   the path:

   ```bash
   # Derive the ticket key from the branch (still needed for the beads
   # labels + template below)
   BRANCH=$(git branch --show-current)
   TYPE="${BRANCH%%/*}"                # feature | bugfix | chore | doc
   REST="${BRANCH#*/}"                 # DEV-XXXX/<short-description>
   TICKET="${REST%%/*}"                # DEV-XXXX

   WORKFLOW_DIR="$(catalyst ticket context-dir "$TICKET" --ensure)" || {
     echo "ERROR: could not resolve the ticket context dir for $TICKET (is catalyst on PATH and the ticket begun?)" >&2
     exit 1
   }
   # Guard before ANY use: an empty capture (catalyst missing from PATH,
   # resolver refusal) must fail fast — unguarded, mkdir would create
   # /evidence at the filesystem ROOT.
   [ -n "$WORKFLOW_DIR" ] && [ -d "$WORKFLOW_DIR" ] || { echo "ERROR: empty/missing WORKFLOW_DIR" >&2; exit 1; }

   mkdir -p "$WORKFLOW_DIR/evidence"
   mkdir -p "$WORKFLOW_DIR/decisions"
   ```

   `catalyst ticket context-dir <KEY> --ensure` resolves (and creates) the
   canonical central context dir for the ticket — the same dir `catalyst
   ticket update` uses, and the same dir the worktree's `.scratch` symlink
   points at. It is a **flat** `{key}-{slug}` leaf. **Do not** hand-build the
   path and **do not** introduce a grouping segment (`<type>/`, `sprint/`,
   etc.) — the store has no subfolders by type or sprint.

5. **Create beads issue** using the beads MCP tools:

   Use `mcp__plugin_beads_beads__create` with:
   - `title`: "DEV-XXXX: <short description>"
   - `description`: Full ticket description with acceptance criteria
   - `status`: "in-progress"
   - `labels`: ["ticket-workflow", "<type>"]

   Store the returned issue ID (e.g., BD-001) for context.md.

6. **Generate workflow files**:
   - `ticket-spec.md` - Save the uploaded spec
   - `context.md` - Initialize from template below (include beads ID)

## Context Template

```markdown
# Workflow Context: DEV-XXXX

## Ticket Info

- **Ticket ID:** DEV-XXXX
- **Branch:** `<branch>`
- **Type:** feature | bugfix | chore | doc
- **Created:** YYYY-MM-DD
- **Beads Issue:** BD-XXX

## Workflow Progress

- [x] Begin Ticket - Context initialized
- [ ] Development - Implementation in progress
- [ ] Code Review - Quality gate
- [ ] QA - Test audit & verification
- [ ] Wrap Up - PR finalization

## Artifacts

| Stage  | File                    | Status  |
| ------ | ----------------------- | ------- |
| Begin  | `ticket-spec.md`        | Created |
| Dev    | `analysis.md`           | Pending |
| Review | `code-review.md`        | Pending |
| QA     | `evidence/qa-report.md` | Pending |
| Wrapup | `pr-description.md`     | Pending |

## Summaries

### Ticket Summary

<!-- 3-5 bullets: goals, acceptance criteria, scope -->

**Full details:** `ticket-spec.md`

### Implementation Notes

<!-- Updated during development -->

### Key Decisions

<!-- From decisions/*.md -->

### Review Summary

<!-- From code-review.md -->

### QA Summary

<!-- From evidence/qa-report.md -->
```

## Output

Confirm:

- [ ] Branch created and checked out
- [ ] Context directory initialized
- [ ] Ticket spec saved
- [ ] Context index generated
- [ ] Beads issue created: BD-XXX

Ready for development. Use `/ticket-workflows:status` to check progress.
