import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { loadImage, drawImageToCanvas, drawTextOverlay, drawImageOverlay, canvasToBlob, createThumbnail } from '../utils/image.js';
import { setCaptureDate } from '../utils/metadata.js';

/**
 * Snapchat Memories Processor
 * Handles Snapchat export files (memories_history.json + media files)
 */
export class SnapchatProcessor extends BaseProcessor {
    constructor() {
        super('Snapchat');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading Snapchat export...', 10);

        if (!file.name.toLowerCase().endsWith('.zip')) {
            throw new Error('Snapchat exports must be ZIP files. Please upload your Snapchat data export ZIP.');
        }

        this.updateProgress(progressCallback, 'Extracting ZIP file...', 20);
        const zip = await ZipHandler.extract(file);
        const files = ZipHandler.listFiles(zip);

        // Find memories_history.json
        const jsonFile = files.find(f => f.includes('memories_history.json') || f.endsWith('memories_history.json'));
        if (!jsonFile) {
            throw new Error('memories_history.json not found. Is this a valid Snapchat export?');
        }

        this.updateProgress(progressCallback, 'Parsing memories data...', 30);
        const jsonBlob = await ZipHandler.getFile(zip, jsonFile);
        const jsonText = await jsonBlob.text();
        const memoriesData = JSON.parse(jsonText);

        // Get memories array - handle different Snapchat export formats
        let memories = [];
        if (Array.isArray(memoriesData)) {
            memories = memoriesData;
        } else if (memoriesData.Memories && Array.isArray(memoriesData.Memories)) {
            memories = memoriesData.Memories;
        } else if (memoriesData.memories && Array.isArray(memoriesData.memories)) {
            memories = memoriesData.memories;
        } else if (memoriesData.SavedMedia && Array.isArray(memoriesData.SavedMedia)) {
            memories = memoriesData.SavedMedia;
        } else if (typeof memoriesData === 'object') {
            // Try to find any array of memory objects
            for (const key in memoriesData) {
                if (Array.isArray(memoriesData[key]) && memoriesData[key].length > 0) {
                    const firstItem = memoriesData[key][0];
                    if (firstItem && (firstItem.MemoryKey || firstItem.id || firstItem.media_id)) {
                        memories = memoriesData[key];
                        break;
                    }
                }
            }
        }
        
        if (memories.length === 0) {
            // Provide helpful error message
            const keys = Object.keys(memoriesData).slice(0, 5).join(', ');
            throw new Error(`No memories found in export file. Found keys: ${keys || 'none'}. Please ensure this is a valid Snapchat data export with memories_history.json.`);
        }

        this.updateProgress(progressCallback, `Processing ${memories.length} memories...`, 40);

        const processedFiles = {};
        const previews = [];
        let processed = 0;

        for (let i = 0; i < memories.length; i++) {
            const memory = memories[i];
            try {
                // Update progress
                const progressPercent = 40 + ((i / memories.length) * 50);
                this.updateProgress(progressCallback, `Processing memory ${i + 1} of ${memories.length}...`, progressPercent);
                
                const result = await this.processMemory(memory, zip, files);
                if (result) {
                    processedFiles[result.filename] = result.blob;
                    if (result.thumbnail) {
                        previews.push({
                            filename: result.filename,
                            thumbnail: result.thumbnail
                        });
                    }
                    processed++;
                }
            } catch (error) {
                console.warn(`Failed to process memory ${memory.MemoryKey || memory.id || i}:`, error);
                // Continue processing other memories
            }
        }

        this.updateProgress(progressCallback, 'Creating output ZIP...', 90);

        // Create output ZIP
        const outputZip = await ZipHandler.create(processedFiles);
        const outputBlob = new Blob([outputZip], { type: 'application/zip' });

        return {
            success: true,
            processed: processed,
            total: memories.length,
            files: {
                'snapchat_restored.zip': outputBlob
            },
            previews: previews.slice(0, 10) // Limit previews
        };
    }

    async processMemory(memory, zip, files) {
        const memoryKey = memory.MemoryKey || memory.id || memory.key;
        if (!memoryKey) {
            console.warn('Memory missing key:', memory);
            return null;
        }

        // Find media files for this memory
        const mediaFiles = this.findMediaFiles(memoryKey, files);
        if (mediaFiles.length === 0) {
            // Try alternative: look for media_path or similar fields
            const mediaPath = memory.MediaPath || memory.media_path || memory.media_url;
            if (mediaPath) {
                const pathParts = mediaPath.split('/');
                const filename = pathParts[pathParts.length - 1];
                const foundFile = files.find(f => f.includes(filename) || f.endsWith(filename));
                if (foundFile) {
                    const mediaBlob = await ZipHandler.getFile(zip, foundFile);
                    const isImage = foundFile.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                    if (isImage) {
                        return await this.processImage(memory, mediaBlob, foundFile);
                    } else {
                        return await this.processVideo(memory, mediaBlob, foundFile);
                    }
                }
            }
            return null;
        }

        // Get the main media file
        const mainMedia = mediaFiles[0];
        try {
            const mediaBlob = await ZipHandler.getFile(zip, mainMedia);

            // Determine if it's an image or video
            const isImage = mainMedia.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
            
            if (isImage) {
                return await this.processImage(memory, mediaBlob, mainMedia);
            } else {
                // For videos, we'll just restore metadata for now
                return await this.processVideo(memory, mediaBlob, mainMedia);
            }
        } catch (error) {
            console.warn(`Failed to get media file ${mainMedia}:`, error);
            return null;
        }
    }

