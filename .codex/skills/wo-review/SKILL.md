---
name: wo-review
description: Review Claude output against the active WO and AGENTS.md. Use when asked to audit changes, check scope/constraints, or propose fix-ups after implementation.
---

# WO Review

## Workflow

1. Read `AGENTS.md` and the active WO in `docs/work-orders/<WO>.md` (or referenced location).
2. Confirm the builder used the WO's recommended agents (or note if missing).
3. Inspect the change set and map each change to a WO acceptance criterion.
4. Use the WO's scoped verification steps (e.g., `git diff --name-only -- <allowed paths>`).
5. Flag scope creep, constraint violations, missing tests, and risky behavior.
6. Summarize findings as: must-fix, should-fix, nice-to-have.
7. Propose fix-ups as a short, ordered list.

## Output Rules

- Cite file paths precisely.
- If no issues, state that explicitly and note any testing gaps.
