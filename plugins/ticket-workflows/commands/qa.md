# QA

Run the QA agent for test audit and manual verification.

## Instructions

1. Spawn the `qa-agent` to:
   - Audit automated test coverage
   - Execute manual verification
   - Collect evidence
2. Wait for agent to complete
3. Report results summary

## Usage

```
/ticket-workflows:qa                  # Full QA (audit + verification)
/ticket-workflows:qa --audit-only     # Just test audit, skip manual
/ticket-workflows:qa --verify-only    # Just manual verification
```

## Output

Agent generates in `evidence/` under the ticket's context dir (resolved via
`catalyst ticket context-dir` — see `/ticket-workflows:begin`):

- `qa-report.md` - Combined report
- `curl-commands.md` - API verification scripts
- `seeds.md` - Seed data requirements
- `manual-verification-*.png` - Screenshots

Summary displayed:

- Test audit results (pass/fail counts)
- Manual verification results
- Overall verdict (PASS / FAIL)
