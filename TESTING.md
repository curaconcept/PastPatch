# Testing Guide

## Quick Start

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Test each processor** by uploading sample files

## Testing Each Processor

### 1. Twitter/X Processor

**What to test:**
- Upload a Twitter JSON export file
- Or a ZIP containing Twitter JSON data

**How to get test data:**
1. Go to Twitter/X → Settings → Your Account → Download an archive
2. Wait for email with download link
3. Extract the ZIP and look for `tweet.js` or `tweets.js` file
4. Upload either the JSON file directly or the entire ZIP

**Expected result:**
- Threads are reconstructed chronologically
- HTML file generated with all tweets
- Download button appears

### 2. Facebook Messenger Processor

**What to test:**
- Upload Facebook HTML chat export

**How to get test data:**
1. Go to Facebook → Settings → Your Facebook Information → Download Your Information
2. Select "Messages" format
3. Choose HTML format
4. Download and extract
5. Upload the HTML file or ZIP containing HTML

**Expected result:**
- Messages are parsed and organized
- Conversations grouped by participants
- Clean HTML viewer generated

### 3. Snapchat Processor

**What to test:**
- Upload Snapchat data export ZIP

**How to get test data:**
1. Go to Snapchat → Settings → My Data
2. Request your data
3. Download the ZIP file (contains `memories_history.json` and media files)
4. Upload the entire ZIP

**Expected result:**
- Memories extracted from ZIP
- Overlays and captions restored on images
- EXIF dates fixed
- Output ZIP with restored files
- Thumbnails shown in preview

### 4. Instagram Processor

**What to test:**
- Upload Instagram data export ZIP

**How to get test data:**
1. Go to Instagram → Settings → Your Activity → Download Your Information
2. Select JSON format
3. Download and extract
4. Upload the ZIP file

**Expected result:**
- Stories and posts processed
- Stickers and location tags restored
- Timestamps fixed
- Output ZIP with organized files

### 5. TikTok Processor

**What to test:**
- Upload TikTok video file or ZIP archive

**How to get test data:**
1. Download videos from TikTok (using official download or third-party tool)
2. Save metadata JSON files alongside videos (if available)
3. Upload single video or ZIP with videos

**Expected result:**
- Videos organized by date
- Metadata restored in filenames
- Downloadable restored files

### 6. WhatsApp Processor

**What to test:**
- Upload WhatsApp .db backup file

**How to get test data:**
1. For Android: Find `msgstore.db` in WhatsApp backup folder
2. For encrypted backups: You'll need the encryption key
3. Upload the .db file or ZIP containing it

**Expected result:**
- Basic HTML viewer generated
- Note about full decryption (if encrypted)
- Instructions displayed

## Testing Without Real Data

If you don't have real export files, you can create simple test files:

### Twitter Test File

Create `test_twitter.json`:
```json
[
  {
    "id_str": "123",
    "created_at": "2024-01-01T12:00:00Z",
    "full_text": "Test tweet",
    "in_reply_to_status_id_str": null
  }
]
```

### Facebook Test File

Create `test_facebook.html`:
```html
<html>
<body>
  <div class="message">
    <div class="sender">John Doe</div>
    <div class="timestamp">Jan 1, 2024, 12:00 PM</div>
    <div class="content">Test message</div>
  </div>
</body>
</html>
```

## Testing Checklist

- [ ] All 6 tools appear in catalog
- [ ] Search functionality works
- [ ] Can select a tool
- [ ] Upload area appears
- [ ] Drag and drop works
- [ ] File input works
- [ ] Progress bar shows during processing
- [ ] Results appear after processing
- [ ] Download buttons work
- [ ] Back to catalog button works
- [ ] Error messages display properly for invalid files

## Common Issues

### "File not found" errors
- Make sure you're uploading the correct file format
- Check that ZIP files contain expected structure

### Processing fails
- Check browser console for errors (F12)
- Verify file format matches processor expectations
- Some processors need specific file structures

### Download doesn't work
- Check browser download settings
- Some browsers block multiple downloads
- Try downloading one file at a time

## Browser Compatibility

Tested on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ Older browsers may have limited Canvas/File API support

## Performance Testing

- **Small files** (< 10MB): Should process quickly
- **Medium files** (10-50MB): May take 10-30 seconds
- **Large files** (> 50MB): May take 1+ minutes, consider using Web Workers

## Debug Mode

Open browser console (F12) to see:
- Processing progress
- Error messages
- File structure information
- Performance metrics

