#!/bin/bash

# Reddit Image Generator API Test
# Using the exact data from your example

echo "🚀 Testing Reddit Image Generator API with curl..."
echo "📝 Request data:"
cat << 'EOF'
{
  "subreddit": "r/AITAH",
  "author": "u/Imper1ousPrefect", 
  "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
  "upvotes": "144",
  "comments": "22",
  "timeAgo": "11d ago"
}
EOF

echo ""
echo "🔄 Making API call..."

curl -X POST http://localhost:3000/api/generate-reddit-image \
  -H "Content-Type: application/json" \
  -d '{
    "subreddit": "r/AITAH",
    "author": "u/Imper1ousPrefect",
    "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
    "upvotes": "144",
    "comments": "22",
    "timeAgo": "11d ago"
  }' \
  --max-time 30 \
  -w "\n\n📊 Response Info:\nStatus: %{http_code}\nTime: %{time_total}s\nSize: %{size_download} bytes\n" \
  -o response.json

echo ""
echo "✅ Response saved to response.json"
echo "💡 To extract the image, run:"
echo "   node -e \"const data=require('./response.json'); require('fs').writeFileSync('reddit-post.png', Buffer.from(data.image, 'base64'))\""
