# PastPatch

**PastPatch** is a free, open-source web platform designed as a centralized hub for rescuing and revitalizing your social media archives. Tired of clunky exports from apps like Snapchat Memories, Instagram Stories, Facebook Messenger chats, WhatsApp backups, TikTok downloads, or Twitter/X threads that come out as jumbled zips with stripped metadata, separated overlays, and no proper timestamps? PastPatch steps in to automate the fix.

## 🎯 What It Does

Simply upload your raw export file directly in your browser—**no accounts, no data logging on our end**—and let our client-side tools do the heavy lifting.

### How It Works

Our JavaScript-powered processors (built on libraries like JSZip for extraction, EXIF.js for metadata embedding, and native browser APIs like Canvas for image/video manipulation) parse the zip's structure—whether it's:
- **Snapchat's** `memories_history.json` with caption positions and dates
- **Instagram's** messy JSON blobs for story stickers and AR effects
- **WhatsApp's** encrypted `.db` backups (with user-provided keys for decryption)
- **Facebook's** HTML-heavy chat exports
- **TikTok's** video downloads with metadata
- **Twitter/X's** thread exports

We match base media files (photos, videos, audio notes) to their metadata counterparts, reapply text overlays, stickers, filters, and geotags where possible, restore original capture dates to EXIF/IPTC fields for proper sorting in galleries, and even reconstruct threaded conversations into readable timelines or PDF exports.

For videos, we handle frame-specific edits using Web Workers to avoid browser lag, ensuring smooth playback with embedded subtitles or effects.

## 🏠 The Catalog

Your dashboard: A clean, searchable interface categorizing tools by platform:
- **Snapchat Restorer** - Baking PNG overlays back onto snaps
- **Instagram Metadata Mender** - Fixing story timestamps and locations
- **WhatsApp Chat Weaver** - Turning backups into interactive HTML viewers with inline images and reactions
- **Facebook Messenger Reconstructor** - Restoring chat exports with proper formatting
- **TikTok Archive Fixer** - Rebuilding video metadata and descriptions
- **Twitter/X Thread Builder** - Reconstructing threaded conversations

Each tool includes previews—see before-and-after thumbnails of your fixed files—plus options for output formats like:
- Zipped folders
- Google Photos-ready albums (with preserved chronology for seamless uploads)
- iCloud/iMessage-compatible bundles
- PDF exports for conversations

Advanced users can tweak settings, like ignoring certain filters or batch-processing multiple exports at once.

## 🔒 Privacy First

Everything runs **locally in your browser**, so your personal snaps, chats, or stories never touch our servers—ideal for data hoarders or privacy-conscious folks dodging Big Tech's export pitfalls.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/PastPatch.git
cd PastPatch

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` (or the port shown) to use PastPatch.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (ES6+)
- **File Processing**: JSZip, FileReader API
- **Image Processing**: Canvas API, native browser image manipulation
- **Metadata**: EXIF.js, piexifjs
- **Video Processing**: Canvas API, Web Workers (FFmpeg.wasm can be added for advanced video processing)
- **UI Framework**: Modern CSS with minimal dependencies
- **Build Tool**: Vite (for development and bundling)

**Note**: All processing happens client-side in the browser. No server-side dependencies required.

## 📁 Project Structure

```
PastPatch/
├── src/
│   ├── processors/       # Platform-specific processors
│   │   ├── snapchat.js
│   │   ├── instagram.js
│   │   ├── whatsapp.js
│   │   ├── facebook.js
│   │   ├── tiktok.js
│   │   └── twitter.js
│   ├── utils/            # Shared utilities
│   │   ├── metadata.js
│   │   ├── image.js
│   │   ├── video.js
│   │   └── zip.js
│   ├── workers/          # Web Workers for heavy processing
│   ├── ui/               # UI components
│   │   ├── catalog.js
│   │   ├── upload.js
│   │   └── preview.js
│   ├── styles/
│   └── index.html
├── public/
├── tests/
├── docs/
└── package.json
```

## 🤝 Contributing

We're fully open-source and encourage contributions! Whether you want to:
- Add support for new platforms (Threads, BeReal, etc.)
- Refine parsers as app formats evolve
- Improve UI/UX
- Fix bugs
- Write documentation

Please read our [Contributing Guide](CONTRIBUTING.md) and feel free to open issues or pull requests!

## 🗺️ Roadmap

- [x] Project setup and architecture
- [ ] Snapchat Memories processor
- [ ] Instagram Stories processor
- [ ] WhatsApp backup processor
- [ ] Facebook Messenger processor
- [ ] TikTok archive processor
- [ ] Twitter/X thread processor
- [ ] Catalog UI with search and filtering
- [ ] Preview system with before/after comparison
- [ ] Multiple output format support
- [ ] Batch processing
- [ ] Advanced settings panel
- [ ] Documentation and tutorials

## 💰 Monetization

PastPatch is and will remain **free and open-source**. Future monetization options (if any) will be:
- Optional donations via Ko-fi
- Premium add-ons for cloud-assisted processing on massive archives (100GB+)
- All core functionality will always remain free and client-side

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with love for digital archivists, data hoarders, and anyone who wants to preserve their memories properly.

---

**PastPatch isn't just a tool—it's your digital time capsule repair kit**, turning fragmented exports into polished, searchable memories you can actually enjoy or migrate without losing a beat.

