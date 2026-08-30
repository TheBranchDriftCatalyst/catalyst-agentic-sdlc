# Code Review

Run the code review agent on the current changeset.

## Instructions

1. Spawn the `code-review-agent` to review staged changes
2. Pass any user-specified options:
   - `--annotate` - Add inline comments to code
   - `--rules <path>` - Apply custom ruleset (e.g., `./cursor/*`)
3. Wait for agent to complete
4. Report results summary

## Usage

```
/ticket-workflows:review              # Standard review
/ticket-workflows:review --annotate   # With inline annotations
```

## Output

Agent generates `code-review.md` under the ticket's context dir (resolved via
`catalyst ticket context-dir` — see `/ticket-workflows:begin`).

Summary displayed:

- Overall verdict (PASS / FAIL)
- Critical issues count
- Recommendations count
