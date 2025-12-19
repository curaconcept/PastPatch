/**
 * Upload Handler - Manages file uploads and processing
 */
export class UploadHandler {
    constructor() {
        this.selectedTool = null;
    }

    init() {
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

    handleFile(file) {
        const uploadSection = document.getElementById('uploadSection');
        this.selectedTool = uploadSection?.dataset.selectedTool;

        if (!this.selectedTool) {
            alert('Please select a tool from the catalog first.');
            return;
        }

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
            this.updateStatus(`Error: ${error.message}`, 0);
            setTimeout(() => {
                this.resetUpload();
            }, 3000);
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
        }

        // Display download options
        const downloadOptions = document.getElementById('downloadOptions');
        downloadOptions.innerHTML = `
            <button class="download-btn" onclick="this.downloadResult('zip')">Download as ZIP</button>
            <button class="download-btn" onclick="this.downloadResult('google-photos')">Export for Google Photos</button>
            <button class="download-btn" onclick="this.downloadResult('pdf')">Export as PDF</button>
        `;
    }

    resetUpload() {
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('processingStatus').style.display = 'none';
        document.getElementById('results').style.display = 'none';
        document.getElementById('fileInput').value = '';
    }
}

