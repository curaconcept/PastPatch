import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { createPDFHTML } from '../utils/pdf.js';
import { createThumbnail } from '../utils/image.js';

/**
 * Twitter/X Thread Processor
 * Handles Twitter/X thread exports (JSON format)
 */
export class TwitterProcessor extends BaseProcessor {
    constructor() {
        super('Twitter/X');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading Twitter/X export...', 10);

        let data;
        const fileType = file.name.toLowerCase();
        
        // Handle ZIP exports
        if (fileType.endsWith('.zip')) {
            this.updateProgress(progressCallback, 'Extracting ZIP file...', 20);
            const zip = await ZipHandler.extract(file);
            const files = ZipHandler.listFiles(zip);
            
            // Look for JSON files
            const jsonFile = files.find(f => f.endsWith('.json') || f.includes('tweet') || f.includes('data'));
            if (!jsonFile) {
                throw new Error('No JSON data file found in export');
            }
            
            const jsonBlob = await ZipHandler.getFile(zip, jsonFile);
            const jsonText = await jsonBlob.text();
            data = JSON.parse(jsonText);
        } else if (fileType.endsWith('.json')) {
            // Direct JSON file
            const text = await file.text();
            data = JSON.parse(text);
        } else {
            throw new Error('Unsupported file format. Please upload a JSON file or ZIP containing JSON.');
        }

        this.updateProgress(progressCallback, 'Processing tweets...', 40);

        // Normalize data structure (Twitter exports vary)
        let tweets = [];
        if (Array.isArray(data)) {
            tweets = data;
        } else if (data.tweets && Array.isArray(data.tweets)) {
            tweets = data.tweets;
        } else if (data.data && Array.isArray(data.data)) {
            tweets = data.data;
        } else {
            throw new Error('Could not find tweet data in export file');
        }

        // Sort by date
        tweets.sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt || 0);
            const dateB = new Date(b.created_at || b.createdAt || 0);
            return dateA - dateB;
        });

        this.updateProgress(progressCallback, 'Building thread structure...', 60);

        // Build thread structure
        const threads = this.buildThreads(tweets);
        
        this.updateProgress(progressCallback, 'Generating output...', 80);

        // Generate HTML output
        const htmlContent = this.generateHTML(threads);
        const htmlBlob = createPDFHTML('Twitter/X Thread Export', htmlContent);

        // Create previews
        const previews = [];
        if (threads.length > 0) {
            previews.push({
                filename: `Thread_${threads[0].id || '1'}.html`,
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFkYTFmMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VFdpdHRlcjwvdGV4dD48L3N2Zz4='
            });
        }

        return {
            success: true,
            processed: tweets.length,
            threads: threads.length,
            files: {
                'threads.html': htmlBlob
            },
            previews: previews
        };
    }

    buildThreads(tweets) {
        const threads = [];
        const processed = new Set();

        for (const tweet of tweets) {
            if (processed.has(tweet.id_str || tweet.id)) continue;

            const thread = {
                id: tweet.id_str || tweet.id,
                tweets: [tweet],
                createdAt: tweet.created_at || tweet.createdAt
            };

            // Find replies (thread continuation)
            const inReplyTo = tweet.in_reply_to_status_id_str || tweet.inReplyToStatusId;
            if (inReplyTo) {
                // This is a reply, find the root
                const rootTweet = tweets.find(t => 
                    (t.id_str || t.id) === inReplyTo
                );
                if (rootTweet && !processed.has(rootTweet.id_str || rootTweet.id)) {
                    thread.tweets.unshift(rootTweet);
                    processed.add(rootTweet.id_str || rootTweet.id);
                }
            }

            // Find all replies to this thread
            const replies = tweets.filter(t => 
                (t.in_reply_to_status_id_str || t.inReplyToStatusId) === (tweet.id_str || tweet.id)
            );
            thread.tweets.push(...replies);
            thread.tweets.sort((a, b) => {
                const dateA = new Date(a.created_at || a.createdAt || 0);
                const dateB = new Date(b.created_at || b.createdAt || 0);
                return dateA - dateB;
            });

            threads.push(thread);
            processed.add(tweet.id_str || tweet.id);
            replies.forEach(r => processed.add(r.id_str || r.id));
        }

        return threads;
    }

    generateHTML(threads) {
        let html = '';
        
        threads.forEach((thread, index) => {
            html += `<div class="thread" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">`;
            html += `<h2>Thread ${index + 1}</h2>`;
            
            thread.tweets.forEach((tweet, tweetIndex) => {
                const text = tweet.full_text || tweet.text || '';
                const date = new Date(tweet.created_at || tweet.createdAt || Date.now());
                const dateStr = date.toLocaleString();
                
                html += `<div class="tweet">`;
                html += `<div class="tweet-content">${this.escapeHtml(text)}</div>`;
                html += `<div class="timestamp">${dateStr}</div>`;
                
                // Handle media
                if (tweet.entities && tweet.entities.media) {
                    tweet.entities.media.forEach(media => {
                        if (media.type === 'photo') {
                            html += `<img src="${media.media_url_https || media.media_url}" alt="Tweet media" style="max-width: 100%; margin: 10px 0;">`;
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
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
}

// Export default processor function for dynamic import
export async function process(file, progressCallback) {
    const processor = new TwitterProcessor();
    return await processor.process(file, progressCallback);
}
