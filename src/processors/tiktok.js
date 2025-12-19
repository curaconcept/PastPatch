import { BaseProcessor } from './base.js';

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

        // TODO: Implement TikTok processing
        // 1. Parse TikTok export structure
        // 2. Extract video metadata
        // 3. Restore descriptions and timestamps
        // 4. Rebuild proper file organization

        throw new Error('TikTok processor not yet implemented');
    }
}

export async function process(file, progressCallback) {
    const processor = new TikTokProcessor();
    return await processor.process(file, progressCallback);
}

