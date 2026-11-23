# SunnyRx Blog Migration Handoff (Jekyll/Hux -> Astro/Fuwari)

> **Branch**: `feat/astro-fuwari` (branched from `master`)  
> **Template Base**: [saicaca/fuwari](https://github.com/saicaca/fuwari) (Astro 5 + Tailwind CSS + Pagefind + Swup + Expressive Code)  
> **Target Audience**: Repository owner (PR review) and any downstream coding agent (Cursor / Windsurf / Claude Code / Codex) taking over local build verification, visual polish, and post-launch Twikoo integration.

## 1. How to Import This Branch and Open a PR

From your local clone of `SunnyRx/SunnyRx.github.io`:

```bash
# 1. Import the feat/astro-fuwari branch from the bundle
git fetch /path/to/fuwari-migration.bundle feat/astro-fuwari:feat/astro-fuwari

# 2. Switch to the branch and verify locally (requires Node >= 20 and pnpm 9)
git checkout feat/astro-fuwari
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm preview

# 3. Push branch and open a Pull Request on GitHub
git push -u origin feat/astro-fuwari
```

> **Important GitHub Pages setting before merging to `master`**:  
> Go to **Repository Settings -> Pages -> Build and deployment -> Source** and switch from **Deploy from a branch** to **GitHub Actions**. Once merged to `master`, `.github/workflows/deploy.yml` will build the site + Pagefind index and deploy `./dist` automatically.

## 2. What Has Been Completed

1. **Template & Site Configuration (`src/config.ts`, `astro.config.mjs`, `src/layouts/Layout.astro`)**
   - Migrated site title (`Weekend / 热心的博客`), default language (`zh_CN`), banner (`/img/home-bg.webp`), avatar (`/img/avatar-rx.webp`), bio, social links (Twitter/X, Steam, GitHub), and license (`CC BY-NC-ND 4.0`).
   - Preserved custom domain (`public/CNAME` -> `sunnyrx.com`), AdSense (`public/ads.txt`), Google Search Console verification meta tag, and GA4 (`G-4E2ZXH489S`).
   - Configured `site: "https://sunnyrx.com"` and mounted 42 legacy URL redirects.

2. **42 Posts Migrated & Cleaned (`src/content/posts/*.md`)**
   - Converted all 42 posts (24 `.markdown` + 18 `.md`) to Fuwari's schema (`title`, `published`, `description`, `image`, `tags`, `category`, `draft`, `lang`, `translationKey`).
   - Normalized filenames to lowercase `.md` (including fixing the duplicated date prefix on `2026-03-06-2026-03-06-thoughts-on-openclaw-memory.md` -> `thoughts-on-openclaw-memory.md`).
   - Replaced all 3 legacy Jekyll Liquid usages:
     - `game-design-talk-about-fragments-of-memory.md`: `{% include animation.html ... %}` -> HTML5 `<video autoplay loop muted playsinline ...>`.
     - `from-nobelium-to-jekyll.md` & `how-i-use-ai-with-brower.md`: `{% post_url ... %}` -> `/posts/<slug>/`.
   - Copied the entire `/img/` directory (164 references) into `public/img/`.

3. **Legacy URL Preservation (`src/data/legacy-redirects.ts`)**
   - All 42 historical Jekyll `permalink: pretty` URLs (`/<YYYY>/<MM>/<DD>/<raw-slug>/`) are mapped to `/posts/<slug>/` via Astro `redirects` in `astro.config.mjs`.

4. **Standalone Pages & Friends**
   - Migrated `about`, `works`, and `tools` into `src/content/spec/{about,works,tools}.md` with dedicated pages at `/about/`, `/works/`, and `/tools/`.
   - Preserved the 8 friend links in `src/data/friends.ts` and rendered them inside `src/content/spec/about.md`.

5. **Bilingual Support (Chinese + Japanese Ready)**
   - Extended `src/content/config.ts` with `translationKey`.
   - Updated `src/utils/url-utils.ts` and `src/utils/content-utils.ts` so default homepage, pagination, archive, tags, and RSS only list Chinese posts, while Japanese posts live under `src/content/posts/ja/` and route to `/ja/posts/<slug>/`.
   - Added `/ja/` index page (`src/pages/ja/index.astro`) and `/ja/posts/[...slug].astro`.
   - Both Chinese and Japanese post templates automatically render a `中文 / 日本語` switcher bar and inject `<link rel="alternate" hreflang="..." />` + `x-default` in `<head>` whenever two posts share the same `translationKey`.

6. **CI / CD (`.github/workflows/deploy.yml`)**
   - Runs `pnpm check` and `pnpm build` on every Pull Request and push to `master`.
   - Automatically deploys `./dist` to GitHub Pages on `master`.

## 3. Verification Status (Completed in Sandbox Node 22.14 + pnpm 9.14.4)

- [x] `pnpm install --frozen-lockfile` passed (1,115 packages).
- [x] `pnpm check` passed with **0 errors, 0 warnings** (also fixed upstream Fuwari Svelte/TS check issues in `LightDarkSwitch.svelte` and `ArchivePanel.svelte`).
- [x] `pnpm build` passed: built 53 static pages + 42 legacy redirect pages (`dist/`) and indexed 45 pages / 4,384 words with Pagefind v1.4.0.
- [x] Verified all 42 legacy redirect HTML files and target `/posts/<slug>/index.html` exist in `dist/` (fixed `cocos2dx-34-editbox-instructions` slug dot-stripping mismatch, plus Windows backslash image paths in `protect-the-nas.md` and `the-list-of-synology-3th-party-package-sources.md`).
- [ ] **Remaining manual visual check**: Run `pnpm preview` locally to visually inspect desktop & mobile layout (home banner, `/works/`, `/tools/`, `/about/`, `/ja/`, and `<video>` playback in `game-design-talk-about-fragments-of-memory`).

## 4. How to Author a Japanese Translation Later

To add a Japanese version of any Chinese post (for example `thoughts-on-openclaw-memory.md`):

1. Create `src/content/posts/ja/thoughts-on-openclaw-memory.md`.
2. Set frontmatter with `lang: "ja"` and the **exact same `translationKey`** as the Chinese post:
   ```yaml
   ---
   title: "OpenClaw の記憶をめぐる課題と模索"
   published: 2026-03-06
   description: "AI の記憶に関する体験と考察"
   image: "/img/post-bg-gray.webp"
   tags: ["AI", "OpenClaw", "エッセイ"]
   category: ""
   draft: false
   lang: "ja"
   translationKey: "thoughts-on-openclaw-memory"
   ---
   ```
3. Build & push: the post will appear at `/ja/posts/thoughts-on-openclaw-memory/` and `/ja/`, and both the Chinese and Japanese pages will automatically display the language switcher and `hreflang` tags.

## 5. Planned Phase 2 (Post-Launch): Anonymous Comments via Twikoo

- Owner explicitly requested **anonymous commenting support** and chose **Twikoo** (to be integrated after the migrated blog goes live).
- Mount point is marked with a comment in both:
  - `src/pages/posts/[...slug].astro`
  - `src/pages/ja/posts/[...slug].astro`
- **Swup gotcha**: Fuwari uses `@swup/astro` for SPA-like page transitions. When integrating Twikoo, initialize it on initial load **and** hook into `window.swup.hooks.on("content:replace", initTwikoo)` so comments reload properly on client-side navigation.
- Configure Twikoo admin settings to make Nickname / Email / Website optional for true anonymous commenting.
