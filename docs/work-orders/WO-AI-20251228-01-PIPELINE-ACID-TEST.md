# WORK ORDER: WO-AI-20251228-01-PIPELINE-ACID-TEST

TITLE: Validate Codex+Claude workflow OS (docs-only)

## Goal

Validate that the new workflow OS can run end-to-end without touching product code.

## Scope

- In scope: workflow files, docs, commands, skills, state/checkpoint updates.
- Out of scope: application code, backend changes, hooks, or commits.

## Constraints (from AGENTS.md)

- Store isolation rules remain unchanged.
- No product code changes.
- No secrets.
- No git hooks or auto-commits.

## Recommended Agents

- `wo-tracker` (checkpoint updates)

## Acceptance Criteria

- [ ] No changes outside `docs/` and workflow files (`.claude/commands/`, `.codex/skills/`, `AGENTS.md`, `CLAUDE.md`).
- [ ] Claude can read and follow a WO from disk using the workflow playbooks.
- [ ] Codex `wo-review` can review against acceptance criteria.
- [ ] Claude workflow can update `CHECKPOINT.md` + `docs/STATE.md` safely (append-only).

## Tests / Verification

- `git diff --stat` shows only allowed files.

## Files / Areas Likely Touched

- `docs/work-orders/`
- `.claude/commands/`
- `.codex/skills/`
- `AGENTS.md`
- `CLAUDE.md`
- `CHECKPOINT.md`
- `docs/STATE.md`

## Plan (Codex)

1. Run the WO through the workflow playbooks to validate the command workflow.
2. Review changes with `wo-review` against acceptance criteria.
3. Update `CHECKPOINT.md` and `docs/STATE.md` using the checkpoint workflow.

## Contract Sync Check

- [ ] AGENTS.md reviewed and still accurate
- [ ] Any new constraint added to AGENTS.md

## Claude Code Prompts (copy/paste)

Implement:

```
Use the workflow in .claude/commands/wo-implement.md on docs/work-orders/WO-AI-20251228-01-PIPELINE-ACID-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Review:

```
Use the workflow in .claude/commands/wo-review.md on docs/work-orders/WO-AI-20251228-01-PIPELINE-ACID-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Checkpoint:

```
Use the workflow in .claude/commands/checkpoint.md on docs/work-orders/WO-AI-20251228-01-PIPELINE-ACID-TEST.md. Follow it exactly. Do not commit. End with git diff --stat.
```
