# /wo-fix

Apply fix-ups from the latest review for a WO.

Usage: `/wo-fix WO-...`

Steps:

1. Read `AGENTS.md`.
2. Read the WO at `docs/work-orders/$ARGUMENTS.md` and the latest review notes.
3. Use the WO's **Recommended Agents** if the fixes touch their domains.
4. Implement only the listed fixes; avoid scope expansion.
5. Do not commit.
6. Re-run required tests or state why they were not run.
7. If the WO is now complete, use the `wo-tracker` agent to update `CHECKPOINT.md` and `docs/STATE.md` (append-only).
8. Run the scoped verification commands listed in the WO.
9. Run `git diff --stat`.
