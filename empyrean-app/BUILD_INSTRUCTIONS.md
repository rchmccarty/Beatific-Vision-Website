# EMPYREAN — BUILD INSTRUCTIONS

**Audience:** Ryan, building Empyrean binaries on his Mac for tomorrow's USPTO submission.
**Time required:** ~15 minutes of mostly waiting. Active work: 2 commands.
**Output:** Three installers — macOS (.dmg), Windows (.exe), Linux (.AppImage) — that you upload to your Vercel-hosted site.

---

## 1. Prerequisites — verify these exist on your Mac

Open Terminal (Cmd+Space → "Terminal" → Enter) and paste each of the following, one at a time. If you get a version number for each, you're ready.

```bash
node --version    # Need v18 or higher
npm --version     # Need v9 or higher
```

**If either is missing or too old:** install the latest Node.js LTS from https://nodejs.org. The default installer covers both. Restart Terminal after install.

---

## 2. Open the Empyrean source folder

Whatever folder you saved the website files to, open Terminal and `cd` into the `empyrean-app/` subfolder. Example, if you put the website on your Desktop:

```bash
cd ~/Desktop/beatific-vision-website/empyrean-app
```

Verify you're in the right place:

```bash
ls
# Should show: package.json, src/, build/, BUILD_INSTRUCTIONS.md
```

---

## 3. Install dependencies (one-time, ~3 minutes)

```bash
npm install
```

You'll see a lot of progress text. It's downloading Electron (~250MB) and electron-builder. Wait until you get your prompt back. Some yellow "deprecation" warnings are normal and harmless.

---

## 4. Build all three platforms (~6 minutes)

Run these in order. Each one produces installer(s) in the `dist/` folder.

```bash
npm run build:mac     # produces Empyrean-1.0.0.dmg + Empyrean-1.0.0-arm64.dmg
npm run build:win     # produces Empyrean-Setup-1.0.0.exe
npm run build:linux   # produces Empyrean-1.0.0.AppImage
```

**On the first run of `build:mac`, macOS may pop up a permission prompt.** Allow it.

If `build:win` errors out about Wine missing, install it: `brew install --cask wine-stable` (requires Homebrew). For tomorrow's specimen submission, **macOS alone satisfies USPTO Class 9** — Windows is a nice-to-have, not a must-have. If Windows compilation fails, ship without it.

---

## 5. Verify the binaries

```bash
ls -la dist/
```

You should see roughly:
```
Empyrean-1.0.0.dmg              # macOS Intel
Empyrean-1.0.0-arm64.dmg        # macOS Apple Silicon
Empyrean-Setup-1.0.0.exe        # Windows installer (if Wine succeeded)
Empyrean-1.0.0.AppImage         # Linux portable
```

**Smoke-test the macOS .dmg:** Double-click `Empyrean-1.0.0.dmg` (or the arm64 version if you're on M1/M2/M3/M4). A window should open showing the Empyrean app icon. Drag it to Applications. Open it from Applications.

**On first launch, macOS will say "Empyrean cannot be opened because the developer cannot be verified."** This is expected for unsigned software. Fix:

> Right-click (or Ctrl+click) the Empyrean icon in Applications → Open → confirm "Open" in the dialog.

After this one-time bypass, the app launches normally on every subsequent open. You should see the Beatific Vision splash, then the main catalog window.

**This is the proof the software works.** If the app launches and shows the BV mark, you have a Class 9 specimen.

---

## 6. Upload binaries to the website

The website is configured to look for downloads at `/downloads/Empyrean-1.0.0.dmg` and `/downloads/Empyrean-Setup-1.0.0.exe`.

In the website folder (one level up from `empyrean-app/`):

```bash
mkdir -p downloads
cp empyrean-app/dist/Empyrean-1.0.0.dmg downloads/
cp empyrean-app/dist/Empyrean-Setup-1.0.0.exe downloads/   # if Windows built
cp empyrean-app/dist/Empyrean-1.0.0.AppImage downloads/    # if Linux built
```

Now when the site deploys to Vercel, the download buttons on `/app` will work.

---

## 7. Commit and deploy

See `DEPLOYMENT.md` (in the website root) for the full Vercel/NameSilo deployment runbook. The short version:

```bash
cd ..  # back to the website root
git add downloads/
git commit -m "Add Empyrean v1.0.0 binaries"
git push
```

Vercel will redeploy automatically within ~30 seconds.

---

## What the app does

Empyrean is a native desktop application that displays the Beatific Vision catalog and plays films from it. The app:

1. **Splash screen** on launch — shows the Beatific Vision script wordmark and "Empyrean" sub-brand for ~2 seconds, with the tagline *Per visum, ad gloriam*.
2. **Main window** — a catalog grid with film tiles. Currently shows "The Most Beautiful Thing This Side of Heaven" plus placeholder slots for partner films and forthcoming originals.
3. **Native menus** — File, Edit, View, Window, Help, with macOS-conventional placement and shortcuts.
4. **Branded chrome throughout** — the BEATIFIC VISION mark appears in the title bar, the sidebar, the about dialog, and the footer status bar.

For specimen purposes, what matters is that:
- The software exists as a downloadable installer ✓
- It runs on a normal Mac/Windows install ✓
- The BEATIFIC VISION mark appears in the app, on the download page, and in the file's metadata ✓
- The app is offered as a downloadable product under the mark ✓

That's the Class 9 specimen. Bess and Joe will screenshot the `/app` page and the running app, and submit both with the SOU.

---

## Troubleshooting

**`npm install` hangs or fails partway through.** Network issue. Try `npm install --no-audit --no-fund` and let it finish. If still stuck, try a different network (mobile hotspot works fine).

**Build error: "Cannot find module 'electron'".** Run `npm install` again. The first install may have been interrupted.

**Build error: "Cannot find icon file".** Check that `build/icon.png` exists. If somehow missing, the file should be at `empyrean-app/build/icon.png` — re-download from the website source.

**The .dmg won't open after building.** Sometimes macOS holds onto a stale signature cache. Run: `xattr -cr dist/Empyrean-1.0.0.dmg` then try again.

**Smoke test fails — app launches but shows blank window.** Open Empyrean → menu bar → View → Toggle Developer Tools. Check Console for errors. Common issue: a relative path in `src/index.html` doesn't resolve. Compare against the source you received.

---

## What to send to Bess and Joe

Once `npm run build:mac` succeeds and you've smoke-tested, the three artifacts that matter are:

1. **The .dmg file** — `dist/Empyrean-1.0.0.dmg` — the actual downloadable software
2. **A screenshot of the running app** — Cmd+Shift+4 → space bar → click the Empyrean window → captures the app showing the BV mark
3. **The /app page on the live website** — once deployed, screenshot https://beatificvision.com/app showing the working download button

Those three together are the Class 9 specimen package.

*Per visum, ad gloriam.*
