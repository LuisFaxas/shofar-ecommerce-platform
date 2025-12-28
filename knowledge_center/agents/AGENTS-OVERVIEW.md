# SHOFAR Project Agents Overview

> Complete guide to all Claude Code agents configured for the SHOFAR project.

**Last Updated**: 2025-12-28
**Author**: Claude
**Status**: Active
**Total Agents**: 12

---

## What Are Claude Code Agents?

Claude Code agents are specialized AI assistants configured for specific tasks. They're defined as markdown files in `.claude/agents/` with:

- **name**: Identifier for the agent
- **description**: When to use this agent (Claude reads this to decide)
- **tools**: Which tools the agent can access
- **model**: Which Claude model to use (opus/sonnet/haiku)

### Agent Types

| Type            | Trigger                | Use Case                 |
| --------------- | ---------------------- | ------------------------ |
| **Subagents**   | Auto-spawned by Claude | Complex multi-step tasks |
| **Skills**      | `/skillname` command   | Quick actions            |
| **Task Agents** | Spawned via Task tool  | Background processing    |

### Model Selection

| Model      | Speed    | Cost    | Best For                 |
| ---------- | -------- | ------- | ------------------------ |
| **haiku**  | Fastest  | Lowest  | Simple lookups, indexing |
| **sonnet** | Balanced | Medium  | Most tasks               |
| **opus**   | Slowest  | Highest | Complex reasoning        |

---

## Knowledge Center Agents

These agents manage the project's documentation and knowledge.

### shofar-librarian (Orchestrator)

**File**: `.claude/agents/shofar-librarian.md`
**Model**: sonnet
**Purpose**: Master orchestrator for knowledge center operations

**When Claude Uses It**:

- User asks about documentation
- User wants to find or create knowledge
- Complex knowledge operations needing coordination

**Example Prompts**:

```
"What documentation do we have?"
"I need to document the checkout flow"
"Organize the knowledge center"
```

**Delegates To**:

- kb-reader for searches AND indexing
- kb-writer for creating docs

---

### kb-reader

**File**: `.claude/agents/kb-reader.md`
**Model**: haiku (fast lookups)
**Purpose**: Find/retrieve documentation AND maintain INDEX.md

**When Claude Uses It**:

- User asks "what do we know about X?"
- User searches for existing docs
- User asks to rebuild or update the index
- Checking for orphaned files

**Example Prompts**:

```
"Find docs about Stripe integration"
"What's documented about the asset pipeline?"
"Rebuild the knowledge center index"
"Check for orphaned documents"
```

---

### kb-writer

**File**: `.claude/agents/kb-writer.md`
**Model**: sonnet
**Purpose**: Create and update documentation

**When Claude Uses It**:

- User wants to document something new
- User asks to update existing docs
- Creating ADRs (Architecture Decision Records)

**Example Prompts**:

```
"Document the GraphQL sync workflow"
"Create an ADR for using Vendure"
"Update the troubleshooting guide"
```

**Important**: Always updates INDEX.md after creating documents.

---

## Development Agents

These agents help with coding and development tasks.

### vendure-admin

**File**: `.claude/agents/vendure-admin.md`
**Model**: sonnet
**Purpose**: Vendure backend specialist

**When Claude Uses It**:

- Vendure configuration changes
- Custom field additions
- Plugin development
- Database/migration issues

**Example Prompts**:

```
"Add a custom field to Product"
"Configure the Stripe plugin"
"Debug the asset upload"
```

**Key Files It Knows**:

- `apps/vendure/src/vendure-config.ts`
- `apps/vendure/src/config/`

---

### tooly-ui

**File**: `.claude/agents/tooly-ui.md`
**Model**: sonnet
**Purpose**: TOOLY storefront UI specialist

**When Claude Uses It**:

- Frontend component work
- UI bug fixes
- Styling changes
- TOOLY brand-specific features

**Example Prompts**:

```
"Fix the hero section mobile layout"
"Add a new section to the homepage"
"Debug the carousel component"
```

**Key Files It Knows**:

- `apps/shofar-store/src/brands/tooly/`
- `apps/shofar-store/src/components/`

---

### graphql-sync

**File**: `.claude/agents/graphql-sync.md`
**Model**: sonnet
**Purpose**: GraphQL schema synchronization

**When Claude Uses It**:

- Adding fields to GraphQL queries
- Running codegen
- Type mismatches between frontend/backend

**Example Prompts**:

```
"Add heroImage to the channel query"
"Run codegen and fix type errors"
"Sync the product query with Vendure"
```

**The Sync Flow**:

1. vendure-config.ts (add custom field)
2. \*.graphql (add to query)
3. Run codegen
4. fetchers.ts (extract data)
5. Component (use data)

---

## Operations Agents

These agents help with deployment and operations.

### deploy-check

