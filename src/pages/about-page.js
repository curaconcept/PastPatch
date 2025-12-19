/**
 * About page
 */
export class AboutPage {
    render() {
        return `
            <div class="content-page">
                <div class="container">
                    <h1>About PastPatch</h1>
                    
                    <section class="content-section">
                        <h2>What is PastPatch?</h2>
                        <p>PastPatch is a free, open-source web platform designed as a centralized hub for rescuing and revitalizing your social media archives. Tired of clunky exports from apps like Snapchat Memories, Instagram Stories, Facebook Messenger chats, WhatsApp backups, TikTok downloads, or Twitter/X threads that come out as jumbled zips with stripped metadata, separated overlays, and no proper timestamps? PastPatch steps in to automate the fix.</p>
                    </section>

                    <section class="content-section">
                        <h2>How It Works</h2>
                        <p>Simply upload your raw export file directly in your browser—<strong>no accounts, no data logging on our end</strong>—and let our client-side tools do the heavy lifting.</p>
                        
                        <p>Our JavaScript-powered processors parse the zip's structure—whether it's Snapchat's memories_history.json with caption positions and dates, Instagram's messy JSON blobs for story stickers and AR effects, WhatsApp's encrypted .db backups, or Facebook's HTML-heavy chat exports. We match base media files to their metadata counterparts, reapply text overlays, stickers, filters, and geotags where possible, restore original capture dates to EXIF/IPTC fields for proper sorting in galleries, and even reconstruct threaded conversations into readable timelines or PDF exports.</p>
                    </section>

                    <section class="content-section">
                        <h2>Privacy First</h2>
                        <p>Everything runs <strong>locally in your browser</strong>, so your personal snaps, chats, or stories never touch our servers—ideal for data hoarders or privacy-conscious folks dodging Big Tech's export pitfalls.</p>
                    </section>

                    <section class="content-section">
                        <h2>Open Source</h2>
                        <p>We're fully open-source on GitHub, encouraging contributions to add support for emerging platforms (like Threads or BeReal) or refine parsers as app formats evolve.</p>
                    </section>

                    <section class="content-section">
                        <h2>Our Mission</h2>
                        <p>PastPatch isn't just a tool—it's your digital time capsule repair kit, turning fragmented exports into polished, searchable memories you can actually enjoy or migrate without losing a beat. Whether you're prepping for Snapchat's storage paywall, archiving old Insta stories before deletion, or salvaging WhatsApp histories, we've got your back.</p>
                    </section>

                    <section class="content-section">
                        <h2>Get Started</h2>
                        <p><a href="#home" class="cta-button">Browse Our Tools</a></p>
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

