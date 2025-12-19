/**
 * Upload Handler - Manages file uploads and processing
 */
export class UploadHandler {
    constructor() {
        this.selectedTool = null;
    }

    init() {
        // Clear any previous state
        this.clearState();
        
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (!uploadArea || !fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    clearState() {
        // Clear any previous results
        const uploadArea = document.getElementById('uploadArea');
        const processingStatus = document.getElementById('processingStatus');
        const results = document.getElementById('results');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea) uploadArea.style.display = 'block';
        if (processingStatus) processingStatus.style.display = 'none';
        if (results) results.style.display = 'none';
        if (fileInput) fileInput.value = '';
        
        // Clean up object URLs
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

    handleFile(file) {
        if (!this.selectedTool) {
            alert('Tool not selected. Please refresh the page.');
            return;
        }

        // Clear previous state
        this.clearState();

        // Show processing status
        document.getElementById('uploadArea').style.display = 'none';
        const processingStatus = document.getElementById('processingStatus');
        processingStatus.style.display = 'block';
        this.updateStatus('Reading file...', 10);

        // Process file based on selected tool
        this.processFile(file, this.selectedTool);
    }

    async processFile(file, toolId) {
        try {
            // Import the appropriate processor
            let processor;
            try {
                processor = await import(`../processors/${toolId}.js`);
            } catch (e) {
                this.updateStatus('This tool is not yet implemented. Coming soon!', 0);
                setTimeout(() => {
                    this.resetUpload();
                }, 3000);
                return;
            }

            this.updateStatus('Processing archive...', 30);

            // Process the file
            const result = await processor.process(file, (progress) => {
                this.updateStatus(progress.message, 30 + (progress.percent * 0.6));
            });

            this.updateStatus('Finalizing...', 90);
            
            // Show results
            setTimeout(() => {
                this.showResults(result);
            }, 500);

        } catch (error) {
            console.error('Processing error:', error);
            
            // Check if it's a "not implemented" error
            if (error.message.includes('not yet implemented') || error.message.includes('not implemented')) {
                this.updateStatus('This tool is coming soon! The processor is not yet implemented.', 0);
                setTimeout(() => {
                    this.showComingSoonMessage();
                }, 1500);
            } else {
                // Show user-friendly error message
                let errorMessage = error.message || 'An unknown error occurred';
                
                // Make error messages more helpful
                if (errorMessage.includes('not found')) {
                    errorMessage = 'File structure not recognized. Please ensure you uploaded a valid export file.';
                } else if (errorMessage.includes('JSON')) {
                    errorMessage = 'Invalid file format. Please check that your export file is not corrupted.';
                } else if (errorMessage.includes('ZIP')) {
                    errorMessage = 'Unable to read ZIP file. Please ensure the file is not corrupted.';
                }
                
                this.updateStatus(`Error: ${errorMessage}`, 0);
                setTimeout(() => {
                    this.showErrorMessage(errorMessage);
                }, 1500);
            }
        }
    }

    updateStatus(message, percent) {
        const statusText = document.getElementById('statusText');
        const progressFill = document.getElementById('progressFill');
        
        if (statusText) statusText.textContent = message;
        if (progressFill) progressFill.style.width = `${percent}%`;
    }

    showResults(result) {
        document.getElementById('processingStatus').style.display = 'none';
        const results = document.getElementById('results');
        results.style.display = 'block';

        // Display previews if available
        const previewArea = document.getElementById('previewArea');
        if (result.previews && result.previews.length > 0) {
            previewArea.innerHTML = result.previews.map(preview => `
                <div class="preview-item">
                    <img src="${preview.thumbnail}" alt="Preview">
                    <p>${preview.filename}</p>
                </div>
            `).join('');
        } else {
            previewArea.innerHTML = '<p>Processing complete! Download your files below.</p>';
        }

        // Display download options
        const downloadOptions = document.getElementById('downloadOptions');
        downloadOptions.innerHTML = '';
        
        if (result.files) {
            for (const [filename, blob] of Object.entries(result.files)) {
                const button = document.createElement('button');
                button.className = 'download-btn';
                button.textContent = `Download ${filename}`;
                button.onclick = () => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                };
                downloadOptions.appendChild(button);
            }
        } else {
            downloadOptions.innerHTML = '<p>No files to download.</p>';
        }
        
        // Store result for cleanup
        window.lastProcessResult = result;
    }

    showComingSoonMessage() {
        const processingStatus = document.getElementById('processingStatus');
        processingStatus.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: var(--warning); margin-bottom: 1rem;">🚧 Coming Soon</h3>
                <p style="margin-bottom: 2rem; color: var(--text-secondary);">
                    This processor is not yet implemented. We're working on it!
                </p>
                <button class="download-btn" onclick="window.router.navigate('home')" style="background: var(--primary-color);">
                    Back to Catalog
                </button>
            </div>
        `;
    }

    showErrorMessage(message) {
        const processingStatus = document.getElementById('processingStatus');
        processingStatus.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: var(--error); margin-bottom: 1rem;">❌ Processing Failed</h3>
                <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                    ${message}
                </p>
                <p style="margin-bottom: 2rem; color: var(--text-secondary); font-size: 0.875rem;">
                    Please check the browser console (F12) for more details, or try a different file.
                </p>
                <button class="download-btn" onclick="this.resetUpload()" style="background: var(--primary-color);">
                    Try Again
                </button>
                <button class="download-btn" onclick="window.router.navigate('home')" style="background: var(--surface); border: 1px solid var(--border-color); margin-left: 0.5rem;">
                    Back to Catalog
                </button>
            </div>
        `;
        
        // Store reference for reset
        const resetBtn = processingStatus.querySelector('button');
        if (resetBtn) {
            resetBtn.resetUpload = () => this.resetUpload();
        }
    }

    resetUpload() {
        this.clearState();
    }
}
