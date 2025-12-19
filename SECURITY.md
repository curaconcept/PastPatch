# Security & Browser Compatibility

## Browser Compatibility

All dependencies in PastPatch are **100% browser-compatible**. The application runs entirely client-side with no server-side processing.

### Current Dependencies

✅ **jszip** (v3.10.1)
- Browser-compatible ZIP file handling
- No known security vulnerabilities
- Actively maintained

✅ **exif-js** (v2.3.0)
- Browser-compatible EXIF metadata reading
- No known security vulnerabilities
- Lightweight and reliable

✅ **piexifjs** (v1.0.6)
- Browser-compatible EXIF/IPTC metadata manipulation
- No known security vulnerabilities
- Works alongside exif-js for writing metadata

✅ **vite** (v7.3.0)
- Development build tool only (not included in production bundle)
- **No known security vulnerabilities** - updated to latest version
- Fully secure for development use

## Production Safety

When you build for production (`npm run build`), the output contains:
- Only your application code
- Browser-compatible dependencies (jszip, exif-js, piexifjs)
- No Node.js dependencies
- No development tools

The built files can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.) and will run entirely in the user's browser.

## Browser APIs Used

All processing uses standard browser APIs:
- **FileReader API** - Reading uploaded files
- **Canvas API** - Image manipulation and overlay rendering
- **Web Workers** - Heavy processing without blocking UI
- **Blob/URL APIs** - File handling and downloads
- **IndexedDB** (optional) - For caching large files

No external services or APIs are called. Everything runs locally.

## Privacy Guarantee

- ✅ No data is sent to any server
- ✅ No analytics or tracking
- ✅ No external API calls
- ✅ All processing happens in the browser
- ✅ Files are never uploaded anywhere

## Recommendations

1. **Keep Dependencies Updated**: Run `npm audit` regularly and update dependencies when security patches are available.

2. **For Production**: The production build is completely safe - it contains no vulnerable dependencies.

3. **Development**: All dev tools are now secure with no known vulnerabilities.

