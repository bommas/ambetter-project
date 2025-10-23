# Performance Analysis & Optimization

## Current Performance Issues

### Benchmark Results
- **Semantic Search**: ~24 seconds ⚠️
- **Keyword Search**: ~24 seconds ⚠️
- Both are equally slow, indicating the issue is NOT semantic vs keyword

### Identified Bottlenecks

1. **AI Summary Generation** (~5-10s)
   - OpenAI API call for every search
   - Client-side cache exists but server makes the call first
   - Solution: Skip AI summary unless explicitly requested

2. **ELSER Semantic Search** (~10-15s)
   - Running 3 separate semantic field queries
   - On large index (351 docs with chunking)
   - Solution: Make semantic search optional, default to keyword

3. **Multiple ES Queries** (~2-3s)
   - Curations lookup
   - Boosts lookup  
   - Main search query
   - Solution: Run in parallel (already doing this)

4. **Field Collapse** (~1-2s)
   - Deduplicating by plan_id
   - Inner hits retrieval
   - Normal overhead

## Recommended Optimizations

### Immediate Fixes

1. **Disable AI Summary by Default**
   - Only generate on explicit user request
   - Add "Show AI Summary" button
   - Current: Always runs, 5-10s penalty

2. **Make Semantic Search Opt-In**
   - Default to keyword search (much faster)
   - User toggles semantic mode
   - Current: Semantic by default

3. **Add Response Time Logging**
   - Track Elasticsearch query time
   - Track AI summary time
   - Identify exact bottlenecks

### Future Optimizations

1. **Server-Side LLM Cache** (Redis/Upstash)
   - Already implemented, needs credentials
   - Would eliminate repeat AI calls

2. **Elasticsearch Query Optimization**
   - Reduce semantic field count (3 → 1)
   - Use `preference` parameter for consistent shard routing
   - Consider `search_type=dfs_query_then_fetch`

3. **Async AI Summary**
   - Return search results immediately
   - Stream AI summary separately
   - Better UX with progressive loading

## Performance Targets

- **Keyword Search**: < 2 seconds ✅ (achievable)
- **Semantic Search**: < 5 seconds ⏱️ (needs ELSER optimization)
- **AI Summary**: < 3 seconds ⏱️ (with cache) or async

## Current Status

Search is slow because:
- AI Summary runs on EVERY search (even cached frontend)
- Semantic search hits 3 semantic fields
- No server-side caching enabled

**Quick Win**: Disable AI summary auto-generation → Expected 15-20s improvement

