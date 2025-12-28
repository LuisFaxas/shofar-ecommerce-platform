# /wo-implement

Implement a work order by ID.

Usage: `/wo-implement WO-...`

Steps:

1. Read `AGENTS.md` first (authoritative).
2. Read the WO at `docs/work-orders/$ARGUMENTS.md`. If it does not exist, stop and ask.
3. If the WO requires a clean worktree, run `git status` and stop if it is not clean.
4. Confirm scope, constraints, acceptance criteria, and **Recommended Agents**.
5. Use the recommended `.claude/agents/` and report which were used.
6. Implement only what the WO specifies; no unrelated refactors.
7. Do not commit.
8. Run required tests or state why they were not run.
9. Use the `wo-tracker` agent to update `CHECKPOINT.md` and `docs/STATE.md` (append-only).
10. Run the scoped verification commands listed in the WO.
11. Run `git diff --stat`.
