/**
 * Safety page
 */
export class SafetyPage {
    render() {
        return `
            <div class="content-page">
                <div class="container">
                    <h1>Safety & Security</h1>
                    
                    <section class="content-section">
                        <h2>🔒 Client-Side Processing</h2>
                        <p>All processing happens entirely in your browser. Your files are never uploaded to any server, ensuring complete privacy and security.</p>
                    </section>

                    <section class="content-section">
                        <h2>🛡️ No Data Collection</h2>
                        <p>We don't collect, store, or transmit any of your data. Everything you upload stays on your device throughout the entire process.</p>
                    </section>

                    <section class="content-section">
                        <h2>✅ Open Source</h2>
                        <p>PastPatch is fully open-source, meaning you can review the code yourself to verify our privacy claims. All code is available on <a href="https://github.com/curaconcept/PastPatch" target="_blank">GitHub</a>.</p>
                    </section>

                    <section class="content-section">
                        <h2>⚠️ Important Safety Notes</h2>
                        <ul>
                            <li><strong>File Size Limits:</strong> Very large files (100MB+) may take longer to process and could impact browser performance. Consider processing files in smaller batches.</li>
                            <li><strong>Browser Compatibility:</strong> PastPatch works best in modern browsers (Chrome, Firefox, Safari, Edge). Older browsers may have limited functionality.</li>
                            <li><strong>Encrypted Backups:</strong> Some platforms (like WhatsApp) use encrypted backups. You'll need to provide the encryption key if your backup is encrypted.</li>
                            <li><strong>Export Formats:</strong> Each platform has different export formats. Make sure you're using the official export feature from each platform for best results.</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>🔍 What We Process</h2>
                        <p>PastPatch only processes files you explicitly upload. We don't access:</p>
                        <ul>
                            <li>Your browser history</li>
                            <li>Other files on your device</li>
                            <li>Your social media accounts</li>
                            <li>Any data from other websites</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>📱 Supported Platforms</h2>
                        <p>We currently support processing exports from:</p>
                        <ul>
                            <li>Snapchat (memories exports)</li>
                            <li>Instagram (stories and posts)</li>
                            <li>Facebook Messenger (chat exports)</li>
                            <li>WhatsApp (backup files)</li>
                            <li>TikTok (video downloads)</li>
                            <li>Twitter/X (tweet exports)</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>🆘 Need Help?</h2>
                        <p>If you encounter any issues or have safety concerns, please:</p>
                        <ul>
                            <li>Check our <a href="#about">About page</a> for more information</li>
                            <li>Review our <a href="#privacy">Privacy Policy</a></li>
                            <li>Open an issue on <a href="https://github.com/curaconcept/PastPatch" target="_blank">GitHub</a></li>
                        </ul>
                    </section>
                </div>
            </div>
        `;
    }

    init() {
        // Any initialization needed
    }

    destroy() {
        // Cleanup if needed
    }
}

