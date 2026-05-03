# /downloads — Where Empyrean binaries live on the website

After you compile Empyrean on your Mac (per `empyrean-app/BUILD_INSTRUCTIONS.md`), drop the resulting binaries directly into this folder. The `/app` page is already pre-wired with hrefs that match electron-builder's default output filenames, so as long as the binary names match below, the download buttons just work.

## Required filenames (must match exactly)

```
downloads/
├── Empyrean-1.0.0.dmg              ← macOS Universal (x64 + arm64)
├── Empyrean-Setup-1.0.0.exe        ← Windows installer (NSIS)
└── (optional) Empyrean-1.0.0.AppImage   ← Linux, optional
```

These names are what `electron-builder` produces by default given the configuration in `empyrean-app/package.json`. If you change the `version` field in `package.json`, the filenames change too — and the hrefs on `/app/index.html` will need to be updated to match.

## Minimum acceptable for USPTO Class 9 specimen

You only need **ONE working binary** for the Class 9 Statement of Use. Bess and Joe will likely submit the macOS `.dmg` because:
1. It's the easiest to compile on your Mac (native target, no cross-compilation)
2. It's the most reliably "downloadable software" in the USPTO sense — no installer wizards, just a draggable app
3. The .dmg itself bears the BEATIFIC VISION mark (custom DMG window background, Empyrean app inside)

The Windows `.exe` is a strong addition because it shows multi-platform availability, but it isn't strictly required for the specimen. If `npm run build:win` gives you trouble in the next 18 hours, ship Mac-only and don't sweat it.

## Verifying the download works

After you `git push` with the binaries in this folder and Vercel redeploys (~30 seconds), test in an incognito window:

1. Visit `https://beatificvision.com/app`
2. Click "Download for macOS" 
3. Confirm the .dmg downloads
4. Mount the .dmg and confirm Empyrean opens (you'll get a Gatekeeper warning since the app is unsigned — right-click → Open, then "Open Anyway." This is the expected user experience for unsigned apps and is not a USPTO problem.)
5. Confirm the splash screen displays the BEATIFIC VISION mark
6. Confirm the main window opens and displays the catalog

This sequence — landing page → click → download → install → app bears the mark — is the entire Class 9 specimen flow. Bess and Joe will document it with screenshots.

## Important: do NOT commit the binaries to git unless they're small

A typical Empyrean .dmg will be ~80–120 MB. GitHub has a soft limit of 50 MB per file and a hard limit of 100 MB. Two options:

**Option A (simplest — what we're doing):** Just commit them. Vercel handles files up to ~100 MB fine. Just be aware your git repo grows.

**Option B (cleaner — for later):** Use Git LFS, or host binaries on a CDN (Cloudflare R2, Backblaze B2, etc.) and have `/app` link to those URLs instead of relative paths. Worth doing post-deadline.

For tomorrow: Option A. Commit the binaries directly, push, deploy. Done.
