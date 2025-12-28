WORK ORDER: WO-AGENT-GUARDRAILS-01
TITLE: Add CLAUDE.md + stable WO workflow (compaction-proof)

CONTEXT
- Repo is a monorepo. Storefront work is in apps/shofar-store (TOOLY brand).
- We are starting “Design Polish v2.0” and need consistent, safe iteration even after Claude compaction.

GOAL
1) Create a repo-root CLAUDE.md that encodes non-negotiable rules for TOOLY work.
2) Add a “Design v2.0” section to CHECKPOINT.md that tracks WO IDs + commit hashes.

NON-GOALS
- Do NOT change any storefront UI behavior.
- Do NOT touch Vendure backend in this WO.

REQUIRED CONTENT FOR CLAUDE.md (keep it short + practical)
- Where TOOLY storefront lives (apps/shofar-store + brands/tooly)
- Locked layout constraints: section order + IDs must not change
- “No cross-store UI imports” rule
- Standard commands:
  - pnpm --filter @shofar/shofar-store dev
  - pnpm --filter @shofar/shofar-store build
- “WO execution protocol”:
  1) create branch
  2) implement minimal diff
  3) run build
  4) run Puppeteer quick-check (2 viewports)
  5) commit w/ WO ID in message
  6) update CHECKPOINT.md with status + commit hash

DELIVERABLES
- New file: CLAUDE.md
- Update: CHECKPOINT.md (add Design v2.0 tracker section)

VERIFICATION
- No code changes; build should be unaffected.
- git diff should only show CLAUDE.md + CHECKPOINT.md

COMMIT
- Commit message: docs(repo): add CLAUDE.md + design v2.0 WO tracker

OUTPUT FORMAT
1) Summary (5 bullets max)
2) Files changed
3) Commands run
4) Commit hash
