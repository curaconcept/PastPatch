/**
 * Base Processor Class
 * All platform-specific processors should extend this class
 */
export class BaseProcessor {
    constructor(platformName) {
        this.platformName = platformName;
    }

    /**
     * Process a file
     * @param {File} file - The file to process
     * @param {Function} progressCallback - Callback for progress updates
     * @returns {Promise<Object>} Processing result
     */
    async process(file, progressCallback) {
        throw new Error('process() must be implemented by subclass');
    }

    /**
     * Update progress
     * @param {Function} callback - Progress callback
     * @param {string} message - Progress message
     * @param {number} percent - Progress percentage (0-100)
     */
    updateProgress(callback, message, percent) {
        if (callback) {
            callback({ message, percent });
        }
    }

    /**
     * Create a preview thumbnail
     * @param {Blob} blob - Image/video blob
     * @returns {Promise<string>} Data URL of thumbnail
     */
    async createThumbnail(blob) {
        // This will be implemented with actual image processing
        return URL.createObjectURL(blob);
    }
}

