const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { generateRedditImage } = require('./generator');
const { validateRedditPostData } = require('./validation');

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Binary image endpoint for n8n
app.post('/api/generate-reddit-image-binary', async (req, res) => {
  try {
    // Validate input data
    const { error, value } = validateRedditPostData(req.body);
    if (error) {
      logger.warn('Validation error', { error: error.details[0].message, body: req.body });
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.details[0].message
      });
    }

    const postData = value;
    logger.info('Generating Reddit image (binary)', { 
      subreddit: postData.subreddit,
      author: postData.author 
    });

    // Generate the image
    const imageBase64 = await generateRedditImage(postData);
    
    logger.info('Image generated successfully (binary)', { 
      subreddit: postData.subreddit,
      author: postData.author 
    });

    // Convert base64 to buffer and return as binary
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length,
      'Content-Disposition': `attachment; filename="reddit-post-${Date.now()}.png"`
    });
    
    res.send(imageBuffer);

  } catch (error) {
    logger.error('Error generating Reddit image (binary)', { 
      error: error.message, 
      stack: error.stack,
      body: req.body 
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate Reddit image'
    });
  }
});

// Main API endpoint (JSON response)
app.post('/api/generate-reddit-image', async (req, res) => {
  try {
    // Validate input data
    const { error, value } = validateRedditPostData(req.body);
    if (error) {
      logger.warn('Validation error', { error: error.details[0].message, body: req.body });
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.details[0].message
      });
    }

    const postData = value;
    logger.info('Generating Reddit image', { 
      subreddit: postData.subreddit,
      author: postData.author 
    });

    // Generate the image
    const imageBase64 = await generateRedditImage(postData);
    
    logger.info('Image generated successfully', { 
      subreddit: postData.subreddit,
      author: postData.author 
    });

    // Return base64 encoded image
    res.status(200).json({
      success: true,
      image: imageBase64,
      format: 'png',
      dimensions: '1920x1080 (16:9)'
    });

  } catch (error) {
    logger.error('Error generating Reddit image', { 
      error: error.message, 
      stack: error.stack,
      body: req.body 
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate Reddit image'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error', { 
    error: error.message, 
    stack: error.stack 
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Reddit Image Generator API running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
