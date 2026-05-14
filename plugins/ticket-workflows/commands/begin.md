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

4. **Initialize context directory** using the canonical scratch path
   `<type>/DEV-XXXX-<short-description>` (type grouping, dashed leaf):

   ```bash
   # Derive path components from the branch
   BRANCH=$(git branch --show-current)
   TYPE="${BRANCH%%/*}"                # feature | bugfix | chore | doc
   REST="${BRANCH#*/}"                 # DEV-XXXX/<short-description>
   TICKET="${REST%%/*}"                # DEV-XXXX
   DESC="${REST#*/}"                   # <short-description>
   WORKFLOW_DIR=".scratch/ticket-workflows/${TYPE}/${TICKET}-${DESC}"

   mkdir -p "$WORKFLOW_DIR/evidence"
   mkdir -p "$WORKFLOW_DIR/decisions"
   ```

   Examples:
   - Branch `feature/DEV-10092/add-widget-theme-dynamic-vars`
     → `.scratch/ticket-workflows/feature/DEV-10092-add-widget-theme-dynamic-vars/`
   - Branch `bugfix/DEV-9838/add-price-tier-validation`
     → `.scratch/ticket-workflows/bugfix/DEV-9838-add-price-tier-validation/`

   **Do not** drop the `<type>` segment, and **do not** keep `<ticket>` and
   `<desc>` as separate path components. Type groups workflows by branch
   prefix; the dashed leaf keeps ticket + desc visible in a single `ls`.

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
