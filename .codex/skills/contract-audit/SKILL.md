---
name: contract-audit
description: Audit AGENTS.md against CLAUDE.md and active WOs to detect missing or conflicting rules. Use when adding new constraints, changing workflows, or consolidating guardrails.
---

# Contract Audit

## Workflow

1. Read `AGENTS.md` (authoritative) and `CLAUDE.md` (details).
2. Scan active WOs in `docs/work-orders/` for new constraints or exceptions.
3. List conflicts, gaps, or duplicated rules.
4. Propose minimal edits to keep AGENTS.md short and enforceable.

## Output Rules

- Do not rewrite large sections; propose targeted deltas.
- Keep AGENTS.md as the single source of truth.
