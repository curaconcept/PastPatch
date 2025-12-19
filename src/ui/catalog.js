/**
 * Catalog UI - Displays available platform tools
 */
export class Catalog {
    constructor() {
        this.tools = [
            {
                id: 'snapchat',
                name: 'Snapchat Restorer',
                platform: 'Snapchat',
                description: 'Bake PNG overlays back onto snaps, restore captions, and fix timestamps from memories_history.json exports.',
                icon: '📸',
                status: 'in-development'
            },
            {
                id: 'instagram',
                name: 'Instagram Metadata Mender',
                platform: 'Instagram',
                description: 'Fix story timestamps, locations, and restore stickers and AR effects from Instagram exports.',
                icon: '📷',
                status: 'in-development'
            },
            {
                id: 'whatsapp',
                name: 'WhatsApp Chat Weaver',
                platform: 'WhatsApp',
                description: 'Turn encrypted .db backups into interactive HTML viewers with inline images, reactions, and proper formatting.',
                icon: '💬',
                status: 'in-development'
            },
            {
                id: 'facebook',
                name: 'Facebook Messenger Reconstructor',
                platform: 'Facebook',
                description: 'Restore chat exports with proper formatting, inline media, and conversation threading.',
                icon: '👥',
                status: 'in-development'
            },
            {
                id: 'tiktok',
                name: 'TikTok Archive Fixer',
                platform: 'TikTok',
                description: 'Rebuild video metadata, descriptions, and restore proper timestamps from TikTok downloads.',
                icon: '🎵',
                status: 'in-development'
            },
            {
                id: 'twitter',
                name: 'Twitter/X Thread Builder',
                platform: 'Twitter/X',
                description: 'Reconstruct threaded conversations into readable timelines or PDF exports with proper formatting.',
                icon: '🐦',
                status: 'in-development'
            }
        ];
    }

    init() {
        this.renderTools();
        this.setupSearch();
    }

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = this.tools.map(tool => `
            <div class="tool-card" data-tool-id="${tool.id}">
                <div class="tool-icon">${tool.icon}</div>
                <h3>${tool.name}</h3>
                <p class="tool-platform">${tool.platform}</p>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-status">${tool.status}</div>
                <button class="tool-button" data-tool-id="${tool.id}">Use Tool</button>
            </div>
        `).join('');

        // Add click handlers
        toolsGrid.querySelectorAll('.tool-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const toolId = e.target.dataset.toolId;
                this.selectTool(toolId);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterTools(query);
        });
    }

    filterTools(query) {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            const toolId = card.dataset.toolId;
            const tool = this.tools.find(t => t.id === toolId);
            
            if (!tool) return;

            const matches = 
                tool.name.toLowerCase().includes(query) ||
                tool.platform.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query);

            card.style.display = matches ? 'block' : 'none';
        });
    }

    selectTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;

        // Hide catalog, show upload section
        document.getElementById('catalog').style.display = 'none';
        const uploadSection = document.getElementById('uploadSection');
        uploadSection.style.display = 'block';
        document.getElementById('toolTitle').textContent = tool.name;

        // Store selected tool for upload handler
        uploadSection.dataset.selectedTool = toolId;

        // Scroll to upload section
        uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
}

