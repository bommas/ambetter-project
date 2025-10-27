#!/usr/bin/env node

/**
 * Multi-State PDF and Content Processor for Ambetter Health Plans
 * 
 * This script:
 * 1. Crawls multiple state health plan pages (Texas, Florida)
 * 2. Extracts PDFs from brochure pages
 * 3. Crawls general health plan content (text-based information)
 * 4. Indexes everything into Elasticsearch
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const config = require('../config/app-config');

// Configuration
const TEMP_DIR = path.resolve(config.pdfProcessing.tempDir);
const ELASTIC_ENDPOINT = config.elasticsearch.endpoint;
const ELASTIC_API_KEY = config.elasticsearch.apiKey;
// Use TARGET_INDEX if provided (for dynamic index creation via admin UI), otherwise use default
const ELASTIC_INDEX = process.env.TARGET_INDEX || config.elasticsearch.indices.healthPlans;

// Ensure temp directory exists
fs.ensureDirSync(TEMP_DIR);

console.log('🚀 Multi-State Ambetter Health Plans Processor');
console.log('=' .repeat(60));
console.log(`Temp Directory: ${TEMP_DIR}`);
console.log(`Elasticsearch: ${ELASTIC_ENDPOINT}`);
console.log(`Index: ${ELASTIC_INDEX}`);
console.log('=' .repeat(60));

/**
 * Extract PDFs from a brochure/plans page
 */
async function extractPDFsFromPage(url, state) {
  console.log(`\n📄 Extracting PDFs from: ${url}`);
  
  const browser = await puppeteer.launch(config.puppeteer);
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent(config.puppeteer.userAgent);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to expand/show all results if there's a pagination control
    try {
      const resultCountSelector = 'select#ResultCount';
      const resultCount = await page.$(resultCountSelector);
      if (resultCount) {
        console.log('📊 Found pagination control, selecting "All"...');
        await page.select(resultCountSelector, '500'); // Select maximum
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log('ℹ️  No pagination control found');
    }
    
    // Extract all PDF links
    const pdfLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href$=".pdf"], a[href*=".pdf"]'));
      return links.map(link => ({
        url: link.href,
        text: link.textContent.trim(),
        title: link.getAttribute('title') || link.textContent.trim()
      }));
    });
    
    console.log(`✅ Found ${pdfLinks.length} PDF links`);
    
    await browser.close();
    return pdfLinks;
    
  } catch (error) {
    console.error(`❌ Error extracting PDFs from ${url}:`, error.message);
    await browser.close();
    return [];
  }
}

/**
 * Crawl general content from a health plans page (non-PDF content)
 */
async function crawlHealthPlansContent(url, state) {
  console.log(`\n📰 Crawling content from: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': config.puppeteer.userAgent
      },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract main content
    const title = $('h1').first().text().trim() || `${state} Health Plans`;
    
    // Remove scripts, styles, and navigation
    $('script, style, nav, header, footer, .navigation, .menu').remove();
    
    // Extract text from main content areas
    const contentSections = [];
    
    // Extract plan descriptions
    $('h2, h3, h4').each((i, elem) => {
      const heading = $(elem).text().trim();
      const content = $(elem).nextUntil('h2, h3, h4').text().trim();
      if (heading && content) {
        contentSections.push({
          heading,
          content
        });
      }
    });
    
    // Extract all paragraph text
    const allText = $('p, li').map((i, elem) => $(elem).text().trim()).get().join(' ');
    
    const document = {
      title,
      url,
      state,
      document_type: 'health_plans_info',
      plan_type: 'general_information',
      extracted_text: allText,
      content_sections: contentSections,
      metadata: {
        source: 'ambetter_health_plans',
        state,
        crawled_at: new Date().toISOString(),
        content_type: 'web_page'
      }
    };
    
    console.log(`✅ Extracted content: ${allText.length} characters`);
    return document;
    
  } catch (error) {
    console.error(`❌ Error crawling content from ${url}:`, error.message);
    return null;
  }
}

/**
 * Download a PDF file
 */
async function downloadPDF(pdfUrl, filename) {
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    const response = await axios({
      method: 'get',
      url: pdfUrl,
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': config.puppeteer.userAgent
      }
    });
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filepath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Error downloading ${pdfUrl}:`, error.message);
    return null;
  }
}

