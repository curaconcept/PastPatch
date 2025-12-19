import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { createPDFHTML } from '../utils/pdf.js';

/**
 * Facebook Messenger Processor
 * Handles Facebook HTML chat exports
 */
export class FacebookProcessor extends BaseProcessor {
    constructor() {
        super('Facebook');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading Facebook export...', 10);

        let htmlContent;
        const fileType = file.name.toLowerCase();
        
        // Handle ZIP exports
        if (fileType.endsWith('.zip')) {
            this.updateProgress(progressCallback, 'Extracting ZIP file...', 20);
            const zip = await ZipHandler.extract(file);
            const files = ZipHandler.listFiles(zip);
            
            // Look for HTML files
            const htmlFile = files.find(f => f.endsWith('.html') && (f.includes('message') || f.includes('chat')));
            if (!htmlFile) {
                // Try any HTML file
                const anyHtml = files.find(f => f.endsWith('.html'));
                if (!anyHtml) {
                    throw new Error('No HTML file found in export');
                }
                const htmlBlob = await ZipHandler.getFile(zip, anyHtml);
                htmlContent = await htmlBlob.text();
            } else {
                const htmlBlob = await ZipHandler.getFile(zip, htmlFile);
                htmlContent = await htmlBlob.text();
            }
        } else if (fileType.endsWith('.html')) {
            // Direct HTML file
            htmlContent = await file.text();
        } else {
            throw new Error('Unsupported file format. Please upload an HTML file or ZIP containing HTML.');
        }

        this.updateProgress(progressCallback, 'Parsing messages...', 40);

        // Parse HTML and extract messages
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Facebook exports have messages in divs with specific classes
        // Structure varies, so we'll look for common patterns
        const messages = this.extractMessages(doc);

        this.updateProgress(progressCallback, 'Organizing conversations...', 60);

        // Group by thread/conversation
        const conversations = this.organizeConversations(messages);

        this.updateProgress(progressCallback, 'Generating output...', 80);

        // Generate cleaned HTML
        const cleanedHTML = this.generateHTML(conversations);
        const htmlBlob = createPDFHTML('Facebook Messenger Export', cleanedHTML);

        // Create preview
        const previews = [{
            filename: 'conversations.html',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwODRmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmFjZWJvb2s8L3RleHQ+PC9zdmc+'
        }];

        return {
            success: true,
            processed: messages.length,
            conversations: conversations.length,
            files: {
                'conversations.html': htmlBlob
            },
            previews: previews
        };
    }

    extractMessages(doc) {
        const messages = [];
        
        // Try multiple selectors for Facebook message structure
        const selectors = [
            'div[class*="message"]',
            'div[class*="thread"]',
            'div[class*="chat"]',
            '.message',
            '.thread'
        ];

        let messageElements = [];
        for (const selector of selectors) {
            messageElements = Array.from(doc.querySelectorAll(selector));
            if (messageElements.length > 0) break;
        }

        // If no specific structure found, look for any divs with text
        if (messageElements.length === 0) {
            messageElements = Array.from(doc.querySelectorAll('div')).filter(div => {
                const text = div.textContent.trim();
                return text.length > 10 && text.length < 1000;
            });
        }

        messageElements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (!text || text.length < 1) return;

            // Try to extract metadata
            const message = {
                id: index,
                text: text,
                html: element.innerHTML,
                timestamp: this.extractTimestamp(element),
                sender: this.extractSender(element),
                attachments: this.extractAttachments(element)
            };

            messages.push(message);
        });

        return messages;
    }

    extractTimestamp(element) {
        // Look for date/time in various formats
        const text = element.textContent;
        const datePatterns = [
            /(\d{1,2}\/\d{1,2}\/\d{4},?\s+\d{1,2}:\d{2})/,
            /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/,
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/
        ];

        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) return match[1];
        }

        // Look for time elements
        const timeEl = element.querySelector('time');
        if (timeEl) return timeEl.getAttribute('datetime') || timeEl.textContent;

        return null;
    }

    extractSender(element) {
        // Look for sender name in various structures
        const senderSelectors = [
            '.sender',
            '[class*="sender"]',
            '[class*="user"]',
            'strong',
            'b'
        ];

        for (const selector of senderSelectors) {
            const senderEl = element.querySelector(selector);
            if (senderEl) {
                const name = senderEl.textContent.trim();
                if (name && name.length < 50) return name;
            }
        }

        return 'Unknown';
    }

    extractAttachments(element) {
        const attachments = [];
        const images = element.querySelectorAll('img');
        const links = element.querySelectorAll('a[href*="facebook.com"]');

        images.forEach(img => {
            attachments.push({
                type: 'image',
                url: img.src || img.getAttribute('data-src'),
                alt: img.alt
            });
        });

        links.forEach(link => {
            const href = link.href;
            if (href && !href.includes('facebook.com/messages')) {
                attachments.push({
                    type: 'link',
                    url: href,
                    text: link.textContent
                });
            }
        });

        return attachments;
    }

    organizeConversations(messages) {
        // Group messages by sender or thread
        const conversations = [];
        let currentConversation = {
            id: 0,
            participants: new Set(),
            messages: []
        };

        messages.forEach(msg => {
            if (msg.sender) {
                currentConversation.participants.add(msg.sender);
            }
            currentConversation.messages.push(msg);

            // Start new conversation if there's a large time gap
            if (currentConversation.messages.length > 0) {
                const lastMsg = currentConversation.messages[currentConversation.messages.length - 1];
                if (msg.timestamp && lastMsg.timestamp) {
                    const timeDiff = Math.abs(new Date(msg.timestamp) - new Date(lastMsg.timestamp));
                    if (timeDiff > 24 * 60 * 60 * 1000) { // 24 hours
                        conversations.push({
                            ...currentConversation,
                            participants: Array.from(currentConversation.participants)
                        });
                        currentConversation = {
                            id: conversations.length,
                            participants: new Set(),
                            messages: []
                        };
                    }
                }
            }
        });

        if (currentConversation.messages.length > 0) {
            conversations.push({
                ...currentConversation,
                participants: Array.from(currentConversation.participants)
            });
        }

        return conversations;
    }

    generateHTML(conversations) {
        let html = `<p>Found ${conversations.length} conversation(s) with ${conversations.reduce((sum, c) => sum + c.messages.length, 0)} total messages.</p>`;

        conversations.forEach((conv, index) => {
            html += `<div class="conversation" style="margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">`;
            html += `<h2>Conversation ${index + 1}</h2>`;
            html += `<p><strong>Participants:</strong> ${conv.participants.join(', ')}</p>`;

            conv.messages.forEach(msg => {
                html += `<div class="message" style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">`;
                html += `<div class="message-header" style="font-weight: bold; margin-bottom: 5px;">${this.escapeHtml(msg.sender)}</div>`;
                if (msg.timestamp) {
                    html += `<div class="timestamp" style="font-size: 0.9em; color: #666;">${this.escapeHtml(msg.timestamp)}</div>`;
                }
                html += `<div class="message-content" style="margin-top: 10px;">${msg.html || this.escapeHtml(msg.text)}</div>`;
                
                if (msg.attachments && msg.attachments.length > 0) {
                    msg.attachments.forEach(att => {
                        if (att.type === 'image' && att.url) {
                            html += `<img src="${att.url}" alt="${att.alt || 'Attachment'}" style="max-width: 100%; margin: 10px 0;">`;
                        } else if (att.type === 'link') {
                            html += `<a href="${att.url}" target="_blank">${this.escapeHtml(att.text || att.url)}</a>`;
                        }
                    });
                }
                
                html += `</div>`;
            });

            html += `</div>`;
        });

        return html;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export async function process(file, progressCallback) {
    const processor = new FacebookProcessor();
    return await processor.process(file, progressCallback);
}
