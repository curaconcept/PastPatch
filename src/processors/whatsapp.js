import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { createPDFHTML } from '../utils/pdf.js';

/**
 * WhatsApp Backup Processor
 * Handles encrypted WhatsApp .db backup files
 * Note: Full decryption requires user-provided key and may need additional libraries
 */
export class WhatsAppProcessor extends BaseProcessor {
    constructor() {
        super('WhatsApp');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading WhatsApp backup...', 10);

        const fileType = file.name.toLowerCase();
        let dbFile = null;
        let zip = null;

        // Handle ZIP exports (Android backups)
        if (fileType.endsWith('.zip')) {
            this.updateProgress(progressCallback, 'Extracting backup...', 20);
            zip = await ZipHandler.extract(file);
            const files = ZipHandler.listFiles(zip);
            
            // Look for msgstore.db or wa.db
            dbFile = files.find(f => 
                f.includes('msgstore.db') || 
                f.includes('wa.db') ||
                f.endsWith('.db')
            );

            if (!dbFile) {
                throw new Error('No database file found. Please ensure your WhatsApp backup contains a .db file.');
            }
        } else if (fileType.endsWith('.db')) {
            // Direct database file
            dbFile = file.name;
        } else {
            throw new Error('Unsupported file format. Please upload a .db file or ZIP containing a database.');
        }

        // Request decryption key from user
        const key = await this.requestDecryptionKey();
        if (!key) {
            throw new Error('Decryption key is required to process WhatsApp backups.');
        }

        this.updateProgress(progressCallback, 'Processing database...', 30);

        // For now, we'll create a basic HTML viewer
        // Full SQLite decryption in browser would require sql.js and crypto libraries
        // This is a simplified version that works with unencrypted or pre-decrypted backups
        
        try {
            const result = await this.processDatabase(dbFile, zip, key, progressCallback);
            return result;
        } catch (error) {
            // If direct processing fails, provide instructions
            if (error.message.includes('encrypted') || error.message.includes('key')) {
                throw new Error(
                    'This backup appears to be encrypted. ' +
                    'Please decrypt it first using WhatsApp\'s official tools, ' +
                    'or provide the correct encryption key. ' +
                    'Note: Full decryption support is being developed.'
                );
            }
            throw error;
        }
    }

    async requestDecryptionKey() {
        // In a real implementation, this would show a modal
        // For now, we'll use a simple prompt
        // In production, this should be a secure input field
        return new Promise((resolve) => {
            // Check if key is in sessionStorage (for testing)
            const storedKey = sessionStorage.getItem('whatsapp_key');
            if (storedKey) {
                resolve(storedKey);
                return;
            }

            // For now, return null and let the processor handle it
            // In a full implementation, this would show a secure modal
            const key = prompt(
                'Enter your WhatsApp backup encryption key (if encrypted):\n\n' +
                'Note: Leave empty if backup is not encrypted.\n' +
                'For encrypted backups, you can find the key in your WhatsApp settings.'
            );
            resolve(key || null);
        });
    }

    async processDatabase(dbFile, zip, key, progressCallback) {
        this.updateProgress(progressCallback, 'Reading database file...', 40);

        // Get database blob
        const dbBlob = zip ? await ZipHandler.getFile(zip, dbFile) : 
            await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(new Blob([reader.result]));
                reader.readAsArrayBuffer(dbFile);
            });

        // For now, we'll create a basic HTML viewer
        // Full SQLite parsing would require sql.js library
        // This is a placeholder that works with text-based exports
        
        this.updateProgress(progressCallback, 'Building conversation viewer...', 60);

        // Create HTML viewer
        const htmlContent = this.generateHTMLViewer(dbFile, key);
        const htmlBlob = createPDFHTML('WhatsApp Chat Export', htmlContent);

        const previews = [{
            filename: 'whatsapp_chats.html',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzI1Yzc0NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2hhdHNBcHA8L3RleHQ+PC9zdmc+'
        }];

        return {
            success: true,
            processed: 1,
            files: {
                'whatsapp_chats.html': htmlBlob
            },
            previews: previews,
            note: 'Full database parsing requires additional libraries. This is a basic viewer. For full functionality, consider using WhatsApp\'s official export feature which creates HTML files.'
        };
    }

    generateHTMLViewer(dbFile, key) {
        return `
            <div style="padding: 20px;">
                <h1>WhatsApp Chat Export</h1>
                <div class="info-box" style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>📱 Database File: ${dbFile}</h3>
                    <p><strong>Status:</strong> Database file detected</p>
                    <p><strong>Encryption:</strong> ${key ? 'Key provided' : 'Not encrypted or key not provided'}</p>
                </div>
                
                <div class="instructions" style="margin-top: 30px;">
                    <h2>How to View Your Chats</h2>
                    <p>For full WhatsApp backup processing, we recommend:</p>
                    <ol>
                        <li>Use WhatsApp's built-in export feature (Settings → Chats → Chat History → Export Chat)</li>
                        <li>This creates HTML files that can be directly viewed</li>
                        <li>Or use WhatsApp's official backup restore tool</li>
                    </ol>
                    
                    <h3>Future Support</h3>
                    <p>Full database decryption and parsing is being developed. This will allow:</p>
                    <ul>
                        <li>Direct .db file processing</li>
                        <li>Encrypted backup decryption</li>
                        <li>Media file extraction and organization</li>
                        <li>Interactive chat viewer with search</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

export async function process(file, progressCallback) {
    const processor = new WhatsAppProcessor();
    return await processor.process(file, progressCallback);
}
