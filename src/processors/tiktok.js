import { BaseProcessor } from './base.js';
import { ZipHandler } from '../utils/zip.js';
import { setCaptureDate } from '../utils/metadata.js';

/**
 * TikTok Archive Processor
 * Handles TikTok video downloads and metadata
 */
export class TikTokProcessor extends BaseProcessor {
    constructor() {
        super('TikTok');
    }

    async process(file, progressCallback) {
        this.updateProgress(progressCallback, 'Reading TikTok archive...', 10);

        const fileType = file.name.toLowerCase();
        let zip = null;
        let files = [];

        if (fileType.endsWith('.zip')) {
            this.updateProgress(progressCallback, 'Extracting ZIP file...', 20);
            zip = await ZipHandler.extract(file);
            files = ZipHandler.listFiles(zip);
        } else {
            // Single video file
            files = [file.name];
        }

        this.updateProgress(progressCallback, 'Processing videos...', 30);

        // Find video files and metadata
        const videoFiles = files.filter(f => 
            f.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/)
        );

        if (videoFiles.length === 0) {
            throw new Error('No video files found in archive.');
        }

        const processedFiles = {};
        const previews = [];
        let processed = 0;

        for (const videoFile of videoFiles) {
            try {
                const videoBlob = zip ? await ZipHandler.getFile(zip, videoFile) : file;
                
                // Look for metadata (JSON files with same name)
                const metadataFile = videoFile.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.json');
                let metadata = null;
                
                if (zip && files.includes(metadataFile)) {
                    try {
                        const metadataBlob = await ZipHandler.getFile(zip, metadataFile);
                        const metadataText = await metadataBlob.text();
                        metadata = JSON.parse(metadataText);
                    } catch (e) {
                        // No metadata file, continue
                    }
                }

                const result = await this.processVideo(videoBlob, videoFile, metadata);
                if (result) {
                    processedFiles[result.filename] = result.blob;
                    previews.push({
                        filename: result.filename,
                        thumbnail: result.thumbnail
                    });
                    processed++;
                }
            } catch (error) {
                console.warn(`Failed to process ${videoFile}:`, error);
            }
        }

        this.updateProgress(progressCallback, 'Creating output...', 90);

        if (Object.keys(processedFiles).length > 1 || zip) {
            // Multiple files, create ZIP
            const outputZip = await ZipHandler.create(processedFiles);
            const outputBlob = new Blob([outputZip], { type: 'application/zip' });
            
            return {
                success: true,
                processed: processed,
                total: videoFiles.length,
                files: {
                    'tiktok_restored.zip': outputBlob
                },
                previews: previews.slice(0, 10)
            };
        } else {
            // Single file
            return {
                success: true,
                processed: 1,
                total: 1,
                files: {
                    [processedFiles[Object.keys(processedFiles)[0]].filename || 'tiktok_video.mp4']: 
                        processedFiles[Object.keys(processedFiles)[0]]
                },
                previews: previews
            };
        }
    }

    async processVideo(videoBlob, originalPath, metadata) {
        // For now, we'll restore metadata in filename and description
        // Full video processing would require FFmpeg.wasm
        
        const timestamp = metadata?.createTime || metadata?.created_at || metadata?.timestamp;
        const date = timestamp ? new Date(timestamp * 1000) : new Date();
        const dateStr = date.toISOString().split('T')[0];
        
        const description = metadata?.desc || metadata?.description || metadata?.caption || '';
        const videoId = metadata?.id || metadata?.aweme_id || 'video';
        
        // Generate filename
        const ext = originalPath.split('.').pop();
        const safeDesc = description.substring(0, 50).replace(/[^a-z0-9]/gi, '_');
        const filename = `tiktok_${dateStr}_${videoId}${safeDesc ? '_' + safeDesc : ''}.${ext}`;

        // Try to restore EXIF date if possible (limited for videos)
        let finalBlob = videoBlob;
        try {
            // Note: Video EXIF is more complex, this is a placeholder
            // Would need FFmpeg.wasm for full video metadata restoration
        } catch (e) {
            // Continue with original blob
        }

        return {
            filename: filename,
            blob: finalBlob,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGlrVG9rPC90ZXh0Pjwvc3ZnPg=='
        };
    }
}

export async function process(file, progressCallback) {
    const processor = new TikTokProcessor();
    return await processor.process(file, progressCallback);
}
