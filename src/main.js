import { Catalog } from './ui/catalog.js';
import { UploadHandler } from './ui/upload.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const catalog = new Catalog();
    const uploadHandler = new UploadHandler();
    
    catalog.init();
    uploadHandler.init();
});

