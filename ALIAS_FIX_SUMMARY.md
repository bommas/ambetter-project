# Alias and Index Fix Summary

## Issues Identified

1. **Alias Not Created**: When indexing FL and NV documents, the alias management logic was broken
2. **Documents Indexed to Wrong Index**: Despite `TARGET_INDEX` being set, documents went to `health-plans-tx-2025-11` instead of the target index

## Root Causes

### Issue 1: Alias Logic
The original code checked `if (!healthPlansIndexExists)` which meant:
- If `health-plans` existed as an index → Don't add to alias
- If `health-plans` was an alias → Don't add to alias (wrong!)

This was inverted logic. Should have been:
- If `health-plans` is an alias → Add to alias ✅
- If `health-plans` is an index → Don't add (conflict) ⚠️

### Issue 2: Environment Variable Passing
The original code used shell command interpolation:
```typescript
const cmd = `SINGLE_URL="${url}" SINGLE_STATE="${state}" TARGET_INDEX="${indexName}" node scripts/multi-state-processor.js`
exec(cmd, { cwd: process.cwd() }, ...)
```

Problem: Node's `exec` uses a shell, and environment variables in shell commands don't always work reliably, especially across different platforms and shells.

**Solution**: Pass environment variables through the `env` parameter:
```typescript
exec('node scripts/multi-state-processor.js', { 
  cwd: process.cwd(),
  env: {
    ...process.env,
    SINGLE_URL: url,
    SINGLE_STATE: state,
    TARGET_INDEX: indexName
  }
})
```

## Fixes Applied

1. ✅ Updated `src/app/api/admin/ingest/route.ts`:
   - Fixed alias detection logic to properly check if `health-plans` is an alias or index
   - Changed environment variable passing to use `env` parameter

2. ✅ Updated `scripts/multi-state-processor.js`:
   - Read `TARGET_INDEX` environment variable
   - Use it to override default index

## Current Status

- `health-plans-tx-2025-11`: 38,181 docs (TX, FL, NV mixed)
- `health-plans-fl-2025-11`: 0 docs (empty) ❌
- `health-plans-nv-2025-11`: 2 docs
- `health-plans` alias: Points to all three indices

## Next Steps

1. Re-ingest FL and NV documents using the Admin UI
2. After ingestion, verify documents are in correct indices
3. Add indices to alias if not already added
4. Test search to confirm all documents are accessible

## Testing the Fix

To test that TARGET_INDEX works:
```bash
TARGET_INDEX="test-index" node scripts/multi-state-processor.js
# Should output "Index: test-index"
```

