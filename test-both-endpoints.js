// Test both endpoints to show the difference
const http = require('http');
const fs = require('fs');

const postData = JSON.stringify({
  "subreddit": "r/AITAH",
  "author": "u/Imper1ousPrefect",
  "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
  "upvotes": "144",
  "comments": "22",
  "timeAgo": "11d ago"
});

console.log('🧪 Testing both API endpoints...\n');

// Test 1: JSON endpoint (base64)
console.log('1️⃣ Testing JSON endpoint (base64 response)...');
testEndpoint('/api/generate-reddit-image', 'json-response.json', 'reddit-post-json.png');

// Test 2: Binary endpoint
console.log('2️⃣ Testing Binary endpoint (direct image)...');
testEndpoint('/api/generate-reddit-image-binary', null, 'reddit-post-binary.png');

function testEndpoint(path, jsonFile, imageFile) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`   📊 Status: ${res.statusCode}`);
    console.log(`   📋 Content-Type: ${res.headers['content-type']}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        if (res.headers['content-type'] === 'application/json') {
          // JSON response (base64)
          try {
            const response = JSON.parse(data);
            console.log(`   ✅ JSON Response received`);
            console.log(`   📏 Image size: ${Math.round(response.image.length / 1024)} KB (base64)`);
            console.log(`   📐 Dimensions: ${response.dimensions}`);
            
            // Save JSON response
            if (jsonFile) {
              fs.writeFileSync(jsonFile, JSON.stringify(response, null, 2));
              console.log(`   💾 JSON saved as: ${jsonFile}`);
            }
            
            // Convert base64 to image
            const imageBuffer = Buffer.from(response.image, 'base64');
            fs.writeFileSync(imageFile, imageBuffer);
            console.log(`   🖼️  Image saved as: ${imageFile}`);
            
          } catch (error) {
            console.error(`   ❌ Parse Error: ${error.message}`);
          }
        } else if (res.headers['content-type'] === 'image/png') {
          // Binary response (direct image)
          console.log(`   ✅ Binary Image received`);
          console.log(`   📏 Image size: ${Math.round(data.length / 1024)} KB (binary)`);
          
          // Save binary image directly
          fs.writeFileSync(imageFile, data);
          console.log(`   🖼️  Image saved as: ${imageFile}`);
        }
      } else {
        console.error(`   ❌ Error: ${res.statusCode}`);
        console.log(`   📝 Response: ${data.substring(0, 200)}...`);
      }
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.error(`   ❌ Request Error: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Make sure the server is running: npm run dev');
    }
  });

  req.setTimeout(30000, () => {
    console.error('   ❌ Request timeout');
    req.destroy();
  });

  req.write(postData);
  req.end();
}
