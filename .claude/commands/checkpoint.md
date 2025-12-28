# /checkpoint

Update `CHECKPOINT.md` and `docs/STATE.md` for a WO milestone.

Usage: `/checkpoint WO-...`

Steps:

1. Read `AGENTS.md`.
2. Read the WO at `docs/work-orders/$ARGUMENTS.md`. If it does not exist, stop and ask.
3. Use the `wo-tracker` agent to update `CHECKPOINT.md` (append-only; do not rewrite existing history).
4. Update `docs/STATE.md`:
   - Rewrite **Current Snapshot** with current focus and active WO.
   - Append a new bullet under **Recent Updates**.
5. Do not commit.
6. Run `git diff --stat`.
