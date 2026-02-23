# 🌀 Random Stuff

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> **Random Stuff** is a curated, interactive directory of useful websites, apps, and scripts. It presents content with filters so users can quickly find tools relevant to their platform (macOS, Windows, Linux, iOS, or general utility).

---

## ✨ Features

- **🎨 Modern Design**: Sleek UI with a custom grid background, smooth scrolling (Lenis), and a custom cursor.
- **⚡ Fast & Responsive**: Built with Next.js 16 and React 19 for high performance and optimized for desktop.
- **📂 Curated Collection**: A hand-picked list of the best tools, including **Raycast**, **WizTree**, **Chris Titus WinUtil**, **React Bits**, and more.
- **🏷️ Filter by Platform**: Easily sort items by **All**, **macOS** 🍎, **Windows** 🪟, **Linux** 🐧, or **iOS** 📱.
- **🎬 Interactive**: Dynamic animations powered by Framer Motion and GSAP.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Smooth Scrolling**: [Lenis](https://github.com/studio-freight/lenis)
- **Analytics**: [Vercel Analytics & Speed Insights](https://vercel.com/)

---

## 🚀 Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shockagg/random-stuff-site.git
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
  category: string; // e.g., "Websites", "Softwares", "Scripts"
  tags: string[]; // e.g., ["all", "macos", "windows", "linux", "ios"]
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

Made with ❤️ by Nipun Yatawara [shockagg]
