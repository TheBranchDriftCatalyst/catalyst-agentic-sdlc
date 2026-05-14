# Wrap Up

Complete the PR workflow: review, commit, changelog, PR description, and update beads.

## Prerequisites

Before running wrapup, ensure:

- Development is complete
- Tests are passing
- Code review has been run (or will be run now)

## Steps

### 1. Run Code Review (if not done)

Spawn the `code-review-agent` to review staged changes:

- Check `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/code-review.md` exists
- If not, spawn agent to generate it
- Must pass before continuing

### 2. Run QA (if not done)

Spawn the `qa-agent` if QA hasn't been completed:

- Check `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/evidence/qa-report.md` exists
- If not, spawn agent to generate it
- Must pass before continuing

### 3. Run Coverage Report

Spawn the `coverage-agent` to generate a before/after coverage comparison:

- Scoped to files changed in this branch only
- Compares coverage on base branch vs current branch
- Generates `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/evidence/coverage-report.md`
- Run in background (does not block other wrapup steps)

### 4. Create Changelog Fragment

Extract from branch name:

- Ticket ID: `DEV-XXXX`
- Type: `feature` | `bugfix` | `misc` | `doc`

Create `changes/DEV-XXXX.<type>`:

```
Short description of the change (one line, no ticket number)
```

### 5. Commit Changes

Format: `<action>: DEV-XXXX: <description>`

Actions:

- `add` - New feature
- `update` - Enhancement
- `fix` - Bug fix
- `refactor` - Code restructure
- `docs` - Documentation
- `chore` - Maintenance

### 6. Push & Generate PR Description

Push to remote, then generate `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/pr-description.md`:

```markdown
## Description

[Link to Jira: DEV-XXXX](https://jira.example.com/browse/DEV-XXXX)

<Summary of changes>

## How Has This Been Tested?

<Testing approach - reference qa-report.md>

## Screenshots (if appropriate)

<Reference evidence/\*.png>

## Types of changes

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Refactoring (no functional changes)
- [ ] Chore (build process or auxiliary tools)

## Checklist

- [ ] PR title has ticket number and short description
- [ ] Unit tests added
- [ ] Changelog entry added
- [ ] No field removal + code removal in same PR
- [ ] Release todos added to confluence (if applicable)
```

### 7. Update Beads Issue

Read the beads issue ID from `context.md`, then use beads MCP tools:

1. **Add completion comment** using `mcp__plugin_beads_beads__update`:

   ```
   Comment: "PR ready for review: <PR_URL>

   Summary:
   - Code review: PASS
   - QA: PASS
   - Changelog: changes/DEV-XXXX.<type>"
   ```

2. **Update status** to `review`:

   ```
   status: "review"
   ```

### 8. Update Context File

Update `context.md`:

- Mark all stages complete
- Add final summaries
- Add PR link

## Output

Confirm completion:

- [ ] Code review: PASS
- [ ] QA: PASS
- [ ] Coverage report generated: `evidence/coverage-report.md`
- [ ] Changelog fragment created: `changes/DEV-XXXX.<type>`
- [ ] Commit created
- [ ] Pushed to remote
- [ ] PR description generated
- [ ] Beads issue updated to `review` status

**Links:**

- PR URL: `https://github.com/<org>/<repo>/pull/new/<branch>`
- PR Description: `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/pr-description.md`
- Changelog: `changes/DEV-XXXX.<type>`
- Beads Issue: BD-XXX
