// 1. Define the shape of an Item
export interface Item {
  id: number;
  title: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
  image?: string; // Optional string (since not all might have images yet)
}

// 2. Export the array with the Item[] type
export const items: Item[] = [
  {
    id: 1,
    title: "React Bits",
    description: "A huge library of animated React components.",
    link: "https://reactbits.dev",
    category: "Websites",
    tags: ["all"],
    image: "https://reactbits.dev/favicon.ico"
  },
  {
    id: 2,
    title: "WizTree",
    description: "Find what's eating your disk space on Windows.",
    link: "https://diskanalyzer.com",
    category: "Softwares",
    tags: ["windows"],
    image: "https://diskanalyzer.com/favicon.ico"
  },
  {
    id: 3,
    title: "Raycast",
    description: "The best launcher for macOS. Replaces Spotlight.",
    link: "https://raycast.com",
    category: "Softwares",
    tags: ["macos"],

  },
  {
    id: 4,
    title: "Ffmpeg Script",
    description: "Quickly convert MKV to MP4 without losing quality.",
    link: "#",
    category: "Scripts",
    tags: ["macos", "windows", "linux"],
    // No image here, which is fine because we made it optional (?)
  },
  {
    id: 101, // Update ID as needed
    title: "Chris Titus WinUtil",
    description: "The ultimate Windows utility to debloat, update, and fix Windows.",
    link: "https://christitus.com/one-tool-for-everything/",
    category: "Scripts",
    tags: ["windows"],

  },
  {
    id: 102,
    title: "PlayCover",
    description: "Run iOS apps and games on Apple Silicon Macs with keyboard support.",
    link: "https://github.com/PlayCover/PlayCover/",
    category: "Softwares",
    tags: ["macos"],
    image: "https://github.com/PlayCover.png"
  },
  {
    id: 103,
    title: "FMHY",
    description: "The largest collection of free stuff on the internet (tools, piracy, etc).",
    link: "https://fmhy.net/",
    category: "Websites",
    tags: ["all"],

  },
  {
    id: 104,
    title: "Github Store",
    description: "A free app store to browse and install apps from GitHub releases.",
    link: "https://github.com/rainxchzed/Github-Store/",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/rainxchzed.png"
  },
  {
    id: 105,
    title: "Awesome Swift Apps",
    description: "A curated list of open-source macOS applications built with Swift.",
    link: "https://github.com/jaywcjlove/awesome-swift-macos-apps/",
    category: "Websites",
    tags: ["macos"],
    image: "https://github.com/jaywcjlove.png"
  },
  {
    id: 106,
    title: "Popcorn Time",
    description: "Watch movies and TV shows instantly via torrent streaming.",
    link: "https://github.com/popcorntime/popcorntime",
    category: "Softwares",
    tags: ["macos", "windows", "linux"],
    image: "https://github.com/popcorntime.png"
  },
  {
    id: 107,
    title: "Brisk",
    description: "An ultra-fast, modern download manager for macOS and Linux.",
    link: "https://github.com/BrisklyDev/brisk/",
    category: "Softwares",
    tags: ["macos", "linux"],
    image: "https://github.com/BrisklyDev.png"
  },
  {
    id: 108,
    title: "Cobalt",
    description: "Download media from YouTube, Twitter, and more without ads or tracking.",
    link: "https://cobalt.tools/",
    category: "Websites",
    tags: ["all"],

  },
  {
    id: 109,
    title: "Mole",
    description: "A terminal tool for deep macOS cleanup and app uninstallation.",
    link: "https://github.com/tw93/Mole",
    category: "Softwares",
    tags: ["macos"],
    image: "https://github.com/tw93.png"
  },
  {
    id: 110,
    title: "Vert",
    description: "Securely convert files locally in your browser using WebAssembly.",
    link: "https://vert.sh/",
    category: "Websites",
    tags: ["all"],

  },
  {
    id: 111,
    title: "Mounty",
    description: "A tiny tool to re-mount write-protected NTFS volumes on macOS.",
    link: "https://mounty.app/",
    category: "Softwares",
    tags: ["macos"],
    image: "https://mounty.app/favicon.ico"
  },
  {
    id: 112,
    title: "Isocons",
    description: "A free collection of customizable isometric icons.",
    link: "https://www.isocons.app/",
    category: "Websites",
    tags: ["all"],

  },
  {
    id: 113,
    title: "Boring Notch",
    description: "Turns your MacBook notch into a dynamic, functional hub.",
    link: "https://github.com/TheBoredTeam/boring.notch/?tab=readme-ov-file",
    category: "Softwares",
    tags: ["macos"],
    image: "https://github.com/TheBoredTeam.png"
  },
  {
    id: 114,
    title: "Darkwrite",
    description: "A distraction-free, eye-candy note-taking and to-do app.",
    link: "https://darkwrite.app/",
    category: "Softwares",
    tags: ["all"],

  },
  {
    id: 115,
    title: "UTM",
    description: "Run virtual machines (Windows, Linux) on iOS and macOS.",
    link: "https://github.com/utmapp/UTM",
    category: "Softwares",
    tags: ["macos"],
    image: "https://github.com/utmapp.png"
  },
  {
    id: 116,
    title: "WinApps",
    description: "Run Windows apps like Office and Adobe on Linux seamlessly.",
    link: "https://github.com/winapps-org/winapps",
    category: "Softwares",
    tags: ["linux"],
    image: "https://github.com/winapps-org.png"
  },
  {
    id: 117,
    title: "EdClub",
    description: "Educational platform for typing, vocabulary, and more.",
    link: "https://www.edclub.com/sportal/",
    category: "Websites",
    tags: ["all"],

  },
  {
    id: 118,
    title: "MAS",
    description: "Microsoft Activation Scripts - Open source Windows/Office activator.",
    link: "https://github.com/massgravel/Microsoft-Activation-Scripts",
    category: "Scripts",
    tags: ["windows"],
    image: "https://github.com/massgravel.png"
  },
  {
    id: 119,
    title: "Katy's Daisies",
    description: "Send virtual flower bouquets and messages to friends.",
    link: "https://www.katysdaisies.com/",
    category: "Websites",
    tags: ["all"],
    image: "https://www.katysdaisies.com/favicon.ico"
  },
  {
    id: 120,
    title: "niri",
    description: "A scrollable-tiling Wayland compositor.",
    link: "https://github.com/YaLTeR/niri",
    category: "Softwares",
    tags: ["linux"],
    image: "https://github.com/YaLTeR.png"
  },
  {
    id: 121,
    title: "Spicetify CLI",
    description: "Command-line tool to customize the Spotify desktop app.",
    link: "https://github.com/spicetify/cli",
    category: "Softwares",
    tags: ["macos", "windows", "linux"],
    image: "https://github.com/spicetify.png"
  },
  {
    id: 122,
    title: "Win11Debloat",
    description: "Debloat and tweak Windows 11.",
    link: "https://github.com/Raphire/Win11Debloat",
    category: "Scripts",
    tags: ["windows"],
    image: "https://github.com/Raphire.png"
  },
  {
    id: 123,
    title: "DockDoor",
    description: "Dock alternative for macOS.",
    link: "https://dockdoor.net/",
    category: "Softwares",
    tags: ["macos"],
    image: "https://dockdoor.net/favicon.ico"
  },
  {
    id: 124,
    title: "Shine",
    description: "Open-source project from Blade04208.",
    link: "https://github.com/Blade04208/shine/",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/Blade04208.png"
  },
  {
    id: 125,
    title: "Gemini Watermark Remover",
    description: "Watermark removal tool.",
    link: "https://github.com/journey-ad/gemini-watermark-remover",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/journey-ad.png"
  },
  {
    id: 126,
    title: "shadPS4",
    description: "PlayStation 4 emulator.",
    link: "https://github.com/shadps4-emu/shadPS4",
    category: "Softwares",
    tags: ["windows", "linux"],
    image: "https://github.com/shadps4-emu.png"
  },
  {
    id: 127,
    title: "Mate Engine",
    description: "Game engine project.",
    link: "https://github.com/shinyflvre/Mate-Engine",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/shinyflvre.png"
  },
  {
    id: 128,
    title: "Cline",
    description: "Open-source AI coding assistant.",
    link: "https://github.com/cline/cline",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/cline.png"
  },
  {
    id: 129,
    title: "FaceFusion",
    description: "Face swap and enhancement toolkit.",
    link: "https://github.com/allenk/facefusion",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/allenk.png"
  },
  {
    id: 130,
    title: "Droppy",
    description: "Self-hosted file sharing app.",
    link: "https://github.com/iordv/Droppy",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/iordv.png"
  },
  {
    id: 131,
    title: "Open Researcher",
    description: "Automated research assistant.",
    link: "https://github.com/firecrawl/open-researcher",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/firecrawl.png"
  },
  {
    id: 132,
    title: "Cloudflare Error Page",
    description: "Custom Cloudflare error page template.",
    link: "https://github.com/donlon/cloudflare-error-page",
    category: "Scripts",
    tags: ["all"],
    image: "https://github.com/donlon.png"
  },
  {
    id: 133,
    title: "LM Studio",
    description: "Run local LLMs on your machine.",
    link: "https://lmstudio.ai/",
    category: "Softwares",
    tags: ["macos", "windows", "linux"],
    image: "https://lmstudio.ai/favicon.ico"
  },
  {
    id: 134,
    title: "Shader Gradient",
    description: "Generate shader-style gradients.",
    link: "https://shadergradient.co/",
    category: "Websites",
    tags: ["all"],
    image: "https://shadergradient.co/favicon.ico"
  },
  {
    id: 135,
    title: "OpenScreen",
    description: "Screen sharing and remote control.",
    link: "https://github.com/siddharthvaddem/openscreen",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/siddharthvaddem.png"
  },
  {
    id: 136,
    title: "FineTune",
    description: "Fine-tuning utilities for ML models.",
    link: "https://github.com/ronitsingh10/FineTune",
    category: "Scripts",
    tags: ["all"],
    image: "https://github.com/ronitsingh10.png"
  },
  {
    id: 137,
    title: "Net-Bar",
    description: "Network status bar app.",
    link: "https://github.com/iad1tya/Net-Bar",
    category: "Softwares",
    tags: ["all"],
    image: "https://github.com/iad1tya.png"
  },
  {
    id: 138,
    title: "Ear (web)",
    description: "Unofficial web app to control Nothing/CMF audio devices on PC/Mac.",
    link: "https://earweb.bttl.xyz/",
    category: "Websites",
    tags: ["all"],
    image: "https://earweb.bttl.xyz/favicon.ico"
  },
  {
    id: 139,
    title: "Scrcpy GUI",
    description: "A modern, high-performance Windows GUI for scrcpy.",
    link: "https://github.com/kil0bit-kb/scrcpy-gui",
    category: "Softwares",
    tags: ["windows"],
    image: "https://github.com/kil0bit-kb.png"
  },
  {
    id: 140,
    title: "CodexBar",
    description: "MacOS menu bar app to track OpenAI/Claude usage quotas.",
    link: "https://github.com/steipete/CodexBar",
    category: "Softwares",
    tags: ["macos"],
    image: "https://github.com/steipete.png"
  },
  {
    id: 141,
    title: "Excalidraw",
    description: "Virtual collaborative whiteboard with hand-drawn feel diagrams.",
    link: "https://excalidraw.com",
    category: "Websites",
    tags: ["all"],
    image: "https://excalidraw.com/favicon.ico"
  },
  {
    id: 142,
    title: "Corca",
    description: "Fast, intuitive math editor with real-time collaboration and LaTeX export.",
    link: "https://corca.app",
    category: "Websites",
    tags: ["all"],
    image: "https://corca.app/favicon.ico"
  },
  {
    id: 143,
    title: "Quick Subtitles",
    description: "Generate subtitles for videos in seconds on iOS.",
    link: "https://apps.apple.com/us/app/quick-subtitles/id6747410609",
    category: "Softwares",
    tags: ["ios"],
    image: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/4c/4c/4c/4c4c4c4c-4c4c-4c4c-4c4c-4c4c4c4c4c4c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/60x60bb.jpg"
  },
  {
    id: 144,
    title: "Transmission",
    description: "Fast, easy, and free BitTorrent client for Mac, Windows, and Linux.",
    link: "https://transmissionbt.com",
    category: "Softwares",
    tags: ["macos", "windows", "linux"],
    image: "https://github.com/transmission.png"
  },
  {
    id: 145,
    title: "iLovePDF",
    description: "Free online tools to merge, split, compress, and convert PDFs.",
    link: "https://www.ilovepdf.com/",
    category: "Websites",
    tags: ["all"],
    image: "https://www.ilovepdf.com/favicon.ico"
  }
];
