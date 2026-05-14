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

Agent generates `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/code-review.md`
(derived from the current branch — see `/ticket-workflows:begin` for the canonical path template).

Summary displayed:

- Overall verdict (PASS / FAIL)
- Critical issues count
- Recommendations count
