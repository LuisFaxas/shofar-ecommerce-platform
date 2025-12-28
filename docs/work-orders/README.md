# Work Orders

This folder is the default home for new work orders (WOs). Existing design WOs remain in `docs/TOOLY_DESIGN_V2_WOS/`.

## Naming (ordered)

Use `WO-<AREA>-<YYYYMMDD>-<SEQ>-<SHORT>.md`.

Examples:

- `WO-AI-20251228-01-HARMONY.md`
- `WO-UI-20251228-02-HERO-TWEAK.md`

Area codes (pick the closest match): `AI`, `UI`, `VENDURE`, `API`, `DATA`, `OPS`, `DOCS`, `TEST`.

The date prefix keeps WOs naturally ordered by time.

## Process

1. Draft a WO using `WO_TEMPLATE.md`.
2. Implement in phases (plan, implement, review/fix) with a single writer.
3. Use relevant `.claude/agents/` and list them in the WO.
4. Update `CHECKPOINT.md` and `docs/STATE.md` via the `wo-tracker` agent after each milestone.

## Guardrails

- Follow `AGENTS.md` (authoritative).
- Start from a clean worktree/branch for each WO.
- One writer at a time (builder vs verifier).
- No auto-commits or hook changes.

## Claude Code Invocation

Claude Code does not support custom slash commands. The files in `.claude/commands/` are workflow playbooks you explicitly invoke. Slash commands can be used as a **convention** only.

### Command Path (convention)

```
/wo-implement WO-<ID>
/wo-review WO-<ID>
/wo-fix WO-<ID>
/checkpoint WO-<ID> done
```

### Fallback Path (explicit prompt)

```
Use the workflow in .claude/commands/wo-implement.md on docs/work-orders/WO-<ID>.md. Follow it exactly. Do not commit. End with git diff --stat.
```
