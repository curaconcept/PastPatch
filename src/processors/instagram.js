import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { loadImage, drawImageToCanvas, drawTextOverlay, canvasToBlob, createThumbnail } from '../utils/image.js';
import { setCaptureDate } from '../utils/metadata.js';

/**
 * Instagram Stories Processor
 * Handles Instagram export files
 */
export class InstagramProcessor extends BaseProcessor {
    constructor() {
        super('Instagram');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading Instagram export...', 10);

        if (!file.name.toLowerCase().endsWith('.zip')) {
            throw new Error('Instagram exports must be ZIP files. Please upload your Instagram data export ZIP.');
        }

        this.updateProgress(progressCallback, 'Extracting ZIP file...', 20);
        const zip = await ZipHandler.extract(file);
        const files = ZipHandler.listFiles(zip);

        // Find JSON files (Instagram exports have various JSON structures)
        const jsonFiles = files.filter(f => f.endsWith('.json') && (
            f.includes('stories') || 
            f.includes('media') || 
            f.includes('content') ||
            f.includes('posts')
        ));

        if (jsonFiles.length === 0) {
            throw new Error('No Instagram data JSON files found. Is this a valid Instagram export?');
        }

        this.updateProgress(progressCallback, 'Parsing Instagram data...', 30);

        const allMedia = [];
        
        for (const jsonFile of jsonFiles) {
            try {
                const jsonBlob = await ZipHandler.getFile(zip, jsonFile);
                const jsonText = await jsonBlob.text();
                const data = JSON.parse(jsonText);
                
                // Extract media items from various Instagram export structures
                const media = this.extractMedia(data, jsonFile);
                allMedia.push(...media);
            } catch (error) {
                console.warn(`Failed to parse ${jsonFile}:`, error);
            }
        }

        if (allMedia.length === 0) {
            throw new Error('No media items found in export.');
        }

        this.updateProgress(progressCallback, `Processing ${allMedia.length} media items...`, 40);

        const processedFiles = {};
        const previews = [];
        let processed = 0;

        for (const mediaItem of allMedia) {
            try {
                const result = await this.processMediaItem(mediaItem, zip, files, progressCallback, processed, allMedia.length);
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
                console.warn(`Failed to process media item:`, error);
            }
        }

        this.updateProgress(progressCallback, 'Creating output ZIP...', 90);

        const outputZip = await ZipHandler.create(processedFiles);
        const outputBlob = new Blob([outputZip], { type: 'application/zip' });

        return {
            success: true,
            processed: processed,
            total: allMedia.length,
            files: {
                'instagram_restored.zip': outputBlob
            },
            previews: previews.slice(0, 10)
        };
    }

