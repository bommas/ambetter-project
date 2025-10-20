const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client } = require('@elastic/elasticsearch');
const FormData = require('form-data');
const pdf = require('pdf-parse');
const os = require('os');
const config = require('../config/app-config');

// Elasticsearch client
const client = new Client({
  node: config.elasticsearch.endpoint,
  auth: config.elasticsearch.username && config.elasticsearch.password ? {
    username: config.elasticsearch.username,
    password: config.elasticsearch.password,
  } : {
    apiKey: config.elasticsearch.apiKey,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Create temp directory for PDF processing
const tempDir = path.resolve(config.pdfProcessing.tempDir);
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`📁 Created temp directory: ${tempDir}`);
}

// Cleanup function for temp directory
function cleanupTempDir() {
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log(`🧹 Cleaned up ${files.length} temp files`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up temp directory:', error.message);
  }
}

// Function to get PDF URLs from crawler data
async function getPDFUrlsFromCrawler() {
  try {
    console.log('🔍 Searching for PDF URLs in crawler data...');
    
    // First try to get PDFs from crawler data
    const response = await client.search({
      index: config.elasticsearch.indices.healthPlans,
      body: {
        query: {
          bool: {
            should: [
              { wildcard: { "links": "*pdf*" } },
              { wildcard: { "body": "*pdf*" } },
              { wildcard: { "extracted_text": "*pdf*" } },
              { wildcard: { "title": "*pdf*" } },
              { wildcard: { "url": "*pdf*" } }
            ]
          }
        },
        _source: ["links", "body", "extracted_text", "url", "title"]
      }
    });
    
    const pdfUrls = new Set();
    
    // Extract PDF URLs from the search results
    response.hits.hits.forEach(hit => {
      const source = hit._source;
      
      // Check links array
      if (source.links && Array.isArray(source.links)) {
        source.links.forEach(link => {
          if (link && link.includes('.pdf')) {
            pdfUrls.add(link);
          }
        });
      }
      
      // Check body and extracted_text for PDF URLs
      const textFields = [source.body, source.extracted_text, source.title].filter(Boolean);
      textFields.forEach(text => {
        const pdfMatches = text.match(/https?:\/\/[^\s]+\.pdf/gi);
        if (pdfMatches) {
          pdfMatches.forEach(match => pdfUrls.add(match));
        }
      });
    });
    
    // If no PDFs found from crawler, use the dynamic PDF extraction
    if (pdfUrls.size === 0) {
      console.log('📄 No PDFs found in crawler data, using dynamic PDF extraction...');
      const { extractPDFUrls } = require('./extract-pdf-urls');
      const dynamicPDFs = await extractPDFUrls();
      dynamicPDFs.forEach(url => pdfUrls.add(url));
    }
    
    const pdfUrlArray = Array.from(pdfUrls);
    console.log(`📄 Found ${pdfUrlArray.length} PDF URLs:`);
    pdfUrlArray.forEach(url => console.log(`  - ${url}`));
    
    return pdfUrlArray;
    
  } catch (error) {
    console.error('❌ Error getting PDF URLs from crawler:', error.message);
    return [];
  }
}

// Download PDF function
function downloadPDF(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download PDF: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filename)}`);
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Extract text from PDF using pdf-parse library
async function extractTextFromPDF(filename) {
  try {
    console.log(`📄 Extracting text from ${filename}...`);
    
    // Read PDF file
    const pdfBuffer = fs.readFileSync(filename);
    
    // Extract text using pdf-parse
    const data = await pdf(pdfBuffer, {
      // Options for better text extraction
      max: 0, // No page limit
      version: 'v1.10.100' // Use specific version for stability
    });
    
    // Clean and normalize the extracted text
    const cleanText = data.text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
    
    console.log(`✅ Extracted ${cleanText.length} characters from ${filename}`);
    
    return cleanText || 'PDF content extracted but no readable text found';
    
  } catch (error) {
    console.error(`❌ Error extracting text from ${filename}:`, error.message);
    return 'Error extracting text from PDF';
  }
}

// Process a single PDF
async function processPDF(pdfUrl) {
  try {
    const filename = path.basename(pdfUrl);
    
    console.log(`\n🔄 Processing: ${filename}`);
    console.log(`📥 URL: ${pdfUrl}`);
    
    // Download PDF to temp directory
    const tempFilename = path.join(tempDir, `temp_${Date.now()}_${filename}`);
    await downloadPDF(pdfUrl, tempFilename);
    
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(tempFilename);
    
  // Get file stats
  const stats = fs.statSync(tempFilename);

    // Clean the filename and extract plan info
    const cleanFilename = filename.split('?')[0];
    const planInfo = extractPlanInfo(filename);
    const documentType = planInfo.getDocumentTypeFromUrl(pdfUrl);
    
    // Create document for Elasticsearch
    const document = {
      title: planInfo.cleanName,
      plan_name: planInfo.planName,
      plan_type: documentType,
      state: 'Texas',
      county: planInfo.countyCode,
      document_url: pdfUrl,
      url: pdfUrl, // Add URL field for search
      extracted_text: extractedText,
      body: extractedText,
      
      // Enhanced plan-specific fields
      plan_id: planInfo.planType,
      plan_variant: planInfo.planVariant,
      county_code: planInfo.countyCode,
      tobacco_use: null, // Will be extracted from content if available
      
      // Additional metadata
      plan_details: {
        plan_type: planInfo.planType,
        county_code: planInfo.countyCode,
        variant: planInfo.planVariant,
        full_plan_name: planInfo.planName,
        document_type: documentType,
        source_url: pdfUrl
      },
      
      // PDF-specific fields
      pdf: {
        content: extractedText,
        filename: cleanFilename,
        size: stats.size,
        extracted_at: new Date().toISOString()
      },
      
      // Enhanced metadata
      metadata: {
        file_name: cleanFilename,
        file_size: stats.size,
        created_at: stats.birthtime.toISOString(),
        updated_at: stats.mtime.toISOString(),
        indexed_at: new Date().toISOString(),
        plan_info: {
          plan_type: planInfo.planType,
          county_code: planInfo.countyCode,
          variant: planInfo.planVariant,
          document_type: documentType
        }
      }
    };
    
    // Index document
    const response = await client.index({
      index: config.elasticsearch.indices.healthPlans,
      body: document
    });
    
    console.log(`✅ Indexed: ${filename} (ID: ${response._id})`);
    
    // Clean up temp file
    fs.unlinkSync(tempFilename);
    
    return response;
    
  } catch (error) {
    console.error(`❌ Error processing ${pdfUrl}:`, error.message);
    throw error;
  }
}

// Determine plan type from PDF URL
function getPlanTypeFromUrl(pdfUrl) {
  if (pdfUrl.includes('/Brochures/')) return 'brochure';
  if (pdfUrl.includes('/EOC/')) return 'policy';
  if (pdfUrl.includes('/OOC/')) return 'disclosure';
  if (pdfUrl.includes('/SBC/')) return 'sbc';
  return 'document';
}

// Clean filename by removing query parameters
function cleanFilename(filename) {
  return filename.split('?')[0].replace('.pdf', '');
}

// Extract county and plan info from filename
function extractPlanInfo(filename) {
  const cleanName = cleanFilename(filename);
  
  // Extract county code (e.g., 0019, 0064, etc.)
  const countyMatch = cleanName.match(/(\d{4})/);
  const countyCode = countyMatch ? countyMatch[1] : 'unknown';
  
  // Extract plan type (TX014, TX016, TX017)
  const planMatch = cleanName.match(/(TX\d{3})/);
  const planType = planMatch ? planMatch[1] : 'unknown';
  
  // Extract plan variant (e.g., 00, 01, 02, 03, 04, 05, 06)
  const variantMatch = cleanName.match(/(\d{2})$/);
  const planVariant = variantMatch ? variantMatch[1] : '00';
  
  // Extract document type from URL path
  function getDocumentTypeFromUrl(url) {
    if (url.includes('/Brochures/')) return 'brochure';
    if (url.includes('/EOC/')) return 'evidence_of_coverage';
    if (url.includes('/OOC/')) return 'out_of_coverage';
    if (url.includes('/SBC/')) return 'summary_of_benefits';
    return 'document';
  }
  
  // Extract plan name with more detail
  const planName = `${planType}-${countyCode}-${planVariant}`;
  
  return {
    countyCode,
    planType,
    planVariant,
    planName,
    cleanName,
    getDocumentTypeFromUrl
  };
}

// Main processing function
async function processAllPDFs() {
  try {
    console.log('🚀 Starting PDF extraction...');
    
    // Cleanup any leftover temp files from previous runs
    cleanupTempDir();
    
    // Get PDF URLs from crawler data
    const pdfUrls = await getPDFUrlsFromCrawler();
    
    if (pdfUrls.length === 0) {
      console.log('❌ No PDF URLs found in crawler data. Please run the crawler first.');
      return;
    }
    
    console.log(`📄 Found ${pdfUrls.length} PDFs to process`);
    
    const results = [];
    const failedPDFs = [];
    
    for (const pdfUrl of pdfUrls) {
      try {
        const result = await processPDF(pdfUrl);
        results.push(result);
        
        // Add delay between requests to avoid timeouts
        await new Promise(resolve => setTimeout(resolve, config.pdfProcessing.retryDelay));
        
      } catch (error) {
        console.error(`Failed to process ${pdfUrl}:`, error.message);
        failedPDFs.push(pdfUrl);
      }
    }
    
    // Retry failed PDFs
    if (failedPDFs.length > 0) {
      console.log(`\n🔄 Retrying ${failedPDFs.length} failed PDFs...`);
      
      for (const pdfUrl of failedPDFs) {
        try {
          console.log(`\n🔄 Retrying: ${pdfUrl}`);
          const result = await processPDF(pdfUrl);
          results.push(result);
          
        // Longer delay for retries
        await new Promise(resolve => setTimeout(resolve, config.pdfProcessing.retryDelay + 1000));
          
        } catch (error) {
          console.error(`❌ Retry failed for ${pdfUrl}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 PDF extraction complete!`);
    console.log(`✅ Successfully processed: ${results.length} PDFs`);
    console.log(`❌ Failed: ${pdfUrls.length - results.length} PDFs`);
    
    // Verify indexing
    const countResponse = await client.count({ index: config.elasticsearch.indices.healthPlans });
    console.log(`📊 Total documents in index: ${countResponse.count}`);
    
    // Cleanup temp files
    cleanupTempDir();
    
  } catch (error) {
    console.error('❌ Error in PDF processing:', error);
    // Cleanup temp files even on error
    cleanupTempDir();
    process.exit(1);
  }
}

// Run the processor
if (require.main === module) {
  processAllPDFs();
}

module.exports = { processAllPDFs, processPDF };