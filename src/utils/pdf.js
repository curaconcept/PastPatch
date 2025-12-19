/**
 * PDF generation utilities
 * Note: For full PDF support, consider using jsPDF library
 * This is a basic implementation using data URLs
 */

/**
 * Create a simple HTML document that can be printed to PDF
 * @param {string} title - Document title
 * @param {string} content - HTML content
 * @returns {Blob} HTML blob
 */
export function createPDFHTML(title, content) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #333; }
        .tweet, .message {
            border-left: 3px solid #1DA1F2;
            padding: 10px;
            margin: 10px 0;
            background: #f9f9f9;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
        }
        img {
            max-width: 100%;
            height: auto;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${content}
</body>
</html>`;
    
    return new Blob([html], { type: 'text/html' });
}

