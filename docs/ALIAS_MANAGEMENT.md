# 📋 Alias Management for health-plans

## Overview

The `health-plans` alias is a read-only Elasticsearch alias that points to all health plan indices matching the pattern `health-plans-{state}-{version}`. This alias allows the application to search across all health plan indices simultaneously without needing to know the specific index names.

## 🎯 Purpose

1. **Multi-State Search**: Allows searching across all state-specific health plan indices in a single query
2. **Version Management**: Support multiple versions of plan data without breaking existing queries
3. **Easy Scaling**: Add new states and versions without changing application code

## 🔧 Creating the Alias

### Automatic Creation (Recommended)

When you ingest new documents via the Admin UI (`/admin`), the system automatically:
1. Creates a new index: `health-plans-{state}-{version}`
2. Adds it to the `health-plans` alias

### Manual Creation

If you need to create or update the alias manually, use the provided script:

```bash
node scripts/create-health-plans-alias.js
```

This script will:
- Find all indices matching `health-plans-*`
- Create the `health-plans` alias if it doesn't exist
- Add any missing indices to the alias

## 📝 Manual Elasticsearch Commands

### List Current Aliases

```bash
curl -X GET "https://YOUR_ENDPOINT:443/_cat/aliases/health-plans?v" \
  -H "Authorization: ApiKey YOUR_API_KEY"
```

### Check Which Indices Are in the Alias

```bash
curl -X GET "https://YOUR_ENDPOINT:443/_alias/health-plans" \
  -H "Authorization: ApiKey YOUR_API_KEY"
```

### Add an Index to the Alias

```bash
curl -X POST "https://YOUR_ENDPOINT:443/_aliases" \
  -H "Authorization: ApiKey YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "add": {
          "index": "health-plans-tx-2025-10",
          "alias": "health-plans"
        }
      }
    ]
  }'
```

### Remove an Index from the Alias

```bash
curl -X POST "https://YOUR_ENDPOINT:443/_aliases" \
  -H "Authorization: ApiKey YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "remove": {
          "index": "health-plans-tx-2025-10",
          "alias": "health-plans"
        }
      }
    ]
  }'
```

### Add Multiple Indices at Once

```bash
curl -X POST "https://YOUR_ENDPOINT:443/_aliases" \
  -H "Authorization: ApiKey YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "add": {
          "index": "health-plans-tx-2025-10",
          "alias": "health-plans"
        }
      },
      {
        "add": {
          "index": "health-plans-fl-2025-10",
          "alias": "health-plans"
        }
      }
    ]
  }'
```

## 🛡️ Protection in Admin UI

Indices that are part of the `health-plans` alias are **protected from deletion** in the Admin UI. The UI will:
- Show a "Protected" badge instead of a Delete button
- Prevent accidental deletion of alias members
- Only allow deletion of indices not in the alias

### Visual Indicators

- **In Alias**: Shows "Protected" badge (gray, italic)
- **Not in Alias**: Shows "Delete" button (red)
- **Alias Status**: Shows "ALIAS" badge next to index name

## 📊 Index Naming Convention

Indices follow this naming pattern:
```
health-plans-{state}-{version}
```

Examples:
- `health-plans-tx-2025-10` - Texas plans, version 2025-10
- `health-plans-fl-2025-11` - Florida plans, version 2025-11
- `health-plans-ca-2026-01` - California plans, version 2026-01

## ✅ Best Practices

1. **Always use version numbers** - Makes it easy to track and roll back
2. **Use lowercase state codes** - Consistent naming (TX → tx)
3. **Keep alias clean** - Only add indices that are ready for production
4. **Test before promoting** - Add to alias only after validation
5. **Version naming** - Use `YYYY-MM` format for easy sorting

## 🔄 Version Management

To update to a new version:

1. **Ingest new data** into a new index: `health-plans-tx-2025-11`
2. **Verify data quality** using QA endpoints
3. **Add to alias** using the Admin UI or script
4. **Remove old version** from alias (optional, keep as backup)
5. **Delete old index** when confirmed working (after grace period)

## 🚨 Important Notes

- **Read-only in UI**: Indices in the alias cannot be deleted through the UI
- **Alias is searched**: All search queries automatically search the alias
- **Backups**: Old versions are kept for rollback capability
- **Performance**: Keep alias size reasonable (~10-20 indices max)

## 🔗 Related Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints for alias management
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [PROJECT_MASTER.md](./PROJECT_MASTER.md) - Complete project documentation

---

*Last updated: January 2025*
