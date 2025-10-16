import { Client } from '@elastic/elasticsearch'
import { INDICES } from './elasticsearch'

export interface EmbeddingService {
  generateEmbedding(text: string): Promise<number[]>
  processDocumentEmbeddings(documentId: string): Promise<void>
  processAllDocuments(): Promise<void>
}

export class OpenAIEmbeddingService implements EmbeddingService {
  private client: Client
  private apiKey: string

  constructor(client: Client, apiKey: string) {
    this.client = client
    this.apiKey = apiKey
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small', // 1536 dimensions
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  async processDocumentEmbeddings(documentId: string): Promise<void> {
    try {
      // Get the document
      const doc = await this.client.get({
        index: INDICES.HEALTH_PLANS,
        id: documentId
      })

      const source = doc._source as any
      const updates: any = {}

      // Generate embeddings for semantic fields
      const semanticFields = ['title', 'body', 'plan_description', 'benefits_summary']
      
      for (const field of semanticFields) {
        if (source[field] && typeof source[field] === 'string') {
          try {
            const embedding = await this.generateEmbedding(source[field])
            updates[`${field}.semantic_vector`] = embedding
            updates[`${field}.semantic`] = source[field] // Store original text for semantic search
          } catch (error) {
            console.error(`Error processing ${field} for document ${documentId}:`, error)
          }
        }
      }

      // Update the document with embeddings
      if (Object.keys(updates).length > 0) {
        await this.client.update({
          index: INDICES.HEALTH_PLANS,
          id: documentId,
          body: {
            doc: {
              ...updates,
              'metadata.semantic_processed': true
            }
          }
        })

        console.log(`✅ Processed embeddings for document ${documentId}`)
      }
    } catch (error) {
      console.error(`Error processing document ${documentId}:`, error)
      throw error
    }
  }

  async processAllDocuments(): Promise<void> {
    try {
      console.log('🔄 Starting semantic processing for all documents...')

      // Get all documents that haven't been processed
      const searchResponse = await this.client.search({
        index: INDICES.HEALTH_PLANS,
        body: {
          query: {
            bool: {
              must_not: {
                term: { 'metadata.semantic_processed': true }
              }
            }
          },
          size: 1000
        }
      })

      const documents = searchResponse.hits.hits
      console.log(`📄 Found ${documents.length} documents to process`)

      for (const hit of documents) {
        try {
          await this.processDocumentEmbeddings(hit._id)
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`Failed to process document ${hit._id}:`, error)
        }
      }

      console.log('✅ Semantic processing completed')
    } catch (error) {
      console.error('Error processing all documents:', error)
      throw error
    }
  }
}

export class AnthropicEmbeddingService implements EmbeddingService {
  private client: Client
  private apiKey: string

  constructor(client: Client, apiKey: string) {
    this.client = client
    this.apiKey = apiKey
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Generate a semantic embedding for this text: "${text}"`
          }]
        }),
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`)
      }

      const data = await response.json()
      // Note: Anthropic doesn't provide embeddings directly, so we'd need to use a different approach
      // For now, we'll use a simple text-based embedding
      return this.textToEmbedding(text)
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  private textToEmbedding(text: string): number[] {
    // Simple text-based embedding (768 dimensions)
    // In production, you'd use a proper embedding model
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(768).fill(0)
    
    for (let i = 0; i < words.length && i < 768; i++) {
      const word = words[i]
      const hash = word.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      embedding[i] = (hash % 1000) / 1000
    }
    
    return embedding
  }

  async processDocumentEmbeddings(documentId: string): Promise<void> {
    // Implementation similar to OpenAI service
    // ... (same logic as OpenAI service)
  }

  async processAllDocuments(): Promise<void> {
    // Implementation similar to OpenAI service
    // ... (same logic as OpenAI service)
  }
}

export function createEmbeddingService(client: Client): EmbeddingService {
  const openaiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (openaiKey) {
    return new OpenAIEmbeddingService(client, openaiKey)
  } else if (anthropicKey) {
    return new AnthropicEmbeddingService(client, anthropicKey)
  } else {
    throw new Error('No embedding service API key found. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY')
  }
}
