# Random Stuff Site

[![Stack](https://img.shields.io/badge/stack-Next.js%2016%20%2B%20React%2019-green)](https://github.com/nipunyatawara-dev/random-stuff-site)
[![Deployment](https://img.shields.io/badge/hosting-Vercel-black)](https://randomstuff.shocka.site/)

---

### Get started

* [Live Site](https://randomstuff.shocka.site/)
* [Submit a Tool](https://randomstuff.shocka.site/submit)
---

**Random Stuff** by ShockaGG is a curated directory of websites, desktop software, tools, and scripts worth keeping around.

* **Curated catalog** of handpicked tools across Websites, Softwares, and Scripts
* **Instant search & tag filtering** to find exact utilities in milliseconds
* **Automated Favicon & Metadata extraction** for clean visual presentation
* **Community submission pipeline** with direct Discord review integration

# Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Star History](#star-history)
- [Contributing](#contributing)

# Key Features

### 🔍 Discovery & Filtering
* Categorized by **Websites**, **Softwares**, and **Scripts**
* Tag-based filtering (`#macos`, `#windows`, `#linux`, `#terminal`, etc.)
* Real-time search across titles, descriptions, and tags
* Badge indicator for newly added items

### 🎨 Visual & Experience
* **Three.js & Postprocessing canvas** rendering interactive background particle effects
* **Lenis smooth scroll** coupled with fluid **Framer Motion** card transitions
* Automatic Google S2 Favicon service resolution for item icons
* High contrast dark design system with category accent highlights

### 📤 Submissions & Community
* In-app submission portal at `/submit`
* Automated duplication checking against existing dataset
* Webhook notifications sent directly to Discord for maintainer review

# Architecture

The app is built as a fast, statically-generatable Next.js 16 web application:

```
src/
 ├── app/                      # Next.js App Router (pages, layout, submit API)
 ├── components/               # UI views, filter controls, item cards, 3D background
 ├── data/                     # Bundled items dataset (items.ts)
 ├── hooks/                    # Custom React hooks (search, media queries, scroll)
 └── lib/                      # Helper utilities and external API callers
```

| Layer | Key Files | Responsibility |
| --- | --- | --- |
| **UI & Layout** | `src/app/page.tsx`, `src/components/ContentSection.tsx` | Main grid display, filter bars, search input, responsive layouts |
| **3D Shader Engine** | `src/components/ConstellationCanvas.tsx` | Custom WebGL background shaders via Three.js & Postprocessing |
| **Dataset & Engine** | `src/data/items.ts` | Static dataset, automatic slugification, favicon generation, `isNew` tagging |
| **Submission Pipeline**| `src/app/submit/page.tsx`, `src/app/api/submit/route.ts` | Tool submission form and Discord review webhook dispatch |

# Tech Stack

| Area | Tech |
| --- | --- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, PostCSS |
| **Animations** | Framer Motion, Lenis Smooth Scroll |
| **Visuals & 3D** | Three.js, Postprocessing WebGL shaders |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

# Local Development

### Prerequisites

* Node.js 20+
* npm

### Run locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nipunyatawara-dev/random-stuff-site.git
   cd random-stuff-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

### Verification & Build

Run type checks before opening a PR:

```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint
```

To preview the production build locally:

```bash
npm run build
npm run start
```

# Star History

<a href="https://www.star-history.com/?repos=nipunyatawara-dev%2Frandom-stuff-site&type=date&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&legend=bottom-right" />
 </picture>
</a>

# Contributing

Contributions and item submissions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/add-new-tool`)
3. Add your tool entry to `src/data/items.ts`
4. Verify with `npx tsc --noEmit`
5. Push and open a Pull Request

You can also submit tools directly via the [Submit a tool](https://randomstuff.shocka.site/submit) page without creating a PR.

---

> Built by [Nipun Yatawara / ShockaGG](https://shocka.site/).
> 
> Feedback and bug reports are welcome via [GitHub Issues](https://github.com/nipunyatawara-dev/random-stuff-site/issues).
