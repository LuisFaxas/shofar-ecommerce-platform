# Agent Contract (Authoritative)

Read this file first. If any other doc conflicts, follow this contract.

## Non-Negotiables

- Store isolation: no shared UI components between `shofar-store`, `pharma-store`, and `faxas-store`. No cross-store UI imports.
- TOOLY must never expose PEPTIDES (data, branding, or UI).
- Pharma compliance: include "For Research Use Only / Not for human use." on pharma-store product, checkout, and marketing surfaces. No health claims or human dosage guidance. Use `__Host-` cookies with `SameSite=Strict`. Do not log PII.
- No secrets in the repo.

## Harmony Protocol v1

- One builder, one verifier: Claude implements; Codex reviews before fixes or completion.
- Clean-worktree rule: start each WO from a clean `git status`, ideally in a dedicated branch/worktree.
- Single-writer rule: only one agent edits files at a time; the other reads/reviews.
- Repo-as-interface: WOs are read from disk; avoid clipboard-only instructions.
- Verification gate: use scoped diffs and append-only checkpoint updates.
- Use agents: when implementing, select relevant `.claude/agents/` and state which were used.
- Checkpoints: updates to `CHECKPOINT.md` and `docs/STATE.md` must be performed via the `wo-tracker` agent (or the checkpoint playbook that invokes it).

## WO Naming

Use `WO-<AREA>-<YYYYMMDD>-<SEQ>-<SHORT>.md` in `docs/work-orders/` (example: `WO-AI-20251228-01-HARMONY.md`).

## Workflow

- Use a WO for any non-trivial change. Template: `docs/work-orders/WO_TEMPLATE.md`.
- Update `CHECKPOINT.md` and `docs/STATE.md` after each milestone.
- No auto-commits. Do not add or change git hooks.

## Commits

- Follow `commitlint.config.js` for types and scopes.
- Format: `type(scope): subject`.

## Testing

- Run relevant tests or state "not run" with reason.
- Do not fabricate results.

## Safety

- Read code before changing behavior; do not invent APIs.
