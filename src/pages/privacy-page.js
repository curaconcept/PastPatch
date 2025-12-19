/**
 * Privacy Policy page
 */
export class PrivacyPage {
    render() {
        return `
            <div class="content-page">
                <div class="container">
                    <h1>Privacy Policy</h1>
                    <p class="last-updated">Last Updated: ${new Date().toLocaleDateString()}</p>
                    
                    <section class="content-section">
                        <h2>1. Introduction</h2>
                        <p>PastPatch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our web application.</p>
                        <p><strong>Important:</strong> PastPatch is a client-side application that processes all data locally in your browser. We do not collect, store, or transmit any of your personal data.</p>
                    </section>

                    <section class="content-section">
                        <h2>2. Information We Do NOT Collect</h2>
                        <p>PastPatch is designed with privacy as a core principle. We explicitly do NOT collect:</p>
                        <ul>
                            <li>Any files you upload for processing</li>
                            <li>Personal information from your social media exports</li>
                            <li>Your name, email address, or contact information</li>
                            <li>Your IP address or location data</li>
                            <li>Browser cookies or tracking data</li>
                            <li>Usage analytics or behavior tracking</li>
                            <li>Any metadata from your files</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>3. How PastPatch Works</h2>
                        <p>PastPatch operates entirely within your web browser:</p>
                        <ul>
                            <li><strong>Local Processing:</strong> All file processing happens on your device using JavaScript</li>
                            <li><strong>No Server Upload:</strong> Files never leave your browser or device</li>
                            <li><strong>No Network Transmission:</strong> We don't send your data over the internet</li>
                            <li><strong>No Storage:</strong> We don't store your files on any server</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>4. Third-Party Services</h2>
                        <p>PastPatch may use the following third-party services:</p>
                        <ul>
                            <li><strong>GitHub:</strong> We host our code on GitHub. If you visit our GitHub repository, GitHub's privacy policy applies.</li>
                            <li><strong>Hosting Services:</strong> If PastPatch is hosted on services like Netlify, Vercel, or GitHub Pages, those services may collect standard web server logs (IP addresses, access times). We do not have access to or control over this data.</li>
                        </ul>
                        <p>We do not use analytics services, advertising networks, or any tracking technologies.</p>
                    </section>

                    <section class="content-section">
                        <h2>5. Browser Storage</h2>
                        <p>PastPatch may use your browser's local storage for:</p>
                        <ul>
                            <li>Temporary file processing (cleared when you close the browser tab)</li>
                            <li>Session state (cleared when you navigate away)</li>
                        </ul>
                        <p>We do not use persistent cookies or long-term storage. All temporary data is cleared when you close the application.</p>
                    </section>

                    <section class="content-section">
                        <h2>6. Open Source</h2>
                        <p>PastPatch is open-source software. You can review our code on <a href="https://github.com/curaconcept/PastPatch" target="_blank">GitHub</a> to verify our privacy claims. The code is publicly available for inspection.</p>
                    </section>

                    <section class="content-section">
                        <h2>7. Children's Privacy</h2>
                        <p>PastPatch does not knowingly collect information from children under 13. Since we don't collect any information, this is not applicable, but we want to be clear that our service is designed to be safe for all users.</p>
                    </section>

                    <section class="content-section">
                        <h2>8. Changes to This Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Since we don't collect contact information, we cannot notify you directly of changes.</p>
                    </section>

                    <section class="content-section">
                        <h2>9. Your Rights</h2>
                        <p>Since we don't collect your data, there's no data to access, modify, or delete. However, you have the right to:</p>
                        <ul>
                            <li>Stop using PastPatch at any time</li>
                            <li>Review our source code to verify our privacy practices</li>
                            <li>Report privacy concerns via our GitHub repository</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>10. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please open an issue on our <a href="https://github.com/curaconcept/PastPatch" target="_blank">GitHub repository</a>.</p>
                    </section>

                    <section class="content-section">
                        <h2>11. Compliance</h2>
                        <p>PastPatch is designed to comply with:</p>
                        <ul>
                            <li>GDPR (General Data Protection Regulation) - We don't collect data, so GDPR requirements are inherently met</li>
                            <li>CCPA (California Consumer Privacy Act) - No data collection means no CCPA obligations</li>
                            <li>Other privacy regulations - Our zero-data-collection approach means we exceed most privacy requirements</li>
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