**File**: `.claude/agents/deploy-check.md`
**Model**: haiku (fast checks)
**Purpose**: Pre-deployment validation

**When Claude Uses It**:

- Before deploying to Railway
- Quick health checks
- Verifying build readiness

**Example Prompts**:

```
"Run pre-deploy checks"
"Is the build ready for production?"
"Check for deployment blockers"
```

**Checks Performed**:

- TypeScript compilation
- Lint errors
- Environment variables
- Build success

---

### wo-tracker

**File**: `.claude/agents/wo-tracker.md`
**Model**: sonnet
**Purpose**: Work Order and CHECKPOINT.md management

**When Claude Uses It**:

- Updating CHECKPOINT.md
- Tracking work order progress
- Marking items complete/failed

**Example Prompts**:

```
"Mark WO-2.0.6c as complete"
"Update CHECKPOINT with our progress"
"What work orders are pending?"
```

---

### git-flow

**File**: `.claude/agents/git-flow.md`
**Model**: haiku (fast + cheap)
**Purpose**: Git workflow automation with zero commitlint errors

**When Claude Uses It**:

- Creating commits (validates message before attempting)
- Branch operations (feature/, fix/, wo/ naming)
- Stash management (with descriptive messages)
- Worktree operations (clean environment creation)
- ANY git operation requiring validation

**Example Prompts**:

```
"Commit the navbar changes"
"Create a feature branch for the carousel"
"Stash my current work"
"Create a clean worktree"
```

**Key Features**:

- Pre-validates commit messages against commitlint rules
- Infers scope from file paths (apps/shofar-store/ → "web")
- Zero trial-and-error - all commits pass on first try
- Handles atomic commit strategies

**Scope Inference**:

- `apps/shofar-store/` → web
- `apps/vendure/` → vendure
- `packages/ui/` → ui
- `.claude/`, `CHECKPOINT.md` → repo
- `package.json` → deps

---

## Debugging Agents

These agents help troubleshoot specific issues.

### stripe-debug

**File**: `.claude/agents/stripe-debug.md`
**Model**: sonnet
**Purpose**: Stripe payment troubleshooting

**When Claude Uses It**:

- Payment failures
- Checkout flow issues
- Webhook problems

**Example Prompts**:

```
"Debug the payment intent failure"
"Why isn't the order updating after payment?"
"Check Stripe webhook configuration"
```

**Key Files It Knows**:

- `apps/shofar-store/src/components/StripePaymentForm.tsx`
- `apps/shofar-store/src/app/checkout/page.tsx`

---

### asset-manager

**File**: `.claude/agents/asset-manager.md`
**Model**: sonnet
**Purpose**: R2/S3 asset management

**When Claude Uses It**:

- Image upload issues
- Asset URL problems
- CDN configuration

**Example Prompts**:

```
"Images aren't loading in production"
"Configure R2 for asset storage"
"Debug the asset upload failure"
```

---

### mobile-tester

**File**: `.claude/agents/mobile-tester.md`
**Model**: sonnet
**Purpose**: Mobile/responsive testing

**When Claude Uses It**:

- Viewport testing
- Mobile layout issues
- iOS Safari quirks

**Example Prompts**:

```
"Test the homepage on mobile viewports"
"Check if the hero is cropped on iPhone"
"Verify touch targets are 44px"
```

**Standard Viewports**:

- iPhone SE: 375x667
- iPhone 14 Pro: 393x852
- iPad: 768x1024
- Desktop: 1440x900

---

## Agent Files Location

All agent files are stored in:

```
.claude/agents/
├── shofar-librarian.md   # Knowledge orchestrator
├── kb-reader.md          # Knowledge retrieval + indexing
├── kb-writer.md          # Documentation creation
├── vendure-admin.md      # Backend specialist
├── tooly-ui.md           # Frontend specialist
├── graphql-sync.md       # GraphQL sync
├── deploy-check.md       # Pre-deploy validation
├── wo-tracker.md         # Work order tracking
├── git-flow.md           # Git workflow automation
├── stripe-debug.md       # Payment debugging
├── asset-manager.md      # Asset pipeline
└── mobile-tester.md      # Responsive testing
```

---

## How Claude Decides Which Agent to Use

1. **Reads descriptions**: Claude scans all agent descriptions
2. **Matches context**: Finds agents matching the current task
3. **Spawns subagent**: Uses Task tool to launch the agent
4. **Receives results**: Agent returns findings to main conversation

You don't need to explicitly call agents - Claude will use them automatically when appropriate. However, you can prompt Claude to use specific agents:

```
"Use the mobile-tester agent to check the homepage"
"Have vendure-admin add a custom field"
```

---

## Related Documents

- [Knowledge Center Index](../INDEX.md)

---

_This document is part of the SHOFAR Knowledge Center._
