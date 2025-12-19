/**
 * Metadata utilities
 * Handles EXIF, IPTC, and other metadata operations
 */
import EXIF from 'exif-js';
import piexif from 'piexifjs';

/**
 * Extract EXIF data from an image
 * @param {Blob} imageBlob - Image file
 * @returns {Promise<Object>} EXIF data
 */
export async function extractEXIF(imageBlob) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(imageBlob);
        EXIF.getData(url, function() {
            const exifData = EXIF.getAllTags(this);
            URL.revokeObjectURL(url);
            resolve(exifData || {});
        });
    });
}

/**
 * Set image capture date in EXIF
 * @param {Blob} imageBlob - Image file
 * @param {Date} date - Capture date
 * @returns {Promise<Blob>} Image with updated date
 */
export async function setCaptureDate(imageBlob, date) {
    try {
        const arrayBuffer = await imageBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        
        let exifObj = {};
        try {
            exifObj = piexif.load(binary);
        } catch (e) {
            // No existing EXIF, create new
            exifObj = {'0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null};
        }
        
        // Set date/time
        const dateStr = date.toISOString().replace(/[-:]/g, ':').split('.')[0];
        exifObj['0th'][piexif.ImageIFD.DateTime] = dateStr;
        exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = dateStr;
        exifObj['Exif'][piexif.ExifIFD.DateTimeDigitized] = dateStr;
        
        const exifBytes = piexif.dump(exifObj);
        const newBinary = piexif.insert(exifBytes, binary);
        
        // Convert back to blob
        const newArray = new Uint8Array(newBinary.length);
        for (let i = 0; i < newBinary.length; i++) {
            newArray[i] = newBinary.charCodeAt(i);
        }
        
        return new Blob([newArray], { type: imageBlob.type });
    } catch (error) {
        console.warn('Failed to set EXIF date:', error);
        return imageBlob; // Return original if EXIF manipulation fails
    }
}

