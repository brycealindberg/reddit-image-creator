// Debug test to check what's happening
const http = require('http');

console.log('🔍 Debug Test - Checking server status...');

// First, check if server is running
const healthCheck = http.get('http://localhost:3000/health', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('✅ Server is running');
    console.log('📊 Health check response:', data);
    
    // Now test the API
    testAPI();
  });
});

healthCheck.on('error', (error) => {
  console.error('❌ Server is not running:', error.message);
  console.log('💡 Start the server with: npm run dev');
});

function testAPI() {
  console.log('\n🚀 Testing API endpoint...');
  
  const postData = JSON.stringify({
    "subreddit": "r/AITAH",
    "author": "u/Imper1ousPrefect",
    "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
    "upvotes": "144",
    "comments": "22",
    "timeAgo": "11d ago"
  });

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
    console.log(`📊 API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📝 API Response:', JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200) {
          console.log('✅ API call successful!');
        } else {
          console.log('❌ API call failed');
        }
      } catch (error) {
        console.error('❌ Parse error:', error.message);
        console.log('Raw response:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  req.setTimeout(60000, () => {
    console.error('❌ Request timeout (60s)');
    req.destroy();
  });

  req.write(postData);
  req.end();
}
