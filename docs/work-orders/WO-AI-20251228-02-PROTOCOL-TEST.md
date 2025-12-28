# WORK ORDER: WO-AI-20251228-02-PROTOCOL-TEST

TITLE: Validate Harmony Protocol v1 (clean worktree, builder/verifier, fallback)

## Goal

Validate the Harmony Protocol v1 end-to-end in a clean worktree without touching product code.

## Scope

- In scope: workflow files, docs, state/checkpoint updates.
- Out of scope: application code, backend changes, hooks, commits.

## Constraints (from AGENTS.md)

- Clean-worktree rule: start with `git status` clean.
- Single-writer rule: only one agent edits at a time.
- No product code changes.
- No secrets.
- No git hooks or auto-commits.

## Recommended Agents

- `wo-tracker` (checkpoint updates)

## Acceptance Criteria

- [ ] Work starts from a clean worktree/branch.
- [ ] Only allowed files change (`docs/`, `.claude/commands/`, `.codex/skills/`, `AGENTS.md`, `CLAUDE.md`, `CHECKPOINT.md`).
- [ ] Builder/verifier flow is followed (Claude implements, Codex reviews).
- [ ] Checkpoint update is append-only and recorded in `docs/STATE.md`.

## Verification (scoped)

- `git status` (must be clean before starting)
- `git diff --name-only -- docs/ .claude/ .codex/ AGENTS.md CLAUDE.md CHECKPOINT.md`
- If `CHECKPOINT.md` changed: `git diff CHECKPOINT.md | tail -n 80`

## Files / Areas Likely Touched

- `docs/work-orders/`
- `.claude/commands/`
- `.codex/skills/`
- `AGENTS.md`
- `CLAUDE.md`
- `CHECKPOINT.md`
- `docs/STATE.md`

## Plan (Codex)

1. Verify clean worktree, then implement using the workflow playbooks.
2. Review changes against acceptance criteria.
3. Update `CHECKPOINT.md` and `docs/STATE.md` (append-only).

## Contract Sync Check

- [ ] AGENTS.md reviewed and still accurate
- [ ] Any new constraint added to AGENTS.md

## Command Path (convention)

```
/wo-implement WO-AI-20251228-02-PROTOCOL-TEST
/wo-review WO-AI-20251228-02-PROTOCOL-TEST
/wo-fix WO-AI-20251228-02-PROTOCOL-TEST
/checkpoint WO-AI-20251228-02-PROTOCOL-TEST done
```

## Fallback Path (explicit prompts)

Implement:

```
Use the workflow in .claude/commands/wo-implement.md on docs/work-orders/WO-AI-20251228-02-PROTOCOL-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Review:

```
Use the workflow in .claude/commands/wo-review.md on docs/work-orders/WO-AI-20251228-02-PROTOCOL-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Checkpoint:

```
Use the workflow in .claude/commands/checkpoint.md on docs/work-orders/WO-AI-20251228-02-PROTOCOL-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```
