function calculateDynamicFontSize(title) {
    // Calculate font size based on title length
    const titleLength = title.length;
    const wordCount = title.split(' ').length;
    
    // Base font size calculation
    // Shorter titles get larger fonts, longer titles get smaller fonts
    let fontSize;
    
    if (wordCount <= 3) {
        fontSize = 8; // Very large for short titles
    } else if (wordCount <= 6) {
        fontSize = 7; // Large for medium-short titles
    } else if (wordCount <= 10) {
        fontSize = 6; // Medium for medium titles
    } else if (wordCount <= 15) {
        fontSize = 5; // Smaller for longer titles
    } else {
        fontSize = 4; // Smallest for very long titles
    }
    
    return fontSize;
}

function generateRedditPostHTML(postData) {
    const dynamicFontSize = calculateDynamicFontSize(postData.title);
    
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
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .reddit-post {
            width: 100vw;
            height: 100vh;
            background-color: #FFFFFF;
            border-radius: 0;
            overflow: hidden;
            box-shadow: none;
            display: flex;
            flex-direction: column;
        }
        
        .post-header {
            padding: 3vw 5.33vw;
            display: flex;
            align-items: center;
            gap: 2.67vw;
            flex-shrink: 0;
        }
        
        .subreddit-icon {
            width: 6vw;
            height: 6vw;
            background-color: #FF4500;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3vw;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .header-content {
            display: flex;
            flex-direction: column;
            gap: 0.33vw;
            flex: 1;
        }
        
        .subreddit-name {
            font-size: 3.5vw;
            font-weight: 500;
            color: #1C1C1C;
        }
        
        .author-info {
            display: flex;
            align-items: center;
            gap: 1.33vw;
        }
        
        .author {
            font-size: 3.5vw;
            color: #1C1C1C;
            font-weight: 500;
        }
        
        .verified-badge {
            width: 3.5vw;
            height: 3.5vw;
            background-color: #0079D3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.3vw;
            flex-shrink: 0;
        }
        
        .time-ago {
            font-size: 3.5vw;
            color: #7C7C7C;
            margin-left: auto;
        }
        
        .post-content {
            padding: 0 5.33vw 0 5.33vw;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
        }
        
        .post-title {
            font-weight: 400;
            line-height: 1.2;
            color: #1C1C1C;
            margin-bottom: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            flex: 1;
            display: flex;
            align-items: flex-start;
            padding-top: 2vw;
            width: 100%;
            text-align: left;
            text-justify: inter-word;
            text-align-last: left;
        }
        
        .post-actions {
            display: flex;
            align-items: center;
            gap: 6.67vw;
            padding: 3vw 5.33vw;
            border-top: 1px solid #EDEFF1;
            background-color: #FFFFFF;
            flex-shrink: 0;
            margin-top: 2vw;
        }
        
        .action-item {
            display: flex;
            align-items: center;
            gap: 1.5vw;
            font-size: 3.5vw;
            color: #1C1C1C;
            cursor: pointer;
        }
        
        .vote-group {
            gap: 1vw;
        }
        
        .action-item:hover {
            opacity: 0.7;
        }
        
        .upvote-arrow {
            width: 0;
            height: 0;
            border-left: 1vw solid transparent;
            border-right: 1vw solid transparent;
            border-bottom: 2vw solid #1C1C1C;
            margin-bottom: 0.2vw;
        }
        
        .downvote-arrow {
            width: 0;
            height: 0;
            border-left: 1vw solid transparent;
            border-right: 1vw solid transparent;
            border-top: 2vw solid #1C1C1C;
            margin-top: 0.2vw;
        }
        
        .upvote-count {
            font-weight: 500;
            color: #1C1C1C;
        }
        
        .comment-icon {
            width: 4vw;
            height: 4vw;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231C1C1C' d='M8 0C3.58 0 0 3.58 0 8c0 1.54.4 2.98 1.08 4.24L0 16l3.76-1.08C5.02 15.6 6.46 16 8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        
        .alert-icon {
            width: 4vw;
            height: 4vw;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231C1C1C' d='M8 0C3.58 0 0 3.58 0 8c0 1.54.4 2.98 1.08 4.24L0 16l3.76-1.08C5.02 15.6 6.46 16 8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8zm1 12H7v-2h2v2zm0-4H7V4h2v4z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        
        .share-button {
            display: flex;
            align-items: center;
            gap: 1.5vw;
            padding: 1.5vw 3vw;
            border: 1px solid #EDEFF1;
            border-radius: 1vw;
            background-color: #FFFFFF;
            font-size: 3.5vw;
            color: #1C1C1C;
            cursor: pointer;
            margin-left: auto;
        }
        
        .share-button:hover {
            background-color: #F8F9FA;
        }
        
        .share-icon {
            width: 3.5vw;
            height: 3.5vw;
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
            <div class="post-title" style="font-size: ${dynamicFontSize}vw;">${postData.title}</div>
        </div>
        
        <div class="post-actions">
            <div class="action-item vote-group">
                <div class="upvote-arrow"></div>
                <span class="upvote-count">${postData.upvotes}</span>
                <div class="downvote-arrow"></div>
            </div>
            <div class="action-item">
                <div class="comment-icon"></div>
                <span>${postData.comments}</span>
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
