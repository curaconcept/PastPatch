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
            <section class="hero-modern">
                <div class="container hero-content">
                    <div class="hero-main">
                        <h1 class="hero-title">PastPatch</h1>
                        <p class="hero-subtitle">Your Digital Time Capsule Repair Kit</p>
                        <p class="hero-description">
                            Transform fragmented social media exports into polished, searchable archives. 
                            <strong>Zero data collection. Complete privacy.</strong> Everything processes locally in your browser.
                        </p>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <div class="stat-number">6</div>
                            <div class="stat-label">Platforms</div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <div class="stat-number">100%</div>
                            <div class="stat-label">Client-Side</div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Data Uploaded</div>
                        </div>
                    </div>
                    <div class="hero-cta">
                        <a href="#catalog-section" class="cta-primary">Browse Tools</a>
                    </div>
                </div>
            </section>

            <section class="catalog" id="catalog">
                <div class="container">
                    <div class="section-header" id="catalog-section">
                        <h2 class="section-title">
                            <span class="section-number">01</span>
                            Platform Processors
                        </h2>
                        <p class="section-subtitle">Choose your platform to begin restoring your archives</p>
                    </div>
                    <div class="search-bar-modern">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input type="text" id="searchInput" placeholder="Search platforms...">
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

