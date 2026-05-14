# Coverage Agent

Autonomous agent that generates a before/after test coverage report scoped to the files changed in the current ticket.

## Behavior

This agent:

1. Identifies changed files from the branch diff
2. Runs coverage on the base branch (before) for those files
3. Runs coverage on the current branch (after) for those files
4. Produces a comparative report showing coverage deltas
5. Saves the report to the workflow evidence directory

## Phase 1: Identify Scope

1. Determine the base branch:
   - Read `context.md` for the branch info
   - Or derive from git: `git merge-base HEAD <base-branch>`
2. Get changed source files (exclude tests, configs, templates):

   ```bash
   git diff <base-branch>...HEAD --name-only -- '*.py' | grep -v test | grep -v migration
   ```

3. Get changed/added test files:

   ```bash
   git diff <base-branch>...HEAD --name-only -- '*.py' | grep test
   ```

4. Identify the relevant test modules to run (tests that cover the changed source files)

## Phase 2: Baseline Coverage (Before)

1. Stash current changes or use git worktree/checkout to get the base branch state
2. Run coverage on the relevant test modules scoped to changed source files:

   ```bash
   coverage run --source=<changed_source_files_comma_separated> -m pytest <relevant_tests> -q
   coverage json -o /tmp/coverage-before.json
   coverage report --include=<changed_files_pattern>
   ```

   Or for Django:

   ```bash
   coverage run --source=<paths> manage.py test <test_modules> --verbosity=0
   coverage json -o /tmp/coverage-before.json
   coverage report --include=<changed_files_pattern>
   ```

3. Capture per-file coverage percentages
4. If base branch has no tests for these files, record 0% baseline
5. Return to the feature branch

## Phase 3: Current Coverage (After)

1. On the current branch, run coverage on the same scope + any new test files:

   ```bash
   coverage run --source=<changed_source_files> -m pytest <relevant_tests + new_tests> -q
   coverage json -o /tmp/coverage-after.json
   coverage report --include=<changed_files_pattern>
   ```

2. Capture per-file coverage percentages

## Phase 4: Generate Report

Produce a comparative report:

```markdown
# Coverage Report: DEV-XXXX

**Date:** YYYY-MM-DD
**Branch:** <branch>
**Base:** <base-branch>

## Summary

| Metric                  | Before | After | Delta |
| ----------------------- | ------ | ----- | ----- |
| Overall (changed files) | XX%    | XX%   | +XX%  |
| Statements covered      | N/M    | N/M   | +N    |
| New files coverage      | —      | XX%   | —     |

## Per-File Breakdown

| File                          | Before | After | Delta | Notes |
| ----------------------------- | ------ | ----- | ----- | ----- |
| `src/apps/module/file.py`     | 85%    | 92%   | +7%   |       |
| `src/apps/module/new_file.py` | —      | 78%   | new   |       |

## Uncovered Lines

### `src/apps/module/file.py`

- Lines 45-48: error handling branch (SendGrid timeout)
- Line 72: edge case when user has no email

### `src/apps/module/new_file.py`

- Lines 30-35: database transaction rollback path

## Test Files

| Test File              | Tests | Status   |
| ---------------------- | ----- | -------- |
| `tests/test_module.py` | 7     | All pass |
| `tests/test_new.py`    | 4     | All pass |

## Recommendations

- <specific uncovered paths worth testing>
- <or "coverage is adequate for this changeset">
```

Save to: `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/evidence/coverage-report.md`

## Fallback Behavior

If coverage tools are unavailable or tests require infrastructure (Docker, DB) not available locally:

1. **Try running only SimpleTestCase/unit tests** that don't need DB/Redis
2. **Parse test files statically** — count test methods, map to source functions
3. **Report what's testable vs what needs CI** — don't fail, just document the gap

## Important Notes

- Do NOT modify any code — this agent is read-only + test execution
- Use `--source` to scope coverage narrowly to changed files (avoid slow full-project runs)
- If the base branch doesn't exist locally, fetch it: `git fetch origin <base-branch>`
- Clean up temp files (`/tmp/coverage-*.json`, `.coverage`) after report generation
- For Django projects, check if there's a custom test runner (e.g., `_project/runner.py`) and adapt accordingly
