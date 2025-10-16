import axios from 'axios'
import * as cheerio from 'cheerio'
import pdfParse from 'pdf-parse'
import { Client } from '@elastic/elasticsearch'
import { INDICES, HEALTH_PLANS_MAPPING } from '@/lib/elasticsearch'

const CRAWLER_BASE_URL = 'https://www.ambetterhealth.com/en/tx/2025-brochures-epo/'
const CRAWLER_DELAY = 1000 // 1 second delay between requests

export interface HealthPlanDocument {
  plan_name: string
  plan_type: string
  state: string
  county?: string
  tobacco_use?: boolean
  coverage_area: string
  premium_range?: string
  deductible_info?: string
  network_providers?: string
  specialty_benefits?: string
  eligibility_requirements?: string
  document_url: string
  extracted_text: string
  metadata: {
    file_name: string
    file_size: number
    created_at: string
    updated_at: string
  }
}

export class PDFCrawler {
  private client: Client
  private visitedUrls: Set<string> = new Set()

  constructor(client: Client) {
    this.client = client
  }

  async crawlAmbetterWebsite(): Promise<HealthPlanDocument[]> {
    console.log('🚀 Starting Ambetter website crawl...')
    
    try {
      // Get the main page
      const response = await axios.get(CRAWLER_BASE_URL, {
        headers: {
          'User-Agent': 'AmbetterCrawler/1.0'
        }
      })

      const $ = cheerio.load(response.data)
      const pdfLinks: string[] = []

      // Find all PDF links
      $('a[href$=".pdf"]').each((_, element) => {
        const href = $(element).attr('href')
        if (href) {
          const fullUrl = href.startsWith('http') ? href : new URL(href, CRAWLER_BASE_URL).toString()
          pdfLinks.push(fullUrl)
        }
      })

      console.log(`📄 Found ${pdfLinks.length} PDF links`)

      const documents: HealthPlanDocument[] = []

      // Process each PDF
      for (const pdfUrl of pdfLinks) {
        if (this.visitedUrls.has(pdfUrl)) continue
        
        try {
          console.log(`📥 Processing: ${pdfUrl}`)
          const document = await this.processPDF(pdfUrl)
          if (document) {
            documents.push(document)
            this.visitedUrls.add(pdfUrl)
          }
          
          // Add delay to be respectful
          await this.delay(CRAWLER_DELAY)
        } catch (error) {
          console.error(`❌ Error processing ${pdfUrl}:`, error)
        }
      }

      console.log(`✅ Crawl completed. Processed ${documents.length} documents`)
      return documents
    } catch (error) {
      console.error('❌ Error during crawl:', error)
      throw error
    }
  }

  private async processPDF(pdfUrl: string): Promise<HealthPlanDocument | null> {
    try {
      // Download PDF
      const response = await axios.get(pdfUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'AmbetterCrawler/1.0'
        }
      })

      // Parse PDF
      const pdfData = await pdfParse(response.data)
      const extractedText = pdfData.text

      // Extract metadata from PDF
      const fileName = pdfUrl.split('/').pop() || 'unknown.pdf'
      const fileSize = response.data.byteLength

      // Parse plan information from text
      const planInfo = this.parsePlanInfo(extractedText, pdfUrl)

      const document: HealthPlanDocument = {
        plan_name: planInfo.planName,
        plan_type: planInfo.planType,
        state: 'Texas',
        county: planInfo.county,
        tobacco_use: planInfo.tobaccoUse,
        coverage_area: planInfo.coverageArea,
        premium_range: planInfo.premiumRange,
        deductible_info: planInfo.deductibleInfo,
        network_providers: planInfo.networkProviders,
        specialty_benefits: planInfo.specialtyBenefits,
        eligibility_requirements: planInfo.eligibilityRequirements,
        document_url: pdfUrl,
        extracted_text: extractedText,
        metadata: {
          file_name: fileName,
          file_size: fileSize,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      return document
    } catch (error) {
      console.error(`❌ Error processing PDF ${pdfUrl}:`, error)
      return null
    }
  }

