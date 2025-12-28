WO-DESIGN-SYSTEM-INVENTORY-01 (NO CODE CHANGES)

Goal:
Create a concise inventory of everything rendered on /design-system so we can reuse components intentionally.

Rules:
- NO implementation changes.
- Output must be short and structured.
- Only analyze apps/shofar-store and brands/tooly.
- Do NOT propose redesigns yet.

Deliverable: DESIGN_SYSTEM_INVENTORY.md with:

1) Route entrypoint
- file path(s) for /design-system

2) Component Inventory Table (max detail, minimal text)
For each section/component shown on /design-system, include:
- Display name
- Component file path
- Status: USED in production / UNUSED / UNKNOWN
- If USED: list where (file paths)
- If UNUSED: list dependencies (if any) and whether it’s safe to delete or keep as “experimental”
- Notes: 1 line only (what it does)

3) Quick grep evidence (brief)
- Show the ripgrep command(s) used to determine USED/UNUSED

Then stop.

Output format:
- One markdown table + a short bullet list. No long explanations.
