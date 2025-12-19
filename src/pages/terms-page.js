/**
 * Terms of Service page
 */
export class TermsPage {
    render() {
        return `
            <div class="content-page">
                <div class="container">
                    <h1>Terms of Service</h1>
                    <p class="last-updated">Last Updated: ${new Date().toLocaleDateString()}</p>
                    
                    <section class="content-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using PastPatch ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.</p>
                    </section>

                    <section class="content-section">
                        <h2>2. Description of Service</h2>
                        <p>PastPatch is a free, open-source web application that processes social media archive exports locally in your browser. The Service:</p>
                        <ul>
                            <li>Processes files you upload entirely in your browser</li>
                            <li>Does not store, transmit, or collect your data</li>
                            <li>Is provided "as-is" without warranties</li>
                            <li>Is free to use and open-source</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>3. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Only upload files that you own or have permission to process</li>
                            <li>Not upload malicious files, viruses, or harmful code</li>
                            <li>Respect intellectual property rights</li>
                            <li>Not attempt to reverse engineer or exploit the Service</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>4. Intellectual Property</h2>
                        <p>PastPatch is licensed under the MIT License. You are free to:</p>
                        <ul>
                            <li>Use the code for commercial or private purposes</li>
                            <li>Modify the code</li>
                            <li>Distribute the code</li>
                            <li>Use the code privately</li>
                        </ul>
                        <p>You must include the original copyright notice and license in any copies or substantial portions of the software.</p>
                    </section>

                    <section class="content-section">
                        <h2>5. Disclaimer of Warranties</h2>
                        <p><strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong></p>
                        <ul>
                            <li>Warranties of merchantability</li>
                            <li>Fitness for a particular purpose</li>
                            <li>Non-infringement</li>
                            <li>Accuracy or completeness of results</li>
                            <li>Uninterrupted or error-free operation</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>6. Limitation of Liability</h2>
                        <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PASTPATCH AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR:</strong></p>
                        <ul>
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Loss of profits, data, or other intangible losses</li>
                            <li>Damages resulting from your use or inability to use the Service</li>
                            <li>Damages resulting from files processed through the Service</li>
                            <li>Any errors or omissions in the Service</li>
                        </ul>
                        <p>Your sole remedy for dissatisfaction with the Service is to stop using it.</p>
                    </section>

                    <section class="content-section">
                        <h2>7. Data and Privacy</h2>
                        <p>PastPatch processes all data locally in your browser. We do not collect, store, or transmit your data. However, you are responsible for:</p>
                        <ul>
                            <li>Ensuring you have the right to process files you upload</li>
                            <li>Protecting your own data and files</li>
                            <li>Complying with applicable data protection laws</li>
                        </ul>
                        <p>See our <a href="#privacy">Privacy Policy</a> for more information.</p>
                    </section>

                    <section class="content-section">
                        <h2>8. Prohibited Uses</h2>
                        <p>You may not use the Service to:</p>
                        <ul>
                            <li>Process files containing illegal content</li>
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Harm, threaten, or harass others</li>
                            <li>Upload malicious code or viruses</li>
                            <li>Attempt to overload or disrupt the Service</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>9. Service Availability</h2>
                        <p>We do not guarantee that the Service will be available at all times. The Service may be:</p>
                        <ul>
                            <li>Unavailable due to maintenance</li>
                            <li>Modified or discontinued at any time</li>
                            <li>Subject to technical limitations</li>
                        </ul>
                        <p>Since PastPatch is open-source, you can always run your own instance if needed.</p>
                    </section>

                    <section class="content-section">
                        <h2>10. Third-Party Content</h2>
                        <p>PastPatch may process content from third-party platforms (Snapchat, Instagram, etc.). You are responsible for:</p>
                        <ul>
                            <li>Complying with those platforms' terms of service</li>
                            <li>Ensuring you have the right to export and process that content</li>
                            <li>Respecting the privacy of others whose content you process</li>
                        </ul>
                    </section>

                    <section class="content-section">
                        <h2>11. Modifications to Terms</h2>
                        <p>We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new terms.</p>
                    </section>

                    <section class="content-section">
                        <h2>12. Termination</h2>
                        <p>We may terminate or suspend access to the Service immediately, without prior notice, for any reason, including if you breach these Terms of Service.</p>
                    </section>

                    <section class="content-section">
                        <h2>13. Governing Law</h2>
                        <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.</p>
                    </section>

                    <section class="content-section">
                        <h2>14. Severability</h2>
                        <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
                    </section>

                    <section class="content-section">
                        <h2>15. Contact Information</h2>
                        <p>For questions about these Terms of Service, please open an issue on our <a href="https://github.com/curaconcept/PastPatch" target="_blank">GitHub repository</a>.</p>
                    </section>

                    <section class="content-section">
                        <h2>16. Acknowledgment</h2>
                        <p>By using PastPatch, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
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