    extractMedia(data, sourceFile) {
        const media = [];
        
        // Handle various Instagram export formats
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (this.isMediaItem(item)) {
                    media.push({ ...item, sourceFile });
                }
            });
        } else if (data.media && Array.isArray(data.media)) {
            data.media.forEach(item => media.push({ ...item, sourceFile }));
        } else if (data.stories && Array.isArray(data.stories)) {
            data.stories.forEach(item => media.push({ ...item, sourceFile }));
        } else if (data.posts && Array.isArray(data.posts)) {
            data.posts.forEach(item => media.push({ ...item, sourceFile }));
        } else if (this.isMediaItem(data)) {
            media.push({ ...data, sourceFile });
        }

        return media;
    }

    isMediaItem(item) {
        return item && (
            item.uri || 
            item.path || 
            item.media_path ||
            item.media_url ||
            item.photo_media ||
            item.video_media
        );
    }

    async processMediaItem(mediaItem, zip, files, progressCallback, current, total) {
        // Find the actual media file
        const mediaPath = mediaItem.uri || mediaItem.path || mediaItem.media_path || mediaItem.media_url;
        if (!mediaPath) return null;

        // Find matching file in ZIP
        const fileName = mediaPath.split('/').pop() || mediaPath;
        const matchingFile = files.find(f => 
            f.includes(fileName) || 
            f.endsWith(fileName) ||
            f.includes(fileName.split('.')[0])
        );

        if (!matchingFile) {
            // Try to find by media key or ID
            const mediaKey = mediaItem.media_key || mediaItem.id;
            if (mediaKey) {
                const keyFile = files.find(f => f.includes(mediaKey));
                if (keyFile) {
                    return await this.processFile(keyFile, mediaItem, zip);
                }
            }
            return null;
        }

        return await this.processFile(matchingFile, mediaItem, zip);
    }

    async processFile(filePath, metadata, zip) {
        const fileBlob = await ZipHandler.getFile(zip, filePath);
        const isImage = filePath.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

        if (isImage) {
            return await this.processImage(metadata, fileBlob, filePath);
        } else {
            return await this.processVideo(metadata, fileBlob, filePath);
        }
    }

    async processImage(metadata, imageBlob, originalPath) {
        const img = await loadImage(imageBlob);
        const canvas = document.createElement('canvas');
        drawImageToCanvas(img, canvas);

        // Apply stickers/overlays if present
        if (metadata.stickers || metadata.story_stickers) {
            await this.applyStickers(canvas, metadata.stickers || metadata.story_stickers);
        }

        // Apply location tag if present
        if (metadata.location) {
            const locationText = typeof metadata.location === 'string' 
                ? metadata.location 
                : metadata.location.name || metadata.location.title || '';
            if (locationText) {
                drawTextOverlay(canvas, `📍 ${locationText}`, {
                    x: 10,
                    y: canvas.height - 30,
                    fontSize: 16,
                    color: '#FFFFFF'
                });
            }
        }

        // Convert to blob
        const processedBlob = await canvasToBlob(canvas, 'image/jpeg', 0.95);

        // Restore timestamp
        let finalBlob = processedBlob;
        const timestamp = metadata.taken_at || metadata.creation_timestamp || metadata.timestamp;
        if (timestamp) {
            const date = new Date(timestamp * 1000); // Instagram uses Unix timestamp
            if (!isNaN(date.getTime())) {
                finalBlob = await setCaptureDate(processedBlob, date);
            }
        }

        // Create thumbnail
        const thumbnail = await createThumbnail(finalBlob);
        const thumbnailUrl = URL.createObjectURL(thumbnail);

        // Generate filename
        const dateStr = timestamp ? new Date(timestamp * 1000).toISOString().split('T')[0] : 'unknown';
        const filename = `instagram_${dateStr}_${metadata.media_id || 'media'}.jpg`;

        return {
            filename: filename,
            blob: finalBlob,
            thumbnail: thumbnailUrl
        };
    }

    async processVideo(metadata, videoBlob, originalPath) {
        // Videos are more complex - would need FFmpeg.wasm for full processing
        // For now, just restore metadata in filename
        
        const timestamp = metadata.taken_at || metadata.creation_timestamp || metadata.timestamp;
        const dateStr = timestamp ? new Date(timestamp * 1000).toISOString().split('T')[0] : 'unknown';
        const ext = originalPath.split('.').pop();
        const filename = `instagram_${dateStr}_${metadata.media_id || 'media'}.${ext}`;

        return {
            filename: filename,
            blob: videoBlob,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmlkZW88L3RleHQ+PC9zdmc+'
        };
    }

    async applyStickers(canvas, stickers) {
        if (!Array.isArray(stickers)) return;

        for (const sticker of stickers) {
            if (sticker.image_url || sticker.uri) {
                try {
                    const stickerImg = new Image();
                    stickerImg.crossOrigin = 'anonymous';
                    stickerImg.src = sticker.image_url || sticker.uri;
                    
                    await new Promise((resolve, reject) => {
                        stickerImg.onload = resolve;
                        stickerImg.onerror = reject;
                        setTimeout(reject, 5000); // Timeout
                    });

                    const ctx = canvas.getContext('2d');
                    const x = sticker.x || sticker.position?.x || 0;
                    const y = sticker.y || sticker.position?.y || 0;
                    const width = sticker.width || stickerImg.width;
                    const height = sticker.height || stickerImg.height;

                    ctx.drawImage(stickerImg, x, y, width, height);
                } catch (error) {
                    console.warn('Failed to apply sticker:', error);
                }
            }
        }
    }
}

export async function process(file, progressCallback) {
    const processor = new InstagramProcessor();
    return await processor.process(file, progressCallback);
}
