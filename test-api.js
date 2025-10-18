const https = require('https');
const http = require('http');

// Test data from your example
const testData = {
  "subreddit": "r/AITAH",
  "author": "u/Imper1ousPrefect",
  "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
  "upvotes": "144",
  "comments": "22",
  "timeAgo": "11d ago"
};

function testRedditImageAPI() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Testing Reddit Image Generator API...');
    console.log('📝 Request data:', JSON.stringify(testData, null, 2));
    
    const postData = JSON.stringify(testData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/generate-reddit-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Success!');
            console.log('📊 Response status:', res.statusCode);
            console.log('🖼️  Image format:', response.format);
            console.log('📐 Dimensions:', response.dimensions);
            console.log('📏 Image size:', Math.round(response.image.length / 1024), 'KB (base64)');
            
            // Save the image to a file
            const fs = require('fs');
            const imageBuffer = Buffer.from(response.image, 'base64');
            fs.writeFileSync('generated-reddit-post.png', imageBuffer);
            console.log('💾 Image saved as: generated-reddit-post.png');
            resolve(response);
          } else {
            console.error('❌ API Error:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (error) {
          console.error('❌ Parse Error:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure the server is running on port 3000');
        console.log('   Run: npm run dev');
      }
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      console.error('❌ Request timeout (30s)');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Run the test
testRedditImageAPI()
  .then(() => {
    console.log('🎉 Test completed successfully!');
  })
  .catch((error) => {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  });
