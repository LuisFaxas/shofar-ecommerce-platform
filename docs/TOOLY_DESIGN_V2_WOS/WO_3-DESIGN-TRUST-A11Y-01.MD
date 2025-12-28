-WORK ORDER: WO-DESIGN-TRUST-A11Y-01
TITLE: Mobile trust badge readability + skip link (a11y polish)

GOAL
- Fix trust badge label truncation on mobile (no more “Secure…”).
- Add a skip-to-main-content link for accessibility.
- Keep design consistent with existing dark/glass style.

LOCKED CONSTRAINTS
- Do NOT change section order or IDs.
- Keep overall CredibilitySection layout (stats + trust badges).

IMPLEMENTATION
A) Trust badges (CredibilitySection)
- Remove single-line truncation behavior at mobile widths.
- Use a 2-line clamp or wrapping strategy that:
  - prevents overflow
  - keeps badges visually tidy
  - doesn’t explode vertical spacing
- Ensure icons remain aligned and touch targets remain good.

B) Skip link
- Add a “Skip to content” link as the first focusable element in the Navbar/app shell.
- It should be visually hidden until focused, then appears at top.
- Add id="main" to the main content container and link to it.

FILES TO INSPECT / EDIT
- src/brands/tooly/components/ui/Navbar.tsx
- src/brands/tooly/index.tsx (or wherever <main> is rendered)
- src/brands/tooly/sections/CredibilitySection.tsx

VERIFICATION
- pnpm --filter @shofar/shofar-store build
- Keyboard test: press Tab at page load -> skip link appears -> Enter jumps to main content.
- Mobile viewport: trust badge text no longer truncates.

COMMIT
fix(web): WO-DESIGN-TRUST-A11Y-01 trust badges + skip link

CHECKPOINT
Update CHECKPOINT.md with WO status + commit hash

OUTPUT FORMAT
1) Summary
2) Files changed
3) Commands run
4) Commit hash
