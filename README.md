# Random Stuff

[![Stack](https://img.shields.io/badge/stack-Next.js%2016%20%2B%20React%2019-green)](https://github.com/nipunyatawara-dev/random-stuff-site)
[![Deployment](https://img.shields.io/badge/hosting-Vercel-black)](https://randomstuff.shocka.site/)

---

### Links

* [Live site](https://randomstuff.shocka.site/)
* [Submit a tool](https://randomstuff.shocka.site/submit)

---

Random Stuff is a directory of useful websites, desktop apps, and scripts.

* Directory of tools across websites, software, and scripts
* Search and tag filtering by platform (macOS, Windows, Linux, web)
* Automatic favicon and metadata previews
* Submission form connected to a Discord review channel

# Contents

- [Key features](#key-features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Local development](#local-development)
- [Star history](#star-history)
- [Contributing](#contributing)

# Key features

### Discovery and filtering
* Filter by category: Websites, Softwares, and Scripts
* Filter by platform tag (`#macos`, `#windows`, `#linux`, `#android`, `#ios`)
* Live search across titles, descriptions, and tags
* Badge indicator on recently added items

### Visual and motion
* Three.js background canvas with particle effects
* Lenis smooth scrolling with Framer Motion transitions
* Favicon resolution via Google S2 service
* High-contrast dark theme with category accent highlights

### Submissions and review
* Submission form at `/submit`
* URL duplicate detection against existing items
* Discord webhook notifications for maintainer review

# Architecture

Next.js 16 web application with static data bundling:

```
src/
 ├── app/                      # Next.js App Router (pages, layout, submit API)
 ├── components/               # UI views, filter controls, item cards, canvas
 ├── data/                     # Bundled items dataset (items.ts)
 ├── hooks/                    # Custom React hooks (favorites, media queries)
 └── lib/                      # Helper utilities and search index
```

| Layer | Key files | Responsibility |
| --- | --- | --- |
| **UI and layout** | `src/app/page.tsx`, `src/components/ContentSection.tsx` | Grid display, filter controls, search bar, modals |
| **Canvas background** | `src/components/GridBackground.tsx`, `src/components/ConstellationWords.tsx` | Interactive background graphics and text constellation |
| **Dataset** | `src/data/items.ts` | Static item records, category assignments, and metadata |
| **Submissions** | `src/app/submit/page.tsx`, `src/app/api/submit/route.ts` | Submission form and Discord webhook handler |

# Tech stack

| Area | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, PostCSS |
| **Motion** | Framer Motion, Lenis |
| **3D & Canvas** | Three.js |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

# Local development

### Prerequisites

* Node.js 20+
* npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nipunyatawara-dev/random-stuff-site.git
   cd random-stuff-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

### Typecheck and lint

```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Tests
npm test
```

Build for production:

```bash
npm run build
npm run start
```

# Star history

<a href="https://www.star-history.com/?repos=nipunyatawara-dev%2Frandom-stuff-site&type=date&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=nipunyatawara-dev/random-stuff-site&type=date&legend=bottom-right" />
 </picture>
</a>

# Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feat/add-new-tool`)
3. Add the item record to `src/data/items.ts`
4. Verify with `npx tsc --noEmit && npm test`
5. Open a pull request

You can also submit tools directly via the [submission page](https://randomstuff.shocka.site/submit).

---

Built by [Nipun Yatawara / ShockaGG](https://shocka.site/).
