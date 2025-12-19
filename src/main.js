import { Router } from './router.js';
import { Catalog } from './ui/catalog.js';
import { ToolPage } from './pages/tool-page.js';
import { HomePage } from './pages/home-page.js';
import { AboutPage } from './pages/about-page.js';
import { SafetyPage } from './pages/safety-page.js';
import { PrivacyPage } from './pages/privacy-page.js';
import { TermsPage } from './pages/terms-page.js';

// Initialize router
window.router = new Router();
let currentPage = null;

// Update active nav state
function updateActiveNav() {
    const currentRoute = window.router.getCurrentRoute() || 'home';
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkRoute = href.replace('#', '') || 'home';
        if (linkRoute === currentRoute) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Get tools data
const tools = [
    {
        id: 'snapchat',
        name: 'Snapchat Restorer',
        platform: 'Snapchat',
        description: 'Bake PNG overlays back onto snaps, restore captions, and fix timestamps from memories_history.json exports.',
        icon: '📸',
        status: 'available'
    },
    {
        id: 'instagram',
        name: 'Instagram Metadata Mender',
        platform: 'Instagram',
        description: 'Fix story timestamps, locations, and restore stickers and AR effects from Instagram exports.',
        icon: '📷',
        status: 'available'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Chat Weaver',
        platform: 'WhatsApp',
        description: 'Turn encrypted .db backups into interactive HTML viewers with inline images, reactions, and proper formatting.',
        icon: '💬',
        status: 'available'
    },
    {
        id: 'facebook',
        name: 'Facebook Messenger Reconstructor',
        platform: 'Facebook',
        description: 'Restore chat exports with proper formatting, inline media, and conversation threading.',
        icon: '👥',
        status: 'available'
    },
    {
        id: 'tiktok',
        name: 'TikTok Archive Fixer',
        platform: 'TikTok',
        description: 'Rebuild video metadata, descriptions, and restore proper timestamps from TikTok downloads.',
        icon: '🎵',
        status: 'available'
    },
    {
        id: 'twitter',
        name: 'Twitter/X Thread Builder',
        platform: 'Twitter/X',
        description: 'Reconstruct threaded conversations into readable timelines or PDF exports with proper formatting.',
        icon: '🐦',
        status: 'available'
    }
];

// Register routes
window.router.register('home', () => {
    if (currentPage && currentPage.destroy) currentPage.destroy();
    currentPage = new HomePage(tools);
    renderPage(currentPage);
});

// Register tool routes
tools.forEach(tool => {
    window.router.register(tool.id, () => {
        if (currentPage && currentPage.destroy) currentPage.destroy();
        currentPage = new ToolPage(tool.id, tool);
        renderPage(currentPage);
    });
});

// Register other pages
window.router.register('about', () => {
    if (currentPage && currentPage.destroy) currentPage.destroy();
    currentPage = new AboutPage();
    renderPage(currentPage);
});

window.router.register('safety', () => {
    if (currentPage && currentPage.destroy) currentPage.destroy();
    currentPage = new SafetyPage();
    renderPage(currentPage);
});

window.router.register('privacy', () => {
    if (currentPage && currentPage.destroy) currentPage.destroy();
    currentPage = new PrivacyPage();
    renderPage(currentPage);
});

window.router.register('terms', () => {
    if (currentPage && currentPage.destroy) currentPage.destroy();
    currentPage = new TermsPage();
    renderPage(currentPage);
});

function renderPage(page) {
    const content = document.getElementById('app-content');
    if (content) {
        content.innerHTML = page.render();
        if (page.init) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                page.init();
                updateActiveNav();
            }, 10);
        } else {
            updateActiveNav();
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Router will handle initial route
});
