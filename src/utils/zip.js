/**
 * ZIP file utilities
 * Handles extraction and manipulation of ZIP archives
 */
import JSZip from 'jszip';

export class ZipHandler {
    /**
     * Extract a ZIP file
     * @param {File|Blob} file - ZIP file to extract
     * @returns {Promise<JSZip>} Extracted ZIP object
     */
    static async extract(file) {
        const zip = new JSZip();
        return await zip.loadAsync(file);
    }

    /**
     * Get file from ZIP by path
     * @param {JSZip} zip - ZIP object
     * @param {string} path - File path in ZIP
     * @returns {Promise<Blob>} File blob
     */
    static async getFile(zip, path) {
        const file = zip.file(path);
        if (!file) {
            throw new Error(`File not found in ZIP: ${path}`);
        }
        return await file.async('blob');
    }

    /**
     * List all files in ZIP
     * @param {JSZip} zip - ZIP object
     * @returns {Array<string>} Array of file paths
     */
    static listFiles(zip) {
        const files = [];
        zip.forEach((relativePath) => {
            files.push(relativePath);
        });
        return files;
    }

    /**
     * Create a new ZIP file
     * @param {Object} files - Object mapping paths to file data
     * @returns {Promise<Blob>} ZIP file blob
     */
    static async create(files) {
        const zip = new JSZip();
        for (const [path, data] of Object.entries(files)) {
            zip.file(path, data);
        }
        return await zip.generateAsync({ type: 'blob' });
    }
}