  private parsePlanInfo(text: string, url: string) {
    // Basic parsing logic - this would be enhanced with more sophisticated NLP
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Extract plan name (usually in the first few lines)
    const planName = this.extractPlanName(lines, url)
    
    // Extract plan type
    const planType = this.extractPlanType(text)
    
    // Extract county information
    const county = this.extractCounty(text)
    
    // Extract tobacco use information
    const tobaccoUse = this.extractTobaccoUse(text)
    
    // Extract coverage area
    const coverageArea = this.extractCoverageArea(text)
    
    // Extract premium range
    const premiumRange = this.extractPremiumRange(text)
    
    // Extract deductible information
    const deductibleInfo = this.extractDeductibleInfo(text)
    
    // Extract network providers
    const networkProviders = this.extractNetworkProviders(text)
    
    // Extract specialty benefits
    const specialtyBenefits = this.extractSpecialtyBenefits(text)
    
    // Extract eligibility requirements
    const eligibilityRequirements = this.extractEligibilityRequirements(text)

    return {
      planName,
      planType,
      county,
      tobaccoUse,
      coverageArea,
      premiumRange,
      deductibleInfo,
      networkProviders,
      specialtyBenefits,
      eligibilityRequirements
    }
  }

  private extractPlanName(lines: string[], url: string): string {
    // Try to extract from URL first
    const urlMatch = url.match(/([^/]+)\.pdf$/i)
    if (urlMatch) {
      return urlMatch[1].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Look for common plan name patterns in text
    for (const line of lines.slice(0, 10)) {
      if (line.match(/\b(EPO|HMO|PPO|POS)\b/i)) {
        return line
      }
      if (line.match(/\b(Plan|Coverage|Benefits)\b/i) && line.length < 100) {
        return line
      }
    }

    return 'Unknown Plan'
  }

  private extractPlanType(text: string): string {
    const planTypeMatch = text.match(/\b(EPO|HMO|PPO|POS)\b/i)
    return planTypeMatch ? planTypeMatch[1].toUpperCase() : 'EPO'
  }

  private extractCounty(text: string): string | undefined {
    const countyMatch = text.match(/\b(Harris|Dallas|Travis|Bexar|Tarrant|Collin|Fort Bend|Montgomery|Galveston|Brazoria)\s+County/i)
    return countyMatch ? countyMatch[1] : undefined
  }

  private extractTobaccoUse(text: string): boolean | undefined {
    const tobaccoMatch = text.match(/\b(tobacco|smoking|smoker)\b/i)
    return tobaccoMatch ? true : undefined
  }

  private extractCoverageArea(text: string): string {
    const coverageMatch = text.match(/\b(coverage area|service area|available in)\b[:\s]*([^.]+)/i)
    return coverageMatch ? coverageMatch[2].trim() : 'Texas'
  }

  private extractPremiumRange(text: string): string | undefined {
    const premiumMatch = text.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*[-–]\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/)
    return premiumMatch ? `$${premiumMatch[1]} - $${premiumMatch[2]}` : undefined
  }

  private extractDeductibleInfo(text: string): string | undefined {
    const deductibleMatch = text.match(/\b(deductible|deduct)\b[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i)
    return deductibleMatch ? `$${deductibleMatch[2]}` : undefined
  }

  private extractNetworkProviders(text: string): string | undefined {
    const networkMatch = text.match(/\b(network|providers?|doctors?|hospitals?)\b[:\s]*([^.]+)/i)
    return networkMatch ? networkMatch[2].trim() : undefined
  }

  private extractSpecialtyBenefits(text: string): string | undefined {
    const benefitsMatch = text.match(/\b(benefits?|coverage|includes?)\b[:\s]*([^.]+)/i)
    return benefitsMatch ? benefitsMatch[2].trim() : undefined
  }

  private extractEligibilityRequirements(text: string): string | undefined {
    const eligibilityMatch = text.match(/\b(eligibility|eligible|requirements?)\b[:\s]*([^.]+)/i)
    return eligibilityMatch ? eligibilityMatch[2].trim() : undefined
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async indexDocuments(documents: HealthPlanDocument[]): Promise<void> {
    console.log(`📝 Indexing ${documents.length} documents to Elasticsearch...`)

    try {
      const bulkBody = []

      for (const doc of documents) {
        bulkBody.push({
          index: {
            _index: INDICES.HEALTH_PLANS,
            _id: doc.document_url
          }
        })
        bulkBody.push(doc)
      }

      const response = await this.client.bulk({ body: bulkBody })
      
      if (response.errors) {
        console.error('❌ Some documents failed to index:', response.items.filter(item => item.index?.error))
      } else {
        console.log('✅ All documents indexed successfully!')
      }
    } catch (error) {
      console.error('❌ Error indexing documents:', error)
      throw error
    }
  }
}
