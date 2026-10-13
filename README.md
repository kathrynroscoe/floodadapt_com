# floodadapt.com — interim website

A static one-page site (HTML, CSS, a little JavaScript). No build step. Hosted free on GitHub Pages.

```
index.html          page content
styles.css          design
main.js             scenario sentence, video embeds, contact form
CNAME               tells GitHub Pages the custom domain (floodadapt.com)
assets/favicon.svg
assets/img/         images (add more here)
assets/video/       optional self-hosted videos (create if needed)
```

Preview locally: open `index.html` in a browser. Locally, empty image and video slots show as dashed/dark placeholders. On the live site, empty slots are hidden automatically.

---

## 1. Put it on GitHub

1. On github.com, create a new **public** repository, e.g. `floodadapt-website` (GitHub Pages is free for public repos).
2. Upload all files in this folder (drag and drop on the repo page works), keeping the folder structure. Commit to `main`.
3. In the repo: **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`. Save.
4. Still on that page, under **Custom domain**, enter `floodadapt.com` and save. (The `CNAME` file already contains it.)

## 2. Point the domain at GitHub (at your domain registrar)

In the DNS settings where you bought floodadapt.com, remove any existing parking A/CNAME records for `@` and `www`, then add:

| Type  | Name / Host | Value |
|-------|-------------|-------|
| A     | @           | 185.199.108.153 |
| A     | @           | 185.199.109.153 |
| A     | @           | 185.199.110.153 |
| A     | @           | 185.199.111.153 |
| AAAA  | @           | 2606:50c0:8000::153 |
| AAAA  | @           | 2606:50c0:8001::153 |
| AAAA  | @           | 2606:50c0:8002::153 |
| AAAA  | @           | 2606:50c0:8003::153 |
| CNAME | www         | YOUR-GITHUB-USERNAME.github.io |

DNS changes take from minutes to a day. When GitHub's Pages settings show the DNS check as successful, tick **Enforce HTTPS** (the certificate can take up to an hour to appear).

Recommended: verify the domain under your GitHub account (**Settings → Pages → Add a verified domain**) so no one else can claim it on GitHub Pages.

## 3. Connect the contact form (Formspree)

GitHub Pages can't process forms, so the form posts to Formspree, which emails you each message.

1. Create a free account at formspree.io and create a new form. Set the email address messages should go to.
2. Copy the form ID (the part after `/f/` in the endpoint, e.g. `xyzabcd`).
3. In `index.html`, replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"`.
4. Send yourself a test message from the live site and confirm Formspree's verification email.

Until step 3 is done, the form shows "The form isn't connected yet" instead of sending.

## 4. Add images

- Save images in `assets/img/` as JPG (photos, screenshots) around 1600–2000 px wide, ideally under 400 KB.
- The "Clear, actionable insights" section has an empty slot for an infographic or benefits screenshot. Follow the comment in `index.html` to replace it.
- To swap the large hero image, replace `assets/img/charleston-3d.jpg` or change its `src`.

## 5. Add videos

In the "See it in action" section of `index.html`, each video is a `<figure class="video">`:

- **YouTube (recommended):** put the video ID in `data-youtube=""`. For `https://www.youtube.com/watch?v=AbC123xyz`, the ID is `AbC123xyz`. The page doesn't contact YouTube until a visitor presses play (privacy-friendly, no cookie banner needed), and then uses youtube-nocookie.com.
- **Self-hosted MP4:** put the file in `assets/video/` and set `data-mp4="assets/video/demo.mp4"`. GitHub rejects files over 100 MB; keep them under ~50 MB.
- Edit the `<figcaption>` text to describe each video. Copy a `<figure>` block to add more.

If no videos are set, the live site shows a short "videos are on their way" line instead of empty boxes.

## Privacy notes

- No analytics, no cookies set by this site.
- Fonts load from Google Fonts. If you'd rather avoid any third-party requests, download Schibsted Grotesk, put it in `assets/fonts/`, and replace the Google Fonts `<link>` with an `@font-face` rule.
- Form submissions are processed by Formspree. Mention that in a privacy statement once the company has one.
