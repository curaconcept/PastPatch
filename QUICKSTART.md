# Quick Start Guide

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PastPatch.git
   cd PastPatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

## Development

### Project Structure

- `src/processors/` - Platform-specific processors (Snapchat, Instagram, etc.)
- `src/ui/` - UI components (Catalog, Upload handler)
- `src/utils/` - Shared utilities (ZIP handling, metadata, etc.)
- `src/styles/` - CSS stylesheets
- `index.html` - Main HTML file

### Adding a New Processor

1. Create a new file in `src/processors/` (e.g., `threads.js`)
2. Extend the `BaseProcessor` class from `base.js`
3. Implement the `process()` method
4. Add the tool to the catalog in `src/ui/catalog.js`

Example:
```javascript
import { BaseProcessor } from './base.js';

export class ThreadsProcessor extends BaseProcessor {
    constructor() {
        super('Threads');
    }

    async process(file, progressCallback) {
        // Your processing logic here
    }
}

export async function process(file, progressCallback) {
    const processor = new ThreadsProcessor();
    return await processor.process(file, progressCallback);
}
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## Next Steps

- Check out the [Contributing Guide](CONTRIBUTING.md) to see how you can help
- Review the [README](README.md) for more details about the project
- Start implementing processors for your favorite platforms!

