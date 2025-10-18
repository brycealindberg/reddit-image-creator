function generateRedditPostHTML(postData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reddit Post</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: transparent;
            color: #1C1C1C;
            line-height: 1.4;
            padding: 0;
            margin: 0;
            width: 1920px;
            height: 1080px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .reddit-post {
            width: 1200px;
            max-width: 1200px;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
        }
        
        .post-header {
            padding: 24px 32px;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .subreddit-icon {
            width: 48px;
            height: 48px;
            background-color: #FF4500;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .header-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
        }
        
        .subreddit-name {
            font-size: 24px;
            font-weight: 500;
            color: #1C1C1C;
        }
        
        .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .author {
            font-size: 24px;
            color: #1C1C1C;
            font-weight: 500;
        }
        
        .verified-badge {
            width: 24px;
            height: 24px;
            background-color: #0079D3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .time-ago {
            font-size: 24px;
            color: #7C7C7C;
            margin-left: auto;
        }
        
        .post-content {
            padding: 0 32px 32px 32px;
        }
        
        .post-title {
            font-size: 30px;
            font-weight: 400;
            line-height: 1.4;
            color: #1C1C1C;
            margin-bottom: 16px;
        }
        
        .post-actions {
            display: flex;
            align-items: center;
            gap: 40px;
            padding: 24px 32px;
            border-top: 1px solid #EDEFF1;
            background-color: #FFFFFF;
        }
        
        .action-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            color: #1C1C1C;
            cursor: pointer;
        }
        
        .action-item:hover {
            opacity: 0.7;
        }
        
        .upvote-arrow {
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 16px solid #1C1C1C;
        }
        
        .downvote-arrow {
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 16px solid #1C1C1C;
        }
        
        .upvote-count {
            font-weight: 500;
            color: #1C1C1C;
        }
        
        .comment-icon {
            width: 32px;
            height: 32px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231C1C1C' d='M8 0C3.58 0 0 3.58 0 8c0 1.54.4 2.98 1.08 4.24L0 16l3.76-1.08C5.02 15.6 6.46 16 8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        
        .alert-icon {
            width: 32px;
            height: 32px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231C1C1C' d='M8 0C3.58 0 0 3.58 0 8c0 1.54.4 2.98 1.08 4.24L0 16l3.76-1.08C5.02 15.6 6.46 16 8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8zm1 12H7v-2h2v2zm0-4H7V4h2v4z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        
        .share-button {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 24px;
            border: 1px solid #EDEFF1;
            border-radius: 8px;
            background-color: #FFFFFF;
            font-size: 24px;
            color: #1C1C1C;
            cursor: pointer;
            margin-left: auto;
        }
        
        .share-button:hover {
            background-color: #F8F9FA;
        }
        
        .share-icon {
            width: 28px;
            height: 28px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231C1C1C' d='M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
    </style>
</head>
<body>
    <div class="reddit-post">
        <div class="post-header">
            <div class="subreddit-icon">r</div>
            <div class="header-content">
                <div class="subreddit-name">${postData.subreddit}</div>
                <div class="author-info">
                    <div class="author">${postData.author}</div>
                    <div class="verified-badge">✓</div>
                </div>
            </div>
            <div class="time-ago">${postData.timeAgo}</div>
        </div>
        
        <div class="post-content">
            <div class="post-title">${postData.title}</div>
        </div>
        
        <div class="post-actions">
            <div class="action-item">
                <div class="upvote-arrow"></div>
                <span class="upvote-count">${postData.upvotes}</span>
            </div>
            <div class="action-item">
                <div class="downvote-arrow"></div>
            </div>
            <div class="action-item">
                <div class="comment-icon"></div>
                <span>${postData.comments}</span>
            </div>
            <div class="action-item">
                <div class="alert-icon"></div>
            </div>
            <div class="share-button">
                <div class="share-icon"></div>
                <span>Share</span>
            </div>
        </div>
    </div>
</body>
</html>
`;
}

module.exports = {
  generateRedditPostHTML
};
