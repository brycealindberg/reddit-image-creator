const puppeteer = require('puppeteer');
const { generateRedditPostHTML } = require('./template');
const path = require('path');
const fs = require('fs').promises;

let browser = null;

async function initBrowser() {
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      console.log('Browser launched successfully');
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw error;
    }
  }
  return browser;
}

async function generateRedditImage(postData) {
  let page = null;
  
  try {
    console.log('Starting image generation for:', postData.subreddit);
    
    const browser = await initBrowser();
    page = await browser.newPage();
    
    // Set viewport to responsive 16:9 ratio that fits the screen
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });
    
    // Generate HTML content
    const htmlContent = generateRedditPostHTML(postData);
    console.log('HTML content generated, length:', htmlContent.length);
    
    // Set the HTML content with longer timeout
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('Page content loaded');
    
    // Wait a bit for rendering
    await page.waitForTimeout(1000);
    
    // Verify the post element exists
    const postElement = await page.$('.reddit-post');
    
    if (!postElement) {
      throw new Error('Could not find Reddit post element');
    }
    
    console.log('Found post element');
    
    // Take screenshot of the entire 16:9 canvas with transparent background
    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: true // This makes the background transparent
    });
    
    console.log('Screenshot taken, size:', screenshot.length);
    
    // Convert to base64
    const base64Image = screenshot.toString('base64');
    
    console.log('Image generation completed successfully');
    return base64Image;
    
  } catch (error) {
    console.error('Error in generateRedditImage:', error);
    throw new Error(`Failed to generate Reddit image: ${error.message}`);
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (closeError) {
        console.error('Error closing page:', closeError);
      }
    }
  }
}

async function cleanup() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Graceful shutdown
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {
  generateRedditImage,
  cleanup
};
