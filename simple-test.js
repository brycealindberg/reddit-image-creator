// Simple test using only built-in Node.js modules
const http = require('http');
const fs = require('fs');

// Your exact test data
const postData = JSON.stringify({
  "subreddit": "r/AITAH",
  "author": "u/Imper1ousPerfect",
  "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
  "upvotes": "144",
  "comments": "22",
  "timeAgo": "11d ago"
});

console.log('🚀 Testing Reddit Image Generator API...');
console.log('📝 Sending data:', postData);

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
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 && response.success) {
        console.log('✅ Success!');
        console.log('🖼️  Format:', response.format);
        console.log('📐 Dimensions:', response.dimensions);
        console.log('📏 Image size:', Math.round(response.image.length / 1024), 'KB');
        
        // Save the image
        const imageBuffer = Buffer.from(response.image, 'base64');
        fs.writeFileSync('reddit-post.png', imageBuffer);
        console.log('💾 Image saved as: reddit-post.png');
        console.log('🎉 Test completed successfully!');
      } else {
        console.error('❌ API Error:', response);
      }
    } catch (error) {
      console.error('❌ Parse Error:', error.message);
      console.log('Raw response:', data.substring(0, 200) + '...');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 Make sure the server is running:');
    console.log('   npm run dev');
  }
});

req.setTimeout(30000, () => {
  console.error('❌ Request timeout');
  req.destroy();
});

req.write(postData);
req.end();
