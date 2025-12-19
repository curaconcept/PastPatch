/**
 * Home page with catalog
 */
import { Catalog } from '../ui/catalog.js';

export class HomePage {
    constructor(tools) {
        this.tools = tools;
        this.catalog = new Catalog();
    }

    render() {
        return `
            <section class="hero">
                <div class="container">
                    <h2>Rescue Your Social Media Archives</h2>
                    <p>Upload your raw export files and let our client-side tools restore metadata, overlays, and timestamps. Everything runs in your browser—your data never leaves your device.</p>
                </div>
            </section>

            <section class="catalog" id="catalog">
                <div class="container">
                    <h2>Platform Tools</h2>
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search for a platform or tool...">
                    </div>
                    <div class="tools-grid" id="toolsGrid">
                        <!-- Tools will be dynamically loaded here -->
                    </div>
                </div>
            </section>
        `;
    }

    init() {
        this.catalog.tools = this.tools;
        this.catalog.init();
        
        // Update click handlers to use router after catalog renders
        setTimeout(() => {
            const toolsGrid = document.getElementById('toolsGrid');
            if (toolsGrid) {
                // Remove old listeners and add new ones
                toolsGrid.querySelectorAll('.tool-button').forEach(button => {
                    const toolId = button.dataset.toolId;
                    // Clone to remove old listeners
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener('click', () => {
                        window.router.navigate(toolId);
                    });
                });
            }
        }, 50);
    }

    destroy() {
        // Cleanup if needed
    }
}

