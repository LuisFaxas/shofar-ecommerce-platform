---
name: wo-author
description: Draft or refine work orders for this repo using docs/work-orders/WO_TEMPLATE.md. Use when asked to create a WO, clarify scope/constraints, or structure acceptance criteria and tests for Codex+Claude handoffs.
---

# WO Author

## Workflow

1. Read `AGENTS.md` first for non-negotiable constraints and naming rules.
2. Locate related WOs in `docs/work-orders/` and `docs/TOOLY_DESIGN_V2_WOS/` to avoid duplication.
3. Use `docs/work-orders/WO_TEMPLATE.md` verbatim structure.
4. Choose a WO ID using `WO-<AREA>-<YYYYMMDD>-<SEQ>-<SHORT>`.
5. Fill in scope, constraints, recommended agents, acceptance criteria, verification (scoped), and likely file paths.
6. Keep the WO short, specific, and enforceable.
7. Output the proposed WO filename and content only (no code changes).

## Output Rules

- Use clear IDs: `WO-<area>-<short-id>` (e.g., `WO-AGENT-CONTRACT-01`).
- Include constraints that are relevant to this work only.
- If tests are not run, state why.
