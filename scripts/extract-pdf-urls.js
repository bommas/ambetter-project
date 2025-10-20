const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const config = require('../config/app-config');

async function extractPDFUrls() {
  let browser;
  try {
    console.log('🔍 Extracting PDF URLs from Ambetter pages using Puppeteer...');
    
    const baseUrl = config.ambetter.brochuresUrl;
    const pdfUrls = new Set();
    
    // Launch Puppeteer browser
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: config.puppeteer.headless,
      args: config.puppeteer.args
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(config.puppeteer.userAgent);
    
    // Monitor network requests to find API endpoints
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('json') || request.url().includes('data')) {
        apiRequests.push(request.url());
      }
    });
    
    // Navigate to the page
    console.log('📄 Loading page with JavaScript...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the page to load completely
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Try to set the filter to "All" if there's a dropdown
    try {
      console.log('📄 Setting filter to "All"...');
      await page.select('select[name="show"], select[id*="show"], select[class*="show"]', 'all');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log('⚠️ Could not find show filter dropdown, continuing...');
    }
    
    // Extract PDF links from the rendered page
    console.log('📄 Extracting PDF links from rendered page...');
    const pdfLinks = await page.evaluate(() => {
      const links = [];
      const elements = document.querySelectorAll('a[href*=".pdf"]');
      elements.forEach(element => {
        const href = element.getAttribute('href');
        if (href && href.includes('api.centene.com')) {
          links.push(href);
        }
      });
      return links;
    });
    
    pdfLinks.forEach(link => pdfUrls.add(link));
    console.log(`📄 Found ${pdfUrls.size} PDFs from rendered page`);
    
    // Also check for PDF links in the page content
    const pageContent = await page.content();
    const pdfMatches = pageContent.match(/https:\/\/api\.centene\.com\/[^"'\s]+\.pdf/g);
    if (pdfMatches) {
      pdfMatches.forEach(match => pdfUrls.add(match));
    }
    
    console.log(`📄 Total PDFs found after content search: ${pdfUrls.size}`);
    
    // Log API requests for debugging
    console.log(`📄 API requests made: ${apiRequests.length}`);
    apiRequests.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    // If we still don't have many PDFs, try scrolling to load more content
    if (pdfUrls.size < 20) {
      console.log('📄 Scrolling to load more content...');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Extract PDF links again after scrolling
      const morePdfLinks = await page.evaluate(() => {
        const links = [];
        const elements = document.querySelectorAll('a[href*=".pdf"]');
        elements.forEach(element => {
          const href = element.getAttribute('href');
          if (href && href.includes('api.centene.com')) {
            links.push(href);
          }
        });
        return links;
      });
      
      morePdfLinks.forEach(link => pdfUrls.add(link));
      console.log(`📄 Found ${pdfUrls.size} PDFs after scrolling`);
    }
    
    // Try clicking pagination or "Next" buttons to load more content
    if (pdfUrls.size < 20) {
      console.log('📄 Trying to click pagination buttons...');
      try {
        const nextButton = await page.$('a[href*="page"], button[class*="next"], a[class*="next"]');
        if (nextButton) {
          await nextButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const morePdfLinks = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('a[href*=".pdf"]');
            elements.forEach(element => {
              const href = element.getAttribute('href');
              if (href && href.includes('api.centene.com')) {
                links.push(href);
              }
            });
            return links;
          });
          
          morePdfLinks.forEach(link => pdfUrls.add(link));
          console.log(`📄 Found ${pdfUrls.size} PDFs after pagination`);
        }
      } catch (error) {
        console.log('⚠️ Could not click pagination buttons:', error.message);
      }
    }
    
    const pdfUrlArray = Array.from(pdfUrls);
    console.log(`\n📄 Total unique PDF URLs found: ${pdfUrlArray.length}`);
    pdfUrlArray.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    return pdfUrlArray;
    
  } catch (error) {
    console.error('❌ Error extracting PDF URLs:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the extraction
if (require.main === module) {
  extractPDFUrls();
}

module.exports = { extractPDFUrls };
