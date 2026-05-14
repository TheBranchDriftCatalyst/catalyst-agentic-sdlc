# Dev

Run the developer agent to implement ticket requirements through an iterative dev-critic-verify loop.

## Instructions

1. Identify the current branch and derive the workflow context path
2. Spawn the `dev-agent` with the ticket spec and any user options
3. The agent will:
   - Plan implementation steps from ticket requirements
   - Write code and tests iteratively
   - Verify with Playwright MCP where possible, otherwise tests
   - Self-critique against acceptance criteria
   - Loop until clean or max iterations reached
4. Report results summary

## Usage

```
/ticket-workflows:dev                     # Full dev loop (plan → implement → verify → critique)
/ticket-workflows:dev --step 3            # Resume from step 3
/ticket-workflows:dev --tests-only        # Only write tests for existing implementation
/ticket-workflows:dev --no-playwright     # Skip Playwright verification, tests only
```

## Output

Agent produces:

- Code changes (staged, not committed)
- Test files
- Evidence in `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/evidence/`
- Updated `context.md` with implementation notes

Summary displayed:

- Iterations completed
- Changes made (files + line counts)
- Test results (pass/fail)
- Acceptance criteria coverage
- Remaining work (if any)
