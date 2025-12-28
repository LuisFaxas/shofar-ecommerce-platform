# /wo-review

Review implementation against the WO and `AGENTS.md`.

Usage: `/wo-review WO-...`

Steps:

1. Read `AGENTS.md`.
2. Read the WO at `docs/work-orders/$ARGUMENTS.md`. If it does not exist, stop and ask.
3. Confirm the builder used the WO's **Recommended Agents** (ask if not reported).
4. Inspect changes and map them to acceptance criteria.
5. Verify changes are scoped using the WO's verification steps (e.g., `git diff --name-only -- <allowed paths>`).
6. List issues by severity: must-fix, should-fix, nice-to-have.
7. Note scope creep, guardrail violations, and testing gaps.
8. Do not commit.
9. Run `git diff --stat`.
