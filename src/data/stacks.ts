export interface CuratedStack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: "terminal" | "globe" | "monitor" | "sparkles";
  itemIds: string[];
}

export const CURATED_STACKS: CuratedStack[] = [
  {
    id: "mac-powerpack",
    title: "Minimalist Mac Powerpack",
    tagline: "High-productivity essentials for macOS powerusers",
    description: "The ultimate curated collection of lightweight, blazing-fast window managers, launchers, and utilities.",
    badge: "macOS • 8 Tools",
    iconName: "monitor",
    itemIds: [
      "softwares-raycast",
      "softwares-playcover",
      "softwares-popcorn-time",
      "softwares-brisk",
      "softwares-mole",
      "softwares-mounty",
      "softwares-boring-notch",
      "softwares-utm",
    ],
  },
  {
    id: "web-studio",
    title: "Web Design & Frontend Studio",
    tagline: "World-class design assets, palettes, and components",
    description: "Everything you need to craft high-converting, Awwwards-quality web experiences and micro-interactions.",
    badge: "Design • 8 Tools",
    iconName: "sparkles",
    itemIds: [
      "websites-react-bits",
      "websites-fmhy",
      "websites-awesome-swift-apps",
      "websites-cobalt",
      "websites-vert",
      "websites-isocons",
      "websites-shader-gradient",
      "websites-excalidraw",
    ],
  },
  {
    id: "cli-hacker",
    title: "Terminal & CLI Hacker",
    tagline: "Modern command-line scripts and multiplexers",
    description: "Supercharge your shell with modern terminal emulators, fuzzy finders, debloaters, and system scripts.",
    badge: "CLI • 8 Tools",
    iconName: "terminal",
    itemIds: [
      "softwares-tabby",
      "scripts-ffmpeg-script",
      "scripts-chris-titus-winutil",
      "scripts-mas",
      "scripts-win11debloat",
      "scripts-cloudflare-error-page",
      "scripts-scrapy",
      "scripts-dither",
    ],
  },
  {
    id: "ai-lab",
    title: "Local AI & Automation Lab",
    tagline: "Run local models, autonomous agents, and AI vision",
    description: "Curated collection of offline local LLM runtimes, AI code assistants, and generative pipelines.",
    badge: "AI • 6 Tools",
    iconName: "globe",
    itemIds: [
      "softwares-cline",
      "softwares-lm-studio",
      "softwares-facefusion",
      "softwares-droppy",
      "softwares-open-researcher",
      "softwares-gemini-watermark-remover",
    ],
  },
];
