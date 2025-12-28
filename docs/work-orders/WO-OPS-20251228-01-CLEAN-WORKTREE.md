# WORK ORDER: WO-OPS-20251228-01-CLEAN-WORKTREE

TITLE: Resolve dirty worktree and isolate workflow OS changes

## Goal

Identify and isolate the existing large diff so workflow work can proceed from a clean worktree without touching product code.

## Scope

- In scope: audit `git diff --stat`, classify changes, and create a clean worktree/branch for protocol work.
- Out of scope: modifying product code, committing, or altering git hooks.

## Constraints (from AGENTS.md)

- Clean-worktree rule: start from a clean `git status` for new WOs.
- Single-writer rule: only one agent edits at a time.
- No product code changes.
- No auto-commits or git hook changes.

## Recommended Agents

- `wo-tracker` (checkpoint updates)

## Acceptance Criteria

- [ ] A clean worktree/branch is available for future WOs.
- [ ] The large diff is classified into: workflow/docs vs product code vs generated artifacts.
- [ ] A recommended isolation approach is documented (e.g., stash, separate branch, or new worktree).
- [ ] No changes outside allowed files.

## Verification (scoped)

- `git status` (must be clean in the new worktree)
- `git diff --name-only` (documented classification list)

## Files / Areas Likely Touched

- `docs/work-orders/`
- `docs/STATE.md`
- `CHECKPOINT.md`

## Plan (Codex)

1. Capture a full `git diff --name-only` list and classify by folder/type.
2. Propose a clean-worktree isolation plan (no destructive commands).
3. If needed, update `docs/STATE.md` with the current focus and next actions.

## Contract Sync Check

- [ ] AGENTS.md reviewed and still accurate
- [ ] Any new constraint added to AGENTS.md

## Command Path (convention)

```
/wo-implement WO-OPS-20251228-01-CLEAN-WORKTREE
/wo-review WO-OPS-20251228-01-CLEAN-WORKTREE
/wo-fix WO-OPS-20251228-01-CLEAN-WORKTREE
/checkpoint WO-OPS-20251228-01-CLEAN-WORKTREE done
```

## Fallback Path (explicit prompts)

Implement:

```
Use the workflow in .claude/commands/wo-implement.md on docs/work-orders/WO-OPS-20251228-01-CLEAN-WORKTREE.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Review:

```
Use the workflow in .claude/commands/wo-review.md on docs/work-orders/WO-OPS-20251228-01-CLEAN-WORKTREE.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Checkpoint:

```
Use the workflow in .claude/commands/checkpoint.md on docs/work-orders/WO-OPS-20251228-01-CLEAN-WORKTREE.md. Follow it exactly. Do not commit. End with git diff --stat.
```
