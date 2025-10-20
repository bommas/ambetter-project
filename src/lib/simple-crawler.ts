import { Client } from '@elastic/elasticsearch'
import axios from 'axios'
import * as cheerio from 'cheerio'

const client = new Client({
  node: process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud',
  auth: {
    apiKey: process.env.ELASTIC_API_KEY!,
  },
  tls: {
    rejectUnauthorized: false
  }
})

interface HealthPlanDocument {
  plan_name: string
  plan_type: string
  state: string
  county: string
  tobacco_use: boolean
  coverage_area: string
  premium_range: string
  deductible_info: string
  network_providers: string
  specialty_benefits: string
  eligibility_requirements: string
  document_url: string
  extracted_text: string
  title: string
  body: string
  plan_description: string
  benefits_summary: string
  metadata: {
    file_name: string
    file_size: number
    created_at: string
    updated_at: string
    indexed_at: string
  }
}

export async function crawlAmbetterSite(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('🚀 Starting simple crawler for Ambetter health plans...')
    
    // Target URLs for Texas health plans
    const targetUrls = [
      'https://www.ambetterhealth.com/en/tx/2025-brochures-epo/',
      'https://www.ambetterhealth.com/en/tx/',
      'https://www.ambetterhealth.com/en/tx/plans/'
    ]
    
    let totalIndexed = 0
    
    for (const baseUrl of targetUrls) {
      try {
        console.log(`📄 Crawling: ${baseUrl}`)
        const response = await axios.get(baseUrl, {
          headers: {
            'User-Agent': 'AmbetterCrawler/1.0'
          }
        })
        
        const $ = cheerio.load(response.data)
        
        // Find PDF links
        const pdfLinks: string[] = []
        $('a[href$=".pdf"]').each((_, element) => {
          const href = $(element).attr('href')
          if (href) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString()
            pdfLinks.push(fullUrl)
          }
        })
        
        console.log(`📋 Found ${pdfLinks.length} PDF links`)
        
        // Process each PDF
        for (const pdfUrl of pdfLinks.slice(0, 10)) { // Limit to first 10 PDFs for demo
          try {
            console.log(`📄 Processing PDF: ${pdfUrl}`)
            
            // Create a basic document structure
            const document: HealthPlanDocument = {
              plan_name: extractPlanName(pdfUrl),
              plan_type: 'EPO', // Default, could be extracted from content
              state: 'TX',
              county: extractCountyFromUrl(pdfUrl),
              tobacco_use: false, // Default, would need content analysis
              coverage_area: 'Texas',
              premium_range: '',
              deductible_info: '',
              network_providers: '',
              specialty_benefits: '',
              eligibility_requirements: '',
              document_url: pdfUrl,
              extracted_text: `Health plan document from ${pdfUrl}`,
              title: extractPlanName(pdfUrl),
              body: `Health plan information for ${extractPlanName(pdfUrl)}`,
              plan_description: `Comprehensive health plan coverage for Texas residents`,
              benefits_summary: `Includes medical, dental, and vision coverage options`,
              metadata: {
                file_name: pdfUrl.split('/').pop() || 'unknown.pdf',
                file_size: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                indexed_at: new Date().toISOString()
              }
            }
            
            // Index the document
            await client.index({
              index: 'health-plans',
              body: document
            })
            
            totalIndexed++
            console.log(`✅ Indexed: ${document.plan_name}`)
            
          } catch (pdfError) {
            console.error(`❌ Error processing PDF ${pdfUrl}:`, pdfError)
          }
        }
        
      } catch (urlError) {
        console.error(`❌ Error crawling ${baseUrl}:`, urlError)
      }
    }
    
    console.log(`🎉 Crawling completed! Indexed ${totalIndexed} documents`)
    return { success: true, count: totalIndexed }
    
  } catch (error) {
    console.error('❌ Crawler error:', error)
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

function extractPlanName(url: string): string {
  const filename = url.split('/').pop() || ''
  return filename.replace('.pdf', '').replace(/[-_]/g, ' ').trim() || 'Health Plan'
}

function extractCountyFromUrl(url: string): string {
  // Simple county extraction based on common Texas counties
  const counties = ['Harris', 'Dallas', 'Travis', 'Bexar', 'Tarrant', 'Collin', 'Fort Bend', 'Montgomery', 'Galveston', 'Brazoria']
  const urlLower = url.toLowerCase()
  
  for (const county of counties) {
    if (urlLower.includes(county.toLowerCase())) {
      return county
    }
  }
  
  return 'Harris' // Default to Harris County
}
