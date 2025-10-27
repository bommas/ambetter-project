# Admin Chat Assistant Feature

## Overview
The Admin Chat Assistant is a new tab in the admin panel that provides an AI-powered chat interface for search relevancy tuning and troubleshooting.

## Features

### 1. **Session Management**
- Each session gets a unique session ID
- Conversations persist during the session
- **Session resets** when user navigates away from the chat tab
- All conversation history is cleared when switching tabs

### 2. **Caching**
- Responses to repeated questions are cached for 1 hour
- Reduces API costs and improves response time
- Cache automatically managed (max 100 entries, LRU eviction)

### 3. **Admin-Only Access**
- Protected by admin authentication
- Uses the same `OPENAI_API_KEY` environment variable
- Only accessible via `/admin` route

### 4. **Search Relevancy Focus**
The AI assistant is specialized to help with:
- **Query Analysis**: Show queries with no results, analyze search patterns
- **Field Boosting**: Recommendations for adjusting field weights
- **Synonym Management**: Add common misspellings, abbreviations
- **Fuzziness**: Typo tolerance adjustments
- **Curations**: Pinning/excluding documents for specific queries
- **Filter Refinement**: Ensuring faceted filters work correctly
- **Semantic Search Tuning**: ELSER model parameter adjustments
- **Performance Insights**: Search patterns, popular queries
- **Troubleshooting**: Debug search issues, relevance problems

## Technical Implementation

### Files Created
1. `src/app/admin/AdminChat.tsx` - Main chat UI component
2. `src/app/api/admin/chat/route.ts` - API endpoint for chat
3. Updated `src/app/admin/AdminTabs.tsx` - Added new "Chat Assistant" tab

### API Endpoint
- **URL**: `/api/admin/chat`
- **Method**: POST
- **Authentication**: Required (admin_auth cookie)
- **Request Body**:
  ```json
  {
    "message": "Your question",
    "sessionId": "unique-session-id",
    "conversationHistory": [...]
  }
  ```
- **Response**:
  ```json
  {
    "reply": "AI assistant response"
  }
  ```

### OpenAI Configuration
- **Model**: `gpt-4o-mini`
- **Temperature**: 0.7
- **Max Tokens**: 1000
- **System Prompt**: Specialized for search relevancy assistance

## Usage

1. Navigate to Admin Panel (`/admin`)
2. Click on the **"Chat Assistant"** tab
3. Ask questions like:
   - "Show me queries with no results"
   - "How can I improve search relevancy?"
   - "Analyze search performance"
   - "What boost values should I use for fields?"

## Session Behavior

- **Chat History**: Persists during the session
- **Tab Navigation**: Session resets when navigating away from chat tab
- **Cache**: Preserved across sessions (not cleared)
- **Auto-scroll**: Messages automatically scroll to bottom
- **Clear Button**: Manual "Clear Session" button to reset conversation

## Security

- Protected by admin authentication
- Session-specific responses (context doesn't leak between sessions)
- Environment variable for OpenAI API key (Vercel)

## Future Enhancements

- Add query analysis integration (show actual query logs)
- Integrate with Elasticsearch for real-time data
- Add visualization for search performance metrics
- Export conversation history
- Multi-language support

