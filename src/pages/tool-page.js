/**
 * Individual tool page component
 */
import { UploadHandler } from '../ui/upload.js';

export class ToolPage {
    constructor(toolId, toolInfo) {
        this.toolId = toolId;
        this.toolInfo = toolInfo;
        this.uploadHandler = new UploadHandler();
    }

    render() {
        // Clear any previous results
        this.clearResults();
        
        return `
            <div class="tool-page">
                <div class="container">
                    <button class="back-button" onclick="window.router.navigate('home')">
                        ← Back to Catalog
                    </button>
                    
                    <div class="tool-header">
                        <div class="tool-icon-large">${this.toolInfo.icon}</div>
                        <h1>${this.toolInfo.name}</h1>
                        <p class="tool-platform">${this.toolInfo.platform}</p>
                        <p class="tool-description">${this.toolInfo.description}</p>
                    </div>

                    <section class="upload-section">
                        <h2>Process Your Archive</h2>
                        <div class="upload-area" id="uploadArea">
                            <input type="file" id="fileInput" accept=".zip,.db,.html,.json,.mp4,.mov" style="display: none;">
                            <div class="upload-prompt">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <p>Drop your export file here or click to browse</p>
                                <p class="file-hint">Supports: ZIP files, database backups, HTML exports, JSON files, videos</p>
                            </div>
                        </div>
                        <div class="processing-status" id="processingStatus" style="display: none;">
                            <div class="spinner"></div>
                            <p id="statusText">Processing your archive...</p>
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                        </div>
                        <div class="results" id="results" style="display: none;">
                            <h3>Processing Complete!</h3>
                            <div class="preview-area" id="previewArea"></div>
                            <div class="download-options" id="downloadOptions"></div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    init() {
        // Initialize upload handler with this tool's ID
        this.uploadHandler.selectedTool = this.toolId;
        this.uploadHandler.init();
        
        // Make sure state is cleared
        this.uploadHandler.clearState();
    }

    clearResults() {
        // Clear any previous processing state
        if (window.lastProcessResult) {
            if (window.lastProcessResult.previews) {
                window.lastProcessResult.previews.forEach(preview => {
                    if (preview.thumbnail && preview.thumbnail.startsWith('blob:')) {
                        URL.revokeObjectURL(preview.thumbnail);
                    }
                });
            }
            window.lastProcessResult = null;
        }
    }

    destroy() {
        // Cleanup when leaving page
        this.clearResults();
        this.uploadHandler = null;
    }
}

