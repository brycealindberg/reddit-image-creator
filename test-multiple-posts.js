const axios = require('axios');
const fs = require('fs');

// Array of test data (including your example)
const testPosts = [
  {
    "subreddit": "r/AITAH",
    "author": "u/Imper1ousPrefect",
    "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
    "upvotes": "144",
    "comments": "22",
    "timeAgo": "11d ago"
  },
  {
    "subreddit": "r/AskReddit",
    "author": "u/chefmaster",
    "title": "AITA for refusing to pay for my girlfriend's half of dinner after she invited her whole family without telling me?",
    "upvotes": "15.1K",
    "comments": "3.5K",
    "timeAgo": "2h ago"
  },
  {
    "subreddit": "r/relationship_advice",
    "author": "u/throwaway123",
    "title": "My boyfriend (25M) won't let me (23F) hang out with my male friends. Is this controlling behavior?",
    "upvotes": "2.3K",
    "comments": "847",
    "timeAgo": "5h ago"
  }
];

async function generateMultipleImages() {
  console.log('🚀 Generating multiple Reddit post images...\n');
  
  for (let i = 0; i < testPosts.length; i++) {
    const post = testPosts[i];
    const filename = `reddit-post-${i + 1}.png`;
    
    try {
      console.log(`📝 Generating image ${i + 1}/${testPosts.length}:`);
      console.log(`   Subreddit: ${post.subreddit}`);
      console.log(`   Author: ${post.author}`);
      console.log(`   Title: ${post.title.substring(0, 50)}...`);
      
      const response = await axios.post('http://localhost:3000/api/generate-reddit-image', post, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      // Save the image
      const imageBuffer = Buffer.from(response.data.image, 'base64');
      fs.writeFileSync(filename, imageBuffer);
      
      console.log(`✅ Saved: ${filename} (${Math.round(imageBuffer.length / 1024)} KB)\n`);
      
      // Add delay between requests to be respectful
      if (i < testPosts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`❌ Error generating image ${i + 1}:`, error.response?.data || error.message);
      if (error.response?.status === 429) {
        console.log('⏰ Rate limit hit. Waiting 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }
  }
  
  console.log('🎉 All images generated!');
}

// Run the test
generateMultipleImages();
