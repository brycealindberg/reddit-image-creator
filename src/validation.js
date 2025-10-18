const Joi = require('joi');

const redditPostSchema = Joi.object({
  subreddit: Joi.string()
    .pattern(/^r\/[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Subreddit must be in format "r/subredditname"',
      'any.required': 'Subreddit is required'
    }),
  
  author: Joi.string()
    .pattern(/^u\/[a-zA-Z0-9_-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Author must be in format "u/username"',
      'any.required': 'Author is required'
    }),
  
  title: Joi.string()
    .min(1)
    .max(300)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title must be less than 300 characters',
      'any.required': 'Title is required'
    }),
  
  upvotes: Joi.string()
    .pattern(/^[\d.]+[KMB]?$/)
    .required()
    .messages({
      'string.pattern.base': 'Upvotes must be a number with optional K/M/B suffix (e.g., "1.5K", "100", "2.3M")',
      'any.required': 'Upvotes is required'
    }),
  
  comments: Joi.string()
    .pattern(/^[\d.]+[KMB]?$/)
    .required()
    .messages({
      'string.pattern.base': 'Comments must be a number with optional K/M/B suffix (e.g., "1.5K", "100", "2.3M")',
      'any.required': 'Comments is required'
    }),
  
  timeAgo: Joi.string()
    .pattern(/^\d+[smhdwy] ago$/)
    .required()
    .messages({
      'string.pattern.base': 'Time ago must be in format "Xs ago", "Xm ago", "Xh ago", "Xd ago", "Xw ago", or "Xy ago"',
      'any.required': 'Time ago is required'
    })
});

function validateRedditPostData(data) {
  return redditPostSchema.validate(data, { abortEarly: false });
}

module.exports = {
  validateRedditPostData
};
