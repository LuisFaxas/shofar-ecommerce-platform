# WORK ORDER: WO-<AREA>-<YYYYMMDD>-<SEQ>-<SHORT>

TITLE: <short title>

## Goal

<clear outcome, 1-2 sentences>

## Scope

- In scope:
- Out of scope:

## Constraints (from AGENTS.md)

- <list only relevant constraints>

## Recommended Agents

- <list .claude/agents/ to use and why>

## Acceptance Criteria

- [ ] <criterion 1>
- [ ] <criterion 2>

## Verification (scoped)

- `git status` (must be clean before starting, if required by this WO)
- `git diff --name-only -- <allowed paths>` (must only include scoped files)
- If `CHECKPOINT.md` changed: `git diff CHECKPOINT.md | tail -n 80` (append-only check)

## Files / Areas Likely Touched

- <paths>

## Plan (Codex)

1. ...
2. ...
3. ...

## Contract Sync Check

- [ ] AGENTS.md reviewed and still accurate
- [ ] Any new constraint added to AGENTS.md

## Command Path (convention)

These are not native slash commands; treat them as a short-hand convention.

```
/wo-implement WO-<ID>
/wo-review WO-<ID>
/wo-fix WO-<ID>
/checkpoint WO-<ID> done
```

## Fallback Path (explicit prompts)

Implement:

```
Use the workflow in .claude/commands/wo-implement.md on docs/work-orders/WO-<ID>.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Review:

```
Use the workflow in .claude/commands/wo-review.md on docs/work-orders/WO-<ID>.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Fix:

```
Use the workflow in .claude/commands/wo-fix.md on docs/work-orders/WO-<ID>.md. Follow it exactly. Do not commit. End with git diff --stat.
```

Checkpoint (use wo-tracker agent):

```
Use the workflow in .claude/commands/checkpoint.md on docs/work-orders/WO-<ID>.md. Follow it exactly. Do not commit. End with git diff --stat.
```