    findMediaFiles(memoryKey, files) {
        if (!memoryKey) return [];
        
        const keyLower = memoryKey.toString().toLowerCase();
        const keyVariations = [
            keyLower,
            keyLower.replace(/-/g, '_'),
            keyLower.replace(/_/g, '-'),
            keyLower.replace(/[^a-z0-9]/g, '')
        ];
        
        // First try exact matches
        let matches = files.filter(f => {
            const filename = f.toLowerCase();
            return keyVariations.some(variation => filename.includes(variation));
        });
        
        // If no matches, try broader search for media files in memories folder
        if (matches.length === 0) {
            matches = files.filter(f => {
                const filename = f.toLowerCase();
                return (filename.match(/\.(jpg|jpeg|png|gif|mp4|mov|webp)$/) && 
                       (filename.includes('memories') || filename.includes('snap')));
            });
        }
        
        return matches;
    }

    async processImage(memory, imageBlob, originalPath) {
        const memoryKey = memory.MemoryKey || memory.id || memory.key || 'memory';
        
        try {
            const img = await loadImage(imageBlob);
            const canvas = document.createElement('canvas');
            drawImageToCanvas(img, canvas);

            // Apply overlays if present
            if (memory.Overlay) {
                await this.applyOverlay(canvas, memory.Overlay);
            }

            // Apply caption if present
            if (memory.Caption && memory.Caption.Text) {
                const captionPos = memory.Caption.Position || { x: 10, y: canvas.height - 50 };
                drawTextOverlay(canvas, memory.Caption.Text, {
                    x: captionPos.x || 10,
                    y: captionPos.y || canvas.height - 50,
                    fontSize: memory.Caption.FontSize || 24,
                    color: memory.Caption.Color || '#FFFFFF'
                });
            }

            // Convert back to blob
            const processedBlob = await canvasToBlob(canvas, 'image/jpeg', 0.95);

            // Restore EXIF date if available
            let finalBlob = processedBlob;
            if (memory.Date) {
                const date = new Date(memory.Date);
                if (!isNaN(date.getTime())) {
                    try {
                        finalBlob = await setCaptureDate(processedBlob, date);
                    } catch (e) {
                        console.warn('Failed to set EXIF date, using original:', e);
                    }
                }
            }

            // Create thumbnail
            const thumbnail = await createThumbnail(finalBlob);
            const thumbnailUrl = URL.createObjectURL(thumbnail);

            // Generate filename
            const dateStr = memory.Date ? new Date(memory.Date).toISOString().split('T')[0] : 'unknown';
            const safeKey = memoryKey.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
            const filename = `snap_${dateStr}_${safeKey}.jpg`;

            return {
                filename: filename,
                blob: finalBlob,
                thumbnail: thumbnailUrl
            };
        } catch (error) {
            console.error('Error processing image:', error);
            // Return original if processing fails
            const dateStr = memory.Date ? new Date(memory.Date).toISOString().split('T')[0] : 'unknown';
            const safeKey = memoryKey.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
            return {
                filename: `snap_${dateStr}_${safeKey}.jpg`,
                blob: imageBlob,
                thumbnail: URL.createObjectURL(imageBlob)
            };
        }
    }

    async processVideo(memory, videoBlob, originalPath) {
        // For videos, we'll restore metadata but not process frames (would need FFmpeg.wasm)
        // Just restore the date in filename and return as-is for now
        
        const dateStr = memory.Date ? new Date(memory.Date).toISOString().split('T')[0] : 'unknown';
        const ext = originalPath.split('.').pop();
        const filename = `snap_${dateStr}_${memory.MemoryKey || 'memory'}.${ext}`;

        return {
            filename: filename,
            blob: videoBlob,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmlkZW88L3RleHQ+PC9zdmc+'
        };
    }

    async applyOverlay(canvas, overlayData) {
        // Overlay can be image data or path reference
        // For now, we'll handle simple cases
        if (overlayData && overlayData.ImageData) {
            try {
                // If overlay is base64 encoded
                const overlayImg = new Image();
                overlayImg.src = `data:image/png;base64,${overlayData.ImageData}`;
                await new Promise((resolve, reject) => {
                    overlayImg.onload = resolve;
                    overlayImg.onerror = reject;
                });
                
                const overlayOptions = {
                    x: overlayData.X || 0,
                    y: overlayData.Y || 0,
                    opacity: overlayData.Opacity || 1.0
                };
                
                await drawImageOverlay(canvas, overlayImg, overlayOptions);
            } catch (error) {
                console.warn('Failed to apply overlay:', error);
            }
        }
    }
}

// Export default processor function for dynamic import
export async function process(file, progressCallback) {
    const processor = new SnapchatProcessor();
    return await processor.process(file, progressCallback);
}
