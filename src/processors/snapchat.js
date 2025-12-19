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

        // Get memories array
        const memories = memoriesData.Memories || memoriesData.memories || [];
        
        if (memories.length === 0) {
            throw new Error('No memories found in export file.');
        }

        this.updateProgress(progressCallback, `Processing ${memories.length} memories...`, 40);

        const processedFiles = {};
        const previews = [];
        let processed = 0;

        for (const memory of memories) {
            try {
                const result = await this.processMemory(memory, zip, files, progressCallback, processed, memories.length);
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
                console.warn(`Failed to process memory ${memory.MemoryKey || memory.id}:`, error);
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

    async processMemory(memory, zip, files, progressCallback, current, total) {
        const memoryKey = memory.MemoryKey || memory.id || memory.key;
        if (!memoryKey) return null;

        // Find media files for this memory
        const mediaFiles = this.findMediaFiles(memoryKey, files);
        if (mediaFiles.length === 0) return null;

        // Get the main media file
        const mainMedia = mediaFiles[0];
        const mediaBlob = await ZipHandler.getFile(zip, mainMedia);

        // Determine if it's an image or video
        const isImage = mainMedia.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
        
        if (isImage) {
            return await this.processImage(memory, mediaBlob, mainMedia);
        } else {
            // For videos, we'll just restore metadata for now
            return await this.processVideo(memory, mediaBlob, mainMedia);
        }
    }

    findMediaFiles(memoryKey, files) {
        // Snapchat stores media in various locations
        // Look for files matching the memory key
        return files.filter(f => {
            const filename = f.toLowerCase();
            return filename.includes(memoryKey.toLowerCase()) ||
                   filename.includes(memoryKey.toLowerCase().replace(/-/g, '_')) ||
                   (filename.match(/\.(jpg|jpeg|png|gif|mp4|mov|webp)$/) && 
                    filename.includes('memories'));
        });
    }

    async processImage(memory, imageBlob, originalPath) {
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
                finalBlob = await setCaptureDate(processedBlob, date);
            }
        }

        // Create thumbnail
        const thumbnail = await createThumbnail(finalBlob);
        const thumbnailUrl = URL.createObjectURL(thumbnail);

        // Generate filename
        const dateStr = memory.Date ? new Date(memory.Date).toISOString().split('T')[0] : 'unknown';
        const filename = `snap_${dateStr}_${memoryKey || 'memory'}.jpg`;

        return {
            filename: filename,
            blob: finalBlob,
            thumbnail: thumbnailUrl
        };
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
