/**
 * Simple hash-based router
 */
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        // Handle initial load
        this.handleRoute();
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [route, ...params] = hash.split('/');
        
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routes[route](params);
        } else {
            // Default to home
            this.navigate('home');
        }
        
        // Update active nav state
        if (typeof updateActiveNav === 'function') {
            setTimeout(updateActiveNav, 10);
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

