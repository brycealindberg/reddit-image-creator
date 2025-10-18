const { generateRedditPostHTML } = require('./template');

// Simple fallback generator that returns HTML instead of image
// This can be used for testing when Puppeteer has issues
async function generateRedditImageSimple(postData) {
  try {
    console.log('Using simple HTML generator for:', postData.subreddit);
    
    // Generate HTML content
    const htmlContent = generateRedditPostHTML(postData);
    
    // For testing purposes, return the HTML as base64
    // In a real scenario, you'd convert this to an image
    const base64Html = Buffer.from(htmlContent).toString('base64');
    
    console.log('HTML generation completed successfully');
    return base64Html;
    
  } catch (error) {
    console.error('Error in generateRedditImageSimple:', error);
    throw new Error(`Failed to generate Reddit HTML: ${error.message}`);
  }
}

module.exports = {
  generateRedditImageSimple
};