/**
 * Extract text from PDF using pdftotext
 */
async function extractTextFromPDF(filepath) {
  try {
    const outputPath = filepath.replace('.pdf', '.txt');
    await execPromise(`pdftotext "${filepath}" "${outputPath}"`);
    const text = await fs.readFile(outputPath, 'utf-8');
    await fs.unlink(outputPath); // Clean up txt file
    return text;
  } catch (error) {
    console.error(`❌ Error extracting text from ${filepath}:`, error.message);
    return '';
  }
}

/**
 * Index document to Elasticsearch
 */
async function indexToElasticsearch(document) {
  try {
    const targetIndex = ELASTIC_INDEX;
    console.log(`📤 Indexing to: ${targetIndex}`);
    const response = await axios.post(
      `${ELASTIC_ENDPOINT}/${targetIndex}/_doc`,
      document,
      {
        headers: {
          'Authorization': `ApiKey ${ELASTIC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Successfully indexed to ${targetIndex}, document ID: ${response.data._id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Elasticsearch indexing error:', error.response?.data || error.message);
    console.error(`❌ Target index was: ${ELASTIC_INDEX}`);
    return null;
  }
}

/**
 * Process a single state
 */
async function processState(stateKey, stateConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏛️  Processing ${stateConfig.state} (${stateKey})`);
  console.log('='.repeat(60));
  
  let totalIndexed = 0;
  
  // 1. Crawl general health plans content
  if (stateConfig.crawlContent && stateConfig.healthPlansUrl) {
    console.log(`\n📝 Step 1: Crawling general content for ${stateConfig.state}...`);
    const contentDoc = await crawlHealthPlansContent(stateConfig.healthPlansUrl, stateConfig.state);
    
    if (contentDoc) {
      const result = await indexToElasticsearch(contentDoc);
      if (result) {
        console.log(`✅ Indexed general content for ${stateConfig.state}`);
        totalIndexed++;
      }
    }
  }
  
  // 2. Extract and process PDFs
  if (stateConfig.extractPDFs) {
    // Collect all brochure URLs (EPO, HMO, etc.)
    const brochureUrls = [];
    if (stateConfig.brochuresUrl) brochureUrls.push({ url: stateConfig.brochuresUrl, type: 'EPO' });
    if (stateConfig.brochuresUrlHMO) brochureUrls.push({ url: stateConfig.brochuresUrlHMO, type: 'HMO' });
    if (brochureUrls.length === 0 && stateConfig.healthPlansUrl) {
      brochureUrls.push({ url: stateConfig.healthPlansUrl, type: 'General' });
    }
    
    console.log(`\n📄 Step 2: Extracting PDFs for ${stateConfig.state}...`);
    console.log(`Found ${brochureUrls.length} brochure page(s) to crawl`);
    
    let allPdfLinks = [];
    
    // Extract PDFs from all brochure pages
    for (const brochurePage of brochureUrls) {
      console.log(`\n🔍 Crawling ${brochurePage.type} brochures: ${brochurePage.url}`);
      const pdfLinks = await extractPDFsFromPage(brochurePage.url, stateConfig.state);
      console.log(`  Found ${pdfLinks.length} PDFs on ${brochurePage.type} page`);
      
      // Tag PDFs with their source type
      pdfLinks.forEach(pdf => pdf.planType = brochurePage.type);
      allPdfLinks = allPdfLinks.concat(pdfLinks);
    }
    
    console.log(`\n📊 Total PDFs to process: ${allPdfLinks.length}`);
    
    for (let i = 0; i < allPdfLinks.length; i++) {
      const pdfLink = allPdfLinks[i];
      console.log(`\n[${i + 1}/${allPdfLinks.length}] Processing ${pdfLink.planType}: ${pdfLink.url}`);
      
      const filename = path.basename(new URL(pdfLink.url).pathname);
      const filepath = await downloadPDF(pdfLink.url, filename);
      
      if (filepath) {
        console.log(`📥 Downloaded: ${filename}`);
        
        const extractedText = await extractTextFromPDF(filepath);
        console.log(`📝 Extracted: ${extractedText.length} characters`);
        
        const document = {
          title: pdfLink.title || filename,
          plan_name: pdfLink.title || filename.replace('.pdf', ''),
          state: stateConfig.state,
          url: pdfLink.url,
          document_url: pdfLink.url,
          extracted_text: extractedText,
          plan_type: pdfLink.planType?.toLowerCase() || 'brochure',
          pdf: {
            filename: filename,
            size: (await fs.stat(filepath)).size
          },
          metadata: {
            source: 'ambetter_brochures',
            state: stateConfig.state,
            plan_type: pdfLink.planType,
            file_name: filename,
            indexed_at: new Date().toISOString()
          }
        };
        
        const result = await indexToElasticsearch(document);
        if (result) {
          console.log(`✅ Indexed: ${filename}`);
          totalIndexed++;
        }
        
        // Clean up PDF
        await fs.unlink(filepath);
      }
    }
  }
  
  console.log(`\n✨ ${stateConfig.state} Complete: ${totalIndexed} documents indexed`);
  return totalIndexed;
}

/**
 * Main execution
 */
async function main() {
  const startTime = Date.now();
  let totalDocuments = 0;
  
  try {
    // Process each state
    for (const [stateKey, stateConfig] of Object.entries(config.ambetter.states)) {
      const count = await processState(stateKey, stateConfig);
      totalDocuments += count;
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ PROCESSING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total Documents Indexed: ${totalDocuments}`);
    console.log(`Total Duration: ${duration}s`);
    console.log(`Index: ${ELASTIC_INDEX}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

async function processSingleUrl(singleUrl, state) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎯 Processing single URL: ${singleUrl} (state=${state || 'N/A'})`)
  console.log(`${'='.repeat(60)}`)

  let totalIndexed = 0
  
  // Extract PDFs
  const pdfLinks = await extractPDFsFromPage(singleUrl, state || 'NA')
  console.log(`📊 Total PDFs to process from single URL: ${pdfLinks.length}`)

  // If there are PDFs, process them
  if (pdfLinks.length > 0) {
    for (let i = 0; i < pdfLinks.length; i++) {
      const pdfLink = pdfLinks[i]
      console.log(`\n[${i + 1}/${pdfLinks.length}] Processing ${pdfLink.planType || 'PDF'}: ${pdfLink.url}`)

      try {
        const filename = path.basename(new URL(pdfLink.url).pathname)
        const filepath = await downloadPDF(pdfLink.url, filename)
        if (!filepath) continue

        const extractedText = await extractTextFromPDF(filepath)
        const document = {
          title: pdfLink.title || filename,
          plan_name: pdfLink.title || filename.replace('.pdf', ''),
          state: state || 'NA',
          url: pdfLink.url,
          document_url: pdfLink.url,
          extracted_text: extractedText,
          plan_type: (pdfLink.planType || 'brochure').toLowerCase(),
          pdf: {
            filename: filename,
            size: (await fs.stat(filepath)).size
          },
          metadata: {
            source: 'ambetter_brochures_single',
            state: state || 'NA',
            plan_type: pdfLink.planType,
            file_name: filename,
            indexed_at: new Date().toISOString()
          }
        }
        const result = await indexToElasticsearch(document)
        if (result) {
          console.log(`✅ Indexed: ${filename}`)
          totalIndexed++
        }
        await fs.unlink(filepath)
      } catch (e) {
        console.error('❌ Error processing PDF:', e.message)
      }
    }
  } else {
    // No PDFs found, crawl the page content instead
    console.log('📄 No PDFs found, crawling page content...')
    try {
      const contentDoc = await crawlHealthPlansContent(singleUrl, state || 'NA')
      if (contentDoc) {
        const result = await indexToElasticsearch(contentDoc)
        if (result) {
          console.log(`✅ Indexed page content`)
          totalIndexed++
        }
      }
    } catch (e) {
      console.error('❌ Error crawling page content:', e.message)
    }
  }

  console.log(`\n✨ Single URL Complete: ${totalIndexed} documents indexed`)
  return totalIndexed
}

// Run if executed directly
if (require.main === module) {
  const singleUrl = process.env.SINGLE_URL
  const singleState = process.env.SINGLE_STATE
  if (singleUrl) {
    processSingleUrl(singleUrl, singleState).catch(err => {
      console.error('Fatal error (single):', err)
      process.exit(1)
    })
  } else {
    main().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  }
}

module.exports = { main, processState, crawlHealthPlansContent, extractPDFsFromPage, processSingleUrl };

