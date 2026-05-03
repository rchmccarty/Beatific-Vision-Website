# BEATIFIC VISION — DEPLOYMENT RUNBOOK

**Audience:** Ryan, deploying the website to Vercel and pointing beatificvision.com at it tomorrow.
**Time required:** ~25 minutes if everything goes smoothly. Allow 1 hour total to account for DNS propagation.
**Result:** https://beatificvision.com live, with a working /app page that hosts the Empyrean download.

---

## TL;DR — the deployment in 4 commands

If you already have a Vercel account, the GitHub CLI installed, and you've done deploys before:

```bash
cd beatific-vision-website
git init && git add . && git commit -m "Initial site"
gh repo create beatific-vision-website --private --source=. --push
vercel --prod
# Then add beatificvision.com as a custom domain in the Vercel dashboard,
# and copy the DNS instructions to NameSilo.
```

If any of that was unfamiliar, work through the long version below.

---

## 1. Prerequisites

You'll need accounts at:

- **GitHub** (https://github.com) — free
- **Vercel** (https://vercel.com) — free Hobby plan is sufficient
- **NameSilo** (where beatificvision.com is registered) — already have it

Tools on your Mac:

```bash
git --version             # should return a version
brew install gh           # GitHub CLI, optional but easier
npm install -g vercel     # Vercel CLI, also optional
```

---

## 2. Get the website source onto your Mac

Whatever folder I delivered the website files in — call it `beatific-vision-website/` — should be on your Mac. The folder contains:

```
beatific-vision-website/
├── index.html              ← the homepage
├── styles.css              ← shared stylesheet (do NOT delete)
├── logo.jpg                ← the BV composite mark
├── fonts/                  ← self-hosted Italianno + Cinzel + Cormorant Garamond
├── img/empyrean/           ← Empyrean app screenshots used on /app
├── watch/index.html        ← /watch route
├── listen/index.html       ← /listen route
├── read/index.html         ← /read route
├── app/index.html          ← /app route (Empyrean download)
├── about/index.html        ← /about route
├── cfi/index.html          ← /cfi route
├── support/index.html      ← /support route
├── legal/index.html        ← /legal route
├── empyrean-app/           ← the Electron source (build separately)
└── DEPLOYMENT.md           ← this file
```

Once you've built Empyrean per `empyrean-app/BUILD_INSTRUCTIONS.md`, you'll also have:

```
beatific-vision-website/
├── downloads/              ← create this when you have binaries
│   ├── Empyrean-1.0.0.dmg
│   ├── Empyrean-Setup-1.0.0.exe   (optional)
│   └── Empyrean-1.0.0.AppImage    (optional)
```

The download buttons on `/app` are pre-wired to look for `/downloads/Empyrean-1.0.0.dmg` and `/downloads/Empyrean-Setup-1.0.0.exe`. As soon as those files exist in the deployed `downloads/` folder, the buttons work.

---

## 3. Sanity-test locally first

Before deploying to Vercel, verify the site works on your Mac. In Terminal:

```bash
cd beatific-vision-website
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. The homepage should load with the Italianno script "Beatific" wordmark, the dark cloudscape hero, and the four pillars. Click each nav link and verify each page loads.

When you're satisfied, hit Ctrl+C in Terminal to stop the local server.

---

## 4. Initialize Git and push to GitHub

In Terminal:

```bash
cd beatific-vision-website

# Initialize a git repository
git init
git branch -M main

# .gitignore — exclude binary builds and node_modules
cat > .gitignore << 'EOF'
node_modules/
empyrean-app/node_modules/
empyrean-app/dist/
.DS_Store
*.log
.vercel
EOF

# First commit
git add .
git commit -m "Initial site — Beatific Vision launch"
```

Now push to GitHub. Two options:

**Option A — using GitHub CLI (faster):**

```bash
gh auth login           # follow prompts, paste browser code, etc.
gh repo create beatific-vision-website --private --source=. --push
```

**Option B — using the GitHub website:**

1. Go to https://github.com/new
2. Repository name: `beatific-vision-website`
3. Set it to Private
4. Do NOT initialize with README
5. Click "Create repository"
6. On the next screen, GitHub shows you commands. Run the ones under "...or push an existing repository from the command line":

```bash
git remote add origin https://github.com/YOUR-USERNAME/beatific-vision-website.git
git push -u origin main
```

Verify the push worked: visit your repo on github.com and confirm the files are there.

---

## 5. Connect Vercel to the GitHub repo

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. If this is your first time, authorize Vercel to access your GitHub account
4. Find `beatific-vision-website` in the list and click **Import**
5. On the configuration screen:
   - **Framework Preset:** Other (it's static HTML — Vercel auto-detects)
   - **Root Directory:** `./` (default)
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
6. Click **Deploy**

In ~20 seconds, Vercel finishes and gives you a URL like `beatific-vision-website-abc123.vercel.app`. Click it. Verify the site loads. **This is the live deploy** — every URL on the production site is now live, just at a temporary Vercel domain.

---

## 6. Add the custom domain (beatificvision.com)

In the Vercel dashboard for the project:

1. Click **Settings** → **Domains**
2. In the input field, type `beatificvision.com` and click **Add**
3. Vercel will show you DNS records you need to add to NameSilo. **Keep this tab open** — you'll need these values in the next step.

Vercel will tell you to add either:
- An **A record** at `@` pointing to `76.76.21.21` (Vercel's anycast IP)
- Or a **CNAME** at `@` pointing to `cname.vercel-dns.com`

Either works. The A record is more universal; use that.

Vercel will also ask you to add `www`:
- A **CNAME** at `www` pointing to `cname.vercel-dns.com`

---

## 7. Configure NameSilo DNS

1. Log in to NameSilo: https://www.namesilo.com/account_login.php
2. Navigate to **Account Home → Manage My Domains**
3. Click on **beatificvision.com**
4. In the domain manager, find the **DNS Records** section (or "DNS Manager" link)
5. Add the records Vercel told you to add:

**Record 1 (root domain):**
| Field    | Value          |
|----------|----------------|
| Type     | A              |
| Hostname | (leave blank, or `@`) |
| Value    | `76.76.21.21`  |
| TTL      | 3600           |

**Record 2 (www subdomain):**
| Field    | Value                       |
|----------|-----------------------------|
| Type     | CNAME                       |
| Hostname | `www`                       |
| Value    | `cname.vercel-dns.com`      |
| TTL      | 3600                        |

**If existing A or CNAME records for `@` or `www` are already there** (e.g., NameSilo's parking page), **delete them** before adding the Vercel records. NameSilo won't accept conflicting records.

Click Save. **DNS propagation typically takes 5-30 minutes.** Sometimes it's nearly instant; rarely it can take a few hours.

---

## 8. Watch Vercel verify the domain

Back in the Vercel **Settings → Domains** tab, you'll see beatificvision.com show "Pending verification" or "Configuring..." for a few minutes. Once DNS propagates, it'll switch to "Valid Configuration" with a green checkmark, and Vercel will auto-provision an SSL certificate. **At that point, https://beatificvision.com is live.**

While you wait, you can check propagation status with:

```bash
dig +short beatificvision.com
# Should eventually return: 76.76.21.21
```

Or in the browser, https://www.whatsmydns.net/#A/beatificvision.com

---

## 9. Post-deploy verification

Once the domain shows green in Vercel, visit https://beatificvision.com and walk through this checklist:

- [ ] **Homepage loads** with Italianno "Beatific" script wordmark in the hero
- [ ] **Nav works** — Watch / Listen / Read / Apps / About / CFI / Support all clickable
- [ ] **/watch loads** with "The Most Beautiful Thing This Side of Heaven" featured
- [ ] **/listen loads** with the Catholica Cinematica section and Episode I
- [ ] **/read loads** with article cards
- [ ] **/app loads** showing the Empyrean download landing
- [ ] **/about loads** with founder letter and timeline
- [ ] **/cfi loads** with apostolate content
- [ ] **/support loads** with newsletter form + CFI donate link
- [ ] **/legal loads** with trademark notices
- [ ] **Footer link to qgiv** works (https://secure.qgiv.com/for/catholicfilminstitute)
- [ ] **HTTPS works** — green padlock in browser
- [ ] **www redirect works** — https://www.beatificvision.com redirects to https://beatificvision.com (or vice-versa, Vercel does this automatically)

If anything breaks, the fastest fix is usually to git push a correction and Vercel will redeploy automatically.

---

## 10. Add Empyrean binaries

Once you've followed `empyrean-app/BUILD_INSTRUCTIONS.md` and have at least the macOS .dmg compiled:

```bash
cd beatific-vision-website
mkdir -p downloads
cp empyrean-app/dist/Empyrean-1.0.0.dmg downloads/
cp empyrean-app/dist/Empyrean-Setup-1.0.0.exe downloads/   # if you built it
cp empyrean-app/dist/Empyrean-1.0.0.AppImage downloads/    # if you built it

git add downloads/
git commit -m "Add Empyrean v1.0.0 binaries"
git push
```

Vercel automatically redeploys. Within 30-60 seconds, https://beatificvision.com/downloads/Empyrean-1.0.0.dmg will be live, and the download buttons on /app will work.

**Verify:** visit https://beatificvision.com/app, click "Download for macOS · Universal." Your browser should download the .dmg.

---

## 11. The package for Bess and Joe

For the USPTO Statement of Use submission, the specimen package consists of:

| Class | Specimen Type                  | Source                                                        |
|-------|--------------------------------|---------------------------------------------------------------|
| 9     | Downloadable software          | The /app page + the running Empyrean app + the .dmg file      |
| 38    | Streaming/broadcasting         | The /watch page showing streaming services under the BV mark  |
| 41    | Entertainment (films, podcast, articles) | /watch + /listen + /read pages                       |
| 42    | SaaS                           | The /watch page (the streaming functionality is itself SaaS)  |

**For each class, the screenshot deliverable is:**

1. The relevant page on the live website (full-screen capture with URL bar visible)
2. The BEATIFIC VISION mark visible in that page
3. The services or software offered under that mark visible in that page

Bess and Joe will know exactly which images to attach. Send them the live URLs and they'll handle the screenshots and submission.

---

## 12. Optional but recommended: Google Workspace email

To send mail from `rchmccarty@beatificvision.com` (which appears throughout the site as your contact address), you'll need MX records pointing to a mail provider. Google Workspace ($6/user/month for the Business Starter plan) is the standard.

1. Sign up at https://workspace.google.com using `beatificvision.com`
2. Google walks you through verification (a TXT record at your domain root, then MX records)
3. All those DNS records go in NameSilo alongside the Vercel records you added in step 7
4. Once verified, you can send and receive at rchmccarty@beatificvision.com via Gmail

This is not blocking for the SOU submission. The contact links on the site (`mailto:rchmccarty@beatificvision.com`) work as long as you have any mail server pointed at the domain — but for tomorrow, the website + Empyrean binaries are what matter.

---

## Troubleshooting

**Vercel says "Domain configuration is invalid" after 30 minutes.** DNS propagation can sometimes take longer. Use https://www.whatsmydns.net to confirm your A record is live globally. If it isn't propagating, double-check the record values in NameSilo.

**Site loads but fonts look wrong.** Hard-refresh your browser (Cmd+Shift+R). Browsers cache CSS aggressively. If still wrong, check the Vercel deploy log — it should report `fonts/` as deployed.

**404 errors on /watch, /listen, etc.** Vercel by default serves `/watch/index.html` when you request `/watch`. If for some reason you're getting 404s, add a `vercel.json` to the project root:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

Commit and push; Vercel redeploys.

**Download button on /app produces a 404.** The binary isn't in `downloads/` on the deployed site, or has a different filename. Confirm the file exists at `https://beatificvision.com/downloads/Empyrean-1.0.0.dmg`. If you named it differently, edit `app/index.html` to match (search for `dl-mac` and `dl-win` href attributes).

**Need to update the site after deploying.** Just edit files locally, then `git add -A && git commit -m "..." && git push`. Vercel redeploys automatically. There's no separate publish step.

---

## What's next, after tomorrow

This shipped version is intentionally a static site for speed-of-delivery. Once the SOU is filed and you have breathing room, the path forward is:

1. **Migrate to Next.js.** Same files, but reorganized into `pages/` or `app/` directory structure with React components. Lets you add interactive features (real video player, member login, comments, etc.) without rewriting the design.
2. **Set up forms.** The newsletter signup currently submits to a placeholder. Wire it to ConvertKit, Beehiiv, or Mailchimp.
3. **Add CMS.** As the catalog grows, manage films/episodes/articles in a CMS (Sanity, Contentlayer, or Notion-as-CMS) instead of editing HTML files.
4. **Real video streaming.** Use Mux, Cloudflare Stream, or a self-hosted solution for the /watch page. The current page shows the structure; we just need to wire the players.
5. **Apple Developer + Windows EV cert.** ~$400/year combined. Lets you sign Empyrean so users don't see "unverified developer" warnings.

None of that is required for tomorrow. Tomorrow we ship.

*Per visum, ad gloriam.*
