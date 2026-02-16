# 🌀 Random Stuff

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> **Random Stuff** is a curated, interactive directory of useful websites, apps, and scripts. It presents content in themed sections, with smooth navigation and filters so users can quickly find tools relevant to their platform (macOS, Windows, or Linux).

---

## ✨ Features

- **🎨 Modern Design**: Sleek UI with a custom grid background, smooth scrolling (Lenis), and a custom cursor.
- **⚡ Fast & Responsive**: Built with Next.js for high performance and optimized for all devices.
- **📂 Curated Collection**: A hand-picked list of the best tools, including **Raycast**, **WizTree**, **Ffmpeg Scripts**, and more.
- **🏷️ Filter by Platform**: Easily sort items by **macOS** 🍎, **Windows** 🪟, or **Linux** 🐧.
- **🎬 Interactive**: Dynamic animations powered by Framer Motion.

---

## 📸 Preview

*Add a screenshot of your home page here to show off the design!*
<!-- ![Home Page](./public/preview.png) -->

| **Hero Section** | **Collection Grid** |
|:---:|:---:|
| <!-- ![Hero](./public/hero-preview.png) --> <br> *Animated Hero Section* | <!-- ![Grid](./public/grid-preview.png) --> <br> *Responsive Item Grid* |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling**: [Lenis](https://github.com/studio-freight/lenis)

---

## 🚀 Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/random-stuff-site.git
    cd random-stuff-site
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open locally:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Data Structure

Items are stored in `src/data/items.ts` with the following structure:
```typescript
interface Item {
  id: number;
  title: string;
  description: string;
  link: string;
  category: "Websites" | "Softwares" | "Scripts";
  tags: string[]; // e.g., ["macos", "windows"]
  image?: string;
}
```

---

## 🤝 Contributing

Contributions are welcome! If you have a useful tool to share:
1.  Fork the repo.
2.  Add your item to `src/data/items.ts`.
3.  Submit a Pull Request.

---

Made with ❤️ by [Your Name]
