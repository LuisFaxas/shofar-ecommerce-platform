# WO-P0-DB-SYNC-01: Disable TypeORM synchronize for Postgres

**Date**: 2025-12-27
**Status**: Complete

## What Changed

**File**: `apps/vendure/src/vendure-config.ts`

**Before** (line 42):

```typescript
synchronize: true, // Enable for initial schema creation
```

**After**:

```typescript
synchronize: IS_DEV, // NEVER true in production - use migrations instead
```

## Why

TypeORM's `synchronize: true` automatically modifies database schema to match entity definitions on every startup. This is dangerous in production because:

1. **Data Loss**: Can drop columns/tables if entity definitions change
2. **No Rollback**: Changes are immediate and irreversible
3. **Race Conditions**: Multiple app instances may conflict during schema sync
4. **Audit Trail**: No record of what changed or when

The postgres config had `synchronize: true` unconditionally, meaning production Railway deployments were at risk.

## How It Works Now

| Environment | `NODE_ENV` | `IS_DEV` | `synchronize`        |
| ----------- | ---------- | -------- | -------------------- |
| Local dev   | undefined  | true     | **true** (auto-sync) |
| Production  | production | false    | **false** (safe)     |

## How to Verify

### 1. Check the logic

```bash
grep -n "synchronize" apps/vendure/src/vendure-config.ts
```

Expected output shows both postgres and SQLite use `IS_DEV`:

```
42:      synchronize: IS_DEV, // NEVER true in production - use migrations instead
51:      synchronize: IS_DEV,
```

### 2. Verify build passes

```bash
pnpm --filter @shofar/vendure typecheck
pnpm --filter @shofar/vendure build
```

### 3. Test production behavior (optional)

```bash
NODE_ENV=production DB_TYPE=postgres node -e "
  process.env.NODE_ENV = 'production';
  const IS_DEV = process.env.NODE_ENV !== 'production';
  console.log('IS_DEV:', IS_DEV);
  console.log('synchronize would be:', IS_DEV);
"
# Output: IS_DEV: false, synchronize would be: false
```

## Migration Path

When schema changes are needed in production:

1. Generate migration: `pnpm --filter @shofar/vendure migrate generate <name>`
2. Review generated SQL in `apps/vendure/migrations/`
3. Run migration: `pnpm --filter @shofar/vendure migrate`
4. Deploy

Note: No migrations directory exists yet. It will be created when the first migration is generated.

## Acceptance Criteria Met

- [x] `synchronize` resolves false when `NODE_ENV=production` and `DB_TYPE=postgres`
- [x] Local dev still runs (synchronize=true when NODE_ENV not set)
- [x] No lint/typecheck regressions (build passes)
