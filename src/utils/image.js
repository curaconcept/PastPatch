/**
 * Image processing utilities using Canvas API
 */

/**
 * Load an image from a blob
 * @param {Blob} blob - Image blob
 * @returns {Promise<HTMLImageElement>} Image element
 */
export function loadImage(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
}

/**
 * Draw image to canvas
 * @param {HTMLImageElement} img - Image element
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function drawImageToCanvas(img, canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

/**
 * Draw text overlay on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} text - Text to draw
 * @param {Object} options - Text options (x, y, fontSize, color, etc.)
 */
export function drawTextOverlay(canvas, text, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        x = 10,
        y = 30,
        fontSize = 24,
        fontFamily = 'Arial',
        color = '#FFFFFF',
        textAlign = 'left',
        maxWidth = null
    } = options;

    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    
    if (maxWidth) {
        // Handle text wrapping
        const words = text.split(' ');
        let line = '';
        let lineY = y;
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, x, lineY);
                line = word + ' ';
                lineY += fontSize + 5;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, lineY);
    } else {
        ctx.fillText(text, x, y);
    }
    ctx.restore();
}

/**
 * Draw image overlay on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {HTMLImageElement} overlayImg - Overlay image
 * @param {Object} options - Position and size options
 */
export async function drawImageOverlay(canvas, overlayImg, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        x = 0,
        y = 0,
        width = overlayImg.width,
        height = overlayImg.height,
        opacity = 1.0
    } = options;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(overlayImg, x, y, width, height);
    ctx.restore();
}

/**
 * Convert canvas to blob
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} type - MIME type (default: 'image/png')
 * @param {number} quality - Quality 0-1 (for JPEG)
 * @returns {Promise<Blob>} Image blob
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1.0) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, type, quality);
    });
}

/**
 * Create thumbnail from image
 * @param {Blob} imageBlob - Original image
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} Thumbnail blob
 */
export async function createThumbnail(imageBlob, maxWidth = 200, maxHeight = 200) {
    const img = await loadImage(imageBlob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate thumbnail size maintaining aspect ratio
    let width = img.width;
    let height = img.height;
    
    if (width > height) {
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    
    return await canvasToBlob(canvas, 'image/jpeg', 0.8);
}

