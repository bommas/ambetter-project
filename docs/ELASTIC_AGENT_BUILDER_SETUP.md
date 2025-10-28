# Elastic Agent Builder Integration Setup

## MCP Server Configuration

### Endpoint
```
https://centene-serverless-demo-a038f2.kb.us-east-1.aws.elastic.cloud/api/agent_builder/mcp
```

### Available Agents
1. **Relevancy Agent** - For search relevancy tuning, query analysis, boosting
2. **Elastic AI Agent** - General queries and assistance

## Current Implementation

### Request Format
The MCP server expects requests in a specific format:

```json
{
  "method": "tools/call",
  "params": {
    "name": "agent-name",
    "arguments": {
      "user_message": "user query",
      "context": {}
    }
  }
}
```

### Authentication
- Uses `Authorization: ApiKey {ELASTIC_API_KEY}`
- API key stored in environment variable: `ELASTIC_API_KEY`

## Connection Status

### Issue
- Error: `MCP Server returned 406`
- This indicates the request format doesn't match what the MCP server expects

### Possible Causes
1. **Incorrect request format** - The server may expect a different JSON structure
2. **Missing headers** - Additional headers may be required
3. **Wrong endpoint** - The MCP endpoint URL might need adjustment
4. **Authentication** - The authorization format might need to be different

## Next Steps

### To Fix Connection
1. **Check Elastic Documentation** - Review the official Elastic Agent Builder MCP API docs
2. **Test with curl** - Try connecting directly to verify the endpoint works:
   ```bash
   curl -X POST "https://centene-serverless-demo-a038f2.kb.us-east-1.aws.elastic.cloud/api/agent_builder/mcp" \
   -H "Authorization: ApiKey {YOUR_API_KEY}" \
   -H "Content-Type: application/json" \
   -d '{"method": "tools/call", "params": {...}}'
   ```

3. **Check Kibana** - Verify the agents are properly configured in Kibana Agent Builder UI

### Alternative Approach
If direct MCP connection continues to fail, we can:
1. Use the fallback Elasticsearch-based responses (already implemented)
2. Wait for Elastic to provide correct API documentation
3. Test the MCP connection separately before integrating

## Current Fallback

The system currently falls back to:
- Direct Elasticsearch queries
- Real-time index statistics
- Context-aware responses based on actual data

This provides full functionality even if MCP connection fails.

