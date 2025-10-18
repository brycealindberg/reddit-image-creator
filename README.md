# Reddit Image Generator API

A Node.js REST API service that generates Reddit-style post images from JSON data using Puppeteer and Express.js.

## Features

- 🎨 **Exact Reddit Mobile Styling**: Replicates the official Reddit mobile light theme
- 🚀 **Fast Image Generation**: Uses Puppeteer for high-quality PNG generation
- 🔒 **Input Validation**: Comprehensive validation with Joi
- 📊 **Rate Limiting**: Built-in rate limiting to prevent abuse
- 🐳 **Docker Ready**: Multi-stage Docker build for production deployment
- 🏥 **Health Checks**: Built-in health monitoring
- 📝 **Structured Logging**: Winston-based logging with multiple levels

## Quick Start

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd reddit-image-generator
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/generate-reddit-image \
     -H "Content-Type: application/json" \
     -d '{
       "subreddit": "r/AITAH",
       "author": "u/Imper1ousPrefect",
       "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
       "upvotes": "15.1K",
       "comments": "3.5K",
       "timeAgo": "11d ago"
     }'
   ```

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually:**
   ```bash
   docker build -t reddit-image-generator .
   docker run -p 3000:3000 reddit-image-generator
   ```

## API Documentation

### POST /api/generate-reddit-image

Generates a Reddit-style post image from JSON data.

**Request Body:**
```json
{
  "subreddit": "r/AITAH",
  "author": "u/Imper1ousPrefect", 
  "title": "AITAH for blowing up my relationship with my sister because she was an affair partner?",
  "upvotes": "15.1K",
  "comments": "3.5K",
  "timeAgo": "11d ago"
}
```

**Response:**
```json
{
  "success": true,
  "image": "iVBORw0KGgoAAAANSUhEUgAA...",
  "format": "png",
  "dimensions": "600x auto"
}
```

**Validation Rules:**
- `subreddit`: Must be in format "r/subredditname"
- `author`: Must be in format "u/username"
- `title`: 1-300 characters
- `upvotes`: Number with optional K/M/B suffix (e.g., "1.5K", "100", "2.3M")
- `comments`: Number with optional K/M/B suffix
- `timeAgo`: Format "Xs ago", "Xm ago", "Xh ago", "Xd ago", "Xw ago", or "Xy ago"

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## Coolify Deployment

This application is optimized for Coolify deployment:

1. **Connect your repository** to Coolify
2. **Set environment variables:**
   - `PORT=3000`
   - `NODE_ENV=production`
   - `LOG_LEVEL=info`
3. **Deploy** - Coolify will automatically build and deploy using the Dockerfile

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Environment mode |
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) |

## Project Structure

```
/
├── src/
│   ├── index.js          # Express server setup
│   ├── template.js       # HTML template generator
│   ├── generator.js      # Puppeteer image generation
│   └── validation.js     # Input validation schemas
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Local development setup
├── package.json          # Dependencies and scripts
├── env.example          # Environment variables template
└── README.md            # This file
```

## Design Specifications

The generated images match Reddit's mobile light theme exactly:

- **Background**: White (#FFFFFF) with gradient background
- **Reddit Icon**: Orange (#FF4500) circular icon
- **Subreddit Name**: Dark gray (#1C1C1C), 12px, weight 500
- **Verified Badge**: Blue checkmark (#0079D3)
- **Time Ago**: Light gray (#7C7C7C)
- **Title**: Dark gray, 15px, weight 400, line-height 1.4
- **Action Bar**: Upvote/downvote arrows, comment count, alert icon, share button
- **Fonts**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Standard rate limit headers included
- **Response**: JSON error message when limit exceeded

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **429 Too Many Requests**: Rate limit exceeded  
- **500 Internal Server Error**: Server errors
- **404 Not Found**: Invalid endpoints

All errors return structured JSON responses with descriptive messages.

## Performance

- **Image Generation**: ~2-3 seconds per image
- **Memory Usage**: ~200-300MB per request
- **Concurrent Requests**: Supports multiple simultaneous requests
- **Caching**: Browser instance reused for better performance

## Security

- **Input Validation**: All inputs validated with Joi schemas
- **Rate Limiting**: Prevents abuse and DoS attacks
- **CORS**: Enabled for cross-origin requests
- **Non-root User**: Docker container runs as non-root user
- **Resource Limits**: Memory and CPU limits in Docker

## Monitoring

- **Health Checks**: Built-in health endpoint
- **Structured Logging**: JSON-formatted logs with Winston
- **Error Tracking**: Comprehensive error logging with stack traces
- **Request Logging**: All requests logged with IP and user agent

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Dependencies

**Production:**
- `express` - Web framework
- `puppeteer` - Headless Chrome for screenshots
- `express-rate-limit` - Rate limiting middleware
- `cors` - Cross-origin resource sharing
- `winston` - Structured logging
- `joi` - Input validation

**Development:**
- `nodemon` - Development server with auto-reload

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the health endpoint: `GET /health`
2. Review logs for error details
3. Verify input data format matches API specification
4. Check rate limiting status in response headers
