export interface Item {
  id: string;
  title: string;
  description: string;
  website?: string;
  github?: string;
  category: string;
  tags: string[];
  image?: string;
  isNew?: boolean;
}

type RawItem = Omit<Item, "id">;

/** Extract a favicon URL from a website URL */
function getFaviconUrl(url?: string): string | undefined {
  if (!url || url === "#") return undefined;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return undefined;
  }
}

const rawItems: RawItem[] = [
  {
    "title": "React Bits",
    "description": "A huge library of animated React components.",
    "website": "https://reactbits.dev",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://reactbits.dev/favicon.ico"
  },
  {
    "title": "WizTree",
    "description": "Find what's eating your disk space on Windows.",
    "website": "https://diskanalyzer.com",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://diskanalyzer.com/favicon.ico"
  },
  {
    "title": "Raycast",
    "description": "The best launcher for macOS. Replaces Spotlight.",
    "website": "https://raycast.com",
    "github": "https://github.com/raycast",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
  },
  {
    "title": "Ffmpeg Script",
    "description": "Quickly convert MKV to MP4 without losing quality.",
    "website": "#",
    "category": "Scripts",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "Chris Titus WinUtil",
    "description": "The ultimate Windows utility to debloat, update, and fix Windows.",
    "website": "https://christitus.com/one-tool-for-everything/",
    "category": "Scripts",
    "tags": [
      "windows"
    ]
  },
  {
    "title": "PlayCover",
    "description": "Run iOS apps and games on Apple Silicon Macs with keyboard support.",
    "website": "https://playcover.io",
    "github": "https://github.com/PlayCover/PlayCover/",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/PlayCover.png"
  },
  {
    "title": "FMHY",
    "description": "The largest collection of free stuff on the internet (tools, piracy, etc).",
    "website": "https://fmhy.net/",
    "github": "https://github.com/fmhy/bookmarks",
    "category": "Websites",
    "tags": [
      "all"
    ],
  },
  {
    "title": "Github Store",
    "description": "A free app store to browse and install apps from GitHub releases.",
    "website": "https://www.github-store.org/",
    "github": "https://github.com/rainxchzed/Github-Store/",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/rainxchzed.png"
  },
  {
    "title": "Awesome Swift Apps",
    "description": "A curated list of open-source macOS applications built with Swift.",
    "github": "https://github.com/jaywcjlove/awesome-swift-macos-apps/",
    "category": "Websites",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/jaywcjlove.png"
  },
  {
    "title": "Popcorn Time",
    "description": "Watch movies and TV shows instantly via torrent streaming.",
    "website": "https://popcorntime.app",
    "github": "https://github.com/popcorntime/popcorntime",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/popcorntime.png"
  },
  {
    "title": "Brisk",
    "description": "An ultra-fast, modern download manager for macOS and Linux.",
    "github": "https://github.com/BrisklyDev/brisk/",
    "category": "Softwares",
    "tags": [
      "macos",
      "linux"
    ],
    "image": "https://github.com/BrisklyDev.png"
  },
  {
    "title": "Cobalt",
    "description": "Download media from YouTube, Twitter, and more without ads or tracking.",
    "website": "https://cobalt.tools/",
    "category": "Websites",
    "tags": [
      "all"
    ],
  },
  {
    "title": "Mole",
    "description": "A terminal tool for deep macOS cleanup and app uninstallation.",
    "website": "https://x.com/HiTw93/status/2037873590461464915",
    "github": "https://github.com/tw93/Mole",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/tw93.png"
  },
  {
    "title": "Vert",
    "description": "Securely convert files locally in your browser using WebAssembly.",
    "website": "https://vert.sh/",
    "github": "https://github.com/VERT-sh/VERT",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Mounty",
    "description": "A tiny tool to re-mount write-protected NTFS volumes on macOS.",
    "website": "https://mounty.app/",
    "github": "https://github.com/tuxera/ntfs-3g",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://mounty.app/favicon.ico"
  },
  {
    "title": "Isocons",
    "description": "A free collection of customizable isometric icons.",
    "website": "https://www.isocons.app/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Boring Notch",
    "description": "Turns your MacBook notch into a dynamic, functional hub.",
    "website": "https://theboring.name/",
    "github": "https://github.com/TheBoredTeam/boring.notch/?tab=readme-ov-file",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/TheBoredTeam.png"
  },
  {
    "title": "Darkwrite",
    "description": "A distraction-free, eye-candy note-taking and to-do app.",
    "website": "https://darkwrite.app/",
    "github": "https://github.com/astudentinearth/darkwrite",
    "category": "Softwares",
    "tags": [
      "all"
    ]
  },
  {
    "title": "UTM",
    "description": "Run virtual machines (Windows, Linux) on iOS and macOS.",
    "website": "https://getutm.app",
    "github": "https://github.com/utmapp/UTM",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/utmapp.png"
  },
  {
    "title": "WinApps",
    "description": "Run Windows apps like Office and Adobe on Linux seamlessly.",
    "github": "https://github.com/winapps-org/winapps",
    "category": "Softwares",
    "tags": [
      "linux"
    ],
    "image": "https://github.com/winapps-org.png"
  },
  {
    "title": "EdClub",
    "description": "Educational platform for typing, vocabulary, and more.",
    "website": "https://www.edclub.com/sportal/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "MAS",
    "description": "Microsoft Activation Scripts - Open source Windows/Office activator.",
    "website": "https://massgrave.dev",
    "github": "https://github.com/massgravel/Microsoft-Activation-Scripts",
    "category": "Scripts",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/massgravel.png"
  },
  {
    "title": "niri",
    "description": "A scrollable-tiling Wayland compositor.",
    "website": "https://niri-wm.github.io/niri/",
    "github": "https://github.com/YaLTeR/niri",
    "category": "Softwares",
    "tags": [
      "linux"
    ],
    "image": "https://github.com/YaLTeR.png"
  },
  {
    "title": "Spicetify CLI",
    "description": "Command-line tool to customize the Spotify desktop app.",
    "website": "https://spicetify.app",
    "github": "https://github.com/spicetify/cli",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/spicetify.png"
  },
  {
    "title": "Win11Debloat",
    "description": "Debloat and tweak Windows 11.",
    "github": "https://github.com/Raphire/Win11Debloat",
    "category": "Scripts",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/Raphire.png"
  },
  {
    "title": "DockDoor",
    "description": "Dock alternative for macOS.",
    "website": "https://dockdoor.net/",
    "github": "https://github.com/ejbills/DockDoor",
    "category": "Softwares",
    "tags": [
      "macos"
    ]
  },
  {
    "title": "Shine",
    "description": "Open-source project from Blade04208.",
    "github": "https://github.com/Blade04208/shine/",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Blade04208.png"
  },
  {
    "title": "Gemini Watermark Remover",
    "description": "Watermark removal tool.",
    "website": "https://pilio.ai/gemini-watermark-remover",
    "github": "https://github.com/journey-ad/gemini-watermark-remover",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/journey-ad.png"
  },
  {
    "title": "shadPS4",
    "description": "PlayStation 4 emulator.",
    "website": "https://shadps4.net/",
    "github": "https://github.com/shadps4-emu/shadPS4",
    "category": "Softwares",
    "tags": [
      "windows",
      "linux"
    ],
    "image": "https://github.com/shadps4-emu.png"
  },
  {
    "title": "Mate Engine",
    "description": "Game engine project.",
    "website": "https://store.steampowered.com/app/3625270/MateEngine/",
    "github": "https://github.com/shinyflvre/Mate-Engine",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/shinyflvre.png"
  },
  {
    "title": "Cline",
    "description": "Open-source AI coding assistant.",
    "website": "https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev",
    "github": "https://github.com/cline/cline",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/cline.png"
  },
  {
    "title": "FaceFusion",
    "description": "Face swap and enhancement toolkit.",
    "website": "https://facefusion.io",
    "github": "https://github.com/allenk/facefusion",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/allenk.png"
  },
  {
    "title": "Droppy",
    "description": "Self-hosted file sharing app.",
    "github": "https://github.com/iordv/Droppy",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/iordv.png"
  },
  {
    "title": "Open Researcher",
    "description": "Automated research assistant.",
    "github": "https://github.com/firecrawl/open-researcher",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/firecrawl.png"
  },
  {
    "title": "Cloudflare Error Page",
    "description": "Custom Cloudflare error page template.",
    "website": "https://virt.moe/cferr/editor/",
    "github": "https://github.com/donlon/cloudflare-error-page",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/donlon.png"
  },
  {
    "title": "LM Studio",
    "description": "Run local LLMs on your machine.",
    "website": "https://lmstudio.ai/",
    "github": "https://github.com/lmstudio-ai",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://lmstudio.ai/favicon.ico"
  },
  {
    "title": "Shader Gradient",
    "description": "Generate shader-style gradients.",
    "website": "https://shadergradient.co/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "OpenScreen",
    "description": "Screen sharing and remote control.",
    "website": "https://openscreen.vercel.app",
    "github": "https://github.com/siddharthvaddem/openscreen",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/siddharthvaddem.png"
  },
  {
    "title": "FineTune",
    "description": "A macOS menu bar app for per-app volume control, multi-device output, audio routing, and 10-band EQ.",
    "github": "https://github.com/ronitsingh10/FineTune",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/ronitsingh10.png"
  },
  {
    "title": "Net-Bar",
    "description": "Network status bar app.",
    "github": "https://github.com/iad1tya/Net-Bar",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/iad1tya.png"
  },
  {
    "title": "Ear (web)",
    "description": "Unofficial web app to control Nothing/CMF audio devices on PC/Mac.",
    "website": "https://earweb.bttl.xyz/",
    "github": "https://github.com/radiance-project/ear-web/issues",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://earweb.bttl.xyz/favicon.ico"
  },
  {
    "title": "Scrcpy GUI",
    "description": "A modern, high-performance Windows GUI for scrcpy.",
    "github": "https://github.com/kil0bit-kb/scrcpy-gui",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/kil0bit-kb.png"
  },
  {
    "title": "CodexBar",
    "description": "MacOS menu bar app to track OpenAI/Claude usage quotas.",
    "website": "https://codexbar.app",
    "github": "https://github.com/steipete/CodexBar",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/steipete.png"
  },
  {
    "title": "Excalidraw",
    "description": "Virtual collaborative whiteboard with hand-drawn feel diagrams.",
    "website": "https://excalidraw.com",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://excalidraw.com/favicon.ico"
  },
  {
    "title": "Corca",
    "description": "Fast, intuitive math editor with real-time collaboration and LaTeX export.",
    "website": "https://corca.app",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://corca.app/favicon.ico"
  },
  {
    "title": "Quick Subtitles",
    "description": "Generate subtitles for videos in seconds on iOS.",
    "website": "https://apps.apple.com/us/app/quick-subtitles/id6747410609",
    "category": "Softwares",
    "tags": [
      "ios"
    ]
  },
  {
    "title": "Transmission",
    "description": "Fast, easy, and free BitTorrent client for Mac, Windows, and Linux.",
    "website": "https://transmissionbt.com",
    "github": "https://github.com/transmission/transmission/issues",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/transmission.png"
  },
  {
    "title": "iLovePDF",
    "description": "Free online tools to merge, split, compress, and convert PDFs.",
    "website": "https://www.ilovepdf.com/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://www.ilovepdf.com/favicon.ico"
  },
  {
    "title": "Mini-Agent",
    "description": "Open-source agent framework from MiniMax-AI.",
    "website": "https://www.minimax.io/",
    "github": "https://github.com/MiniMax-AI/Mini-Agent",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/MiniMax-AI.png"
  },
  {
    "title": "BetterCapture",
    "description": "The macOS screen recorder for the rest of us - always free and open source with a native look and feel.",
    "website": "https://bettercapture.app/",
    "github": "https://github.com/jsattler/BetterCapture",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/jsattler.png"
  },
  {
    "title": "Hidden",
    "description": "An ultra-light MacOS utility that helps hide menu bar icons.",
    "website": "https://d.foundation/opensource",
    "github": "https://github.com/dwarvesf/hidden",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/dwarvesf.png"
  },
  {
    "title": "IINA",
    "description": "The modern video player for macOS.",
    "website": "https://iina.io",
    "github": "https://github.com/iina/iina",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/iina.png"
  },
  {
    "title": "Torph",
    "description": "Dependency-free animated text component.",
    "website": "https://torph.lochie.me/",
    "github": "https://github.com/lochie/torph",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://torph.lochie.me/og.png"
  },
  {
    "title": "Scrollbar",
    "description": "Simple online scrollbar editor.",
    "website": "https://scrollbar.app",
    "github": "https://github.com/henripar/scrollbar",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/henripar.png"
  },
  {
    "title": "BentoPDF",
    "description": "A Privacy First PDF Toolkit.",
    "website": "https://bentopdf.com/",
    "github": "https://github.com/alam00000/bentopdf",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/alam00000.png"
  },
  {
    "title": "PS4 Game Scraper",
    "description": "PS4 Game Scraper.",
    "github": "https://github.com/NookieAI/PS4-Game-Scraper",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/NookieAI.png"
  },
  {
    "title": "CopyCat Clipboard",
    "description": "An intuitive clipboard manager designed to enhance your workflow and seamlessly switch between documents, apps, and devices.",
    "website": "https://www.entilitystudio.com/copycat-clipboard",
    "github": "https://github.com/raj457036/CopyCat-Clipboard",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/raj457036.png"
  },
  {
    "title": "Sileo",
    "description": "Beautiful Toast Notifications for React.",
    "website": "https://sileo.aaryan.design/",
    "github": "https://github.com/hiaaryan/sileo",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://sileo.aaryan.design/favicon.ico"
  },
  {
    "title": "Battery-Toolkit",
    "description": "Control the platform power state of your Apple Silicon Mac.",
    "github": "https://github.com/mhaeuser/Battery-Toolkit",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/mhaeuser.png"
  },
  {
    "title": "MagicPods",
    "description": "Add little magic to your Airpods on Windows.",
    "website": "https://magicpods.app",
    "github": "https://github.com/steam3d/MagicPods-Windows",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/steam3d.png"
  },
  {
    "title": "IPSW Downloads",
    "description": "Download current and previous versions of Apple's iOS, iPadOS, macOS, watchOS, tvOS, audioOS and visionOS firmware.",
    "website": "https://ipsw.me/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ipsw.me/favicon.ico"
  },
  {
    "title": "Carbon Design System",
    "description": "IBM's open source design system for products and digital experiences.",
    "website": "https://www.carbondesignsystem.com",
    "github": "https://github.com/carbon-design-system/carbon",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/carbon-design-system.png"
  },
  {
    "title": "Poke",
    "description": "A free software YouTube front-end, translator, map app, and more! All-in-one privacy app.",
    "website": "https://poketube.fun/",
    "github": "https://github.com/TecharoHQ/anubis",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://poketube.fun/favicon.ico"
  },
  {
    "title": "NouTube Desktop",
    "description": "Ad-free YouTube desktop application.",
    "github": "https://github.com/nonbili/NouTube-Desktop",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/nonbili.png"
  },
  {
    "title": "NouTube",
    "description": "Ad-free YouTube client.",
    "github": "https://github.com/nonbili/NouTube",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/nonbili.png"
  },
  {
    "title": "Lucide Animated",
    "description": "Beautiful animated icons for Lucide.",
    "website": "https://lucide-animated.com/",
    "github": "https://github.com/pqoqubbw/icons",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://lucide-animated.com/favicon.ico"
  },
  {
    "title": "Scrapy",
    "description": "A fast high-level web crawling and scraping framework for Python.",
    "website": "https://scrapy.org",
    "github": "https://github.com/scrapy/scrapy",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/scrapy.png"
  },
  {
    "title": "The Component Gallery",
    "description": "A collection of components from the best Design Systems.",
    "website": "https://component.gallery/",
    "github": "https://github.com/elastic/eui",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Metrolist",
    "description": "A simple to-do list taking design cues from the Metro design language.",
    "website": "https://metrolist.cc/",
    "github": "https://github.com/MetrolistGroup/Metrolist",
    "category": "Softwares",
    "tags": [
      "android"
    ],
    "image": "https://github.com/MetrolistGroup.png"
  },
  {
    "title": "Karaoke Eternal",
    "description": "Open karaoke party system.",
    "website": "https://www.karaoke-eternal.com",
    "github": "https://github.com/bhj/KaraokeEternal",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/bhj.png"
  },
  {
    "title": "Shadcn Admin",
    "description": "Admin Dashboard UI built with Shadcn and Vite.",
    "website": "https://shadcn-admin.netlify.app/",
    "github": "https://github.com/satnaing/shadcn-admin",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/satnaing.png"
  },
  {
    "title": "FlyCut Caption",
    "description": "A complete video subtitle editing React component with AI-powered speech recognition and visual editing capabilities.",
    "website": "https://caption.flycut.co",
    "github": "https://github.com/x007xyz/flycut-caption",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/x007xyz.png"
  },
  {
    "title": "Awesome Self-Hosted",
    "description": "A list of Free Software network services and web applications which can be hosted on your own servers.",
    "website": "https://awesome-selfhosted.net/",
    "github": "https://github.com/awesome-selfhosted/awesome-selfhosted",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/awesome-selfhosted.png"
  },
  {
    "title": "WinShot",
    "description": "A Windows screenshot tool with annotation, crop, and export features.",
    "website": "http://winshot.claudekit.cc/",
    "github": "https://github.com/mrgoonie/winshot",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/mrgoonie.png"
  },
  {
    "title": "Stats",
    "description": "macOS system monitor in your menu bar.",
    "website": "https://mac-stats.com",
    "github": "https://github.com/exelban/stats",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/exelban.png"
  },
  {
    "title": "API Mega List",
    "description": "A powerhouse collection of APIs you can start using immediately to build everything from simple automations to full-scale applications.",
    "github": "https://github.com/cporter202/API-mega-list",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/cporter202.png"
  },
  {
    "title": "Gopeed",
    "description": "A modern download manager that supports all platforms. Built with Golang and Flutter.",
    "website": "https://gopeed.com",
    "github": "https://github.com/GopeedLab/gopeed",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/GopeedLab.png"
  },
  {
    "title": "Bulk Crap Uninstaller",
    "description": "Remove large amounts of unwanted applications quickly.",
    "website": "https://www.bcuninstaller.com/",
    "github": "https://github.com/Klocman/Bulk-Crap-Uninstaller",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/Klocman.png"
  },
  {
    "title": "Delphi Tools",
    "description": "A collection of small, low stakes and low effort web tools including calculators, converters, and generators.",
    "website": "https://delphi.tools/",
    "github": "https://github.com/1612elphi/delphitools",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://delphi.tools/favicon.ico"
  },
  {
    "title": "AnythingLLM",
    "description": "The all-in-one AI productivity accelerator. On device and privacy first with no annoying setup or configuration.",
    "website": "https://anythingllm.com",
    "github": "https://github.com/Mintplex-Labs/anything-llm",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Mintplex-Labs.png"
  },
  {
    "title": "LLMFit",
    "description": "Hundreds of models & providers. One command to find what runs on your hardware.",
    "github": "https://github.com/AlexsJones/llmfit",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/AlexsJones.png"
  },
  {
    "title": "Onyx",
    "description": "Open Source AI Platform - AI Chat with advanced features that works with every LLM.",
    "website": "https://www.onyx.app",
    "github": "https://github.com/onyx-dot-app/onyx",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/onyx-dot-app.png"
  },
  {
    "title": "Jan",
    "description": "An open source alternative to ChatGPT that runs 100% offline on your computer.",
    "website": "https://jan.ai",
    "github": "https://github.com/janhq/jan/releases/latest",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/janhq.png"
  },
  {
    "title": "Flow",
    "description": "Google Labs Flow tool for AI.",
    "website": "https://labs.google/fx/tools/flow",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://labs.google/favicon.ico"
  },
  {
    "title": "WorldMonitor",
    "description": "Real-time global intelligence dashboard. AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking.",
    "website": "https://worldmonitor.app",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/koala73.png"
  },
  {
    "title": "Penpot",
    "description": "The open-source design tool for design and code collaboration.",
    "website": "https://penpot.app",
    "github": "https://github.com/penpot/penpot",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/penpot.png"
  },
  {
    "title": "Visual Explainer",
    "description": "Agent skill that generates rich HTML pages or slide decks for diagrams, diff reviews, plan audits, data tables, and project recaps.",
    "github": "https://github.com/nicobailon/visual-explainer",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/nicobailon.png"
  },
  {
    "title": "FluxMarkdown",
    "description": "Beautiful Markdown previews in macOS Finder QuickLook with Mermaid, KaTeX, GFM, charts, and export.",
    "github": "https://github.com/xykong/flux-markdown",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/xykong.png"
  },
  {
    "title": "TypeWhisper",
    "description": "Local, on-device speech-to-text for macOS, Windows, and iOS with no cloud or API keys.",
    "website": "https://www.typewhisper.com/",
    "github": "https://github.com/TypeWhisper",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "ios"
    ],
    "image": "https://github.com/TypeWhisper.png"
  },
  {
    "title": "VibeUI",
    "description": "92 ready-to-copy layout prompts for vibe coding and AI UI generation. Covers auth, pricing, hero, bento, dashboards and more — paste into any AI tool instantly.",
    "website": "https://vibeui.online/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "CompressO",
    "description": "A 100% free, offline, and open-source video and image compression app. Compress any file to a tiny size without quality loss. Available for Mac, Windows, and Linux.",
    "website": "https://compresso.codeforreal.com/",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "Reclip",
    "description": "Lightweight, self-hosted media downloader with a clean web UI. Download videos from almost any website. Easy to deploy and run on your own server.",
    "github": "https://github.com/averygan/reclip",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/averygan.png"
  },
  {
    "title": "Clicky",
    "description": "An AI teacher that lives as a buddy next to your cursor. It can see your screen, talk to you, and even point at things on screen — like having a real teacher beside you. macOS only.",
    "website": "https://www.clicky.so/",
    "github": "https://github.com/farzaa/clicky",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/farzaa.png"
  },
  {
    "title": "ytDownloader",
    "description": "A free, open-source desktop video downloader. Download videos and audio from YouTube, TikTok, Instagram, Twitter, Twitch, and 1000+ more sites.",
    "website": "https://aandrew-me.github.io/ytDownloader/",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "VidBee",
    "description": "Personal media archive and AI content hub. Archive video, audio, and transcripts from YouTube, TikTok, and 1000+ sites for backup, offline access, and AI workflows. Free and open source.",
    "website": "https://vidbee.org/",
    "category": "Softwares",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Webcam & Mic Test",
    "description": "Test your webcam and microphone instantly in the browser. Check video quality, resolution, and FPS before video calls. Works on any device — no download needed. Free and private.",
    "website": "https://webcammictest.com/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Dither",
    "description": "A vector dithering tool for the web and Adobe Illustrator. Apply stylish dithering effects to images and graphics to create retro halftone-style art. Open source.",
    "website": "https://dither.fun/",
    "github": "https://github.com/Shpigford/dither",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Shpigford.png"
  },
  {
    "title": "Recordly",
    "description": "Open-source desktop screen recorder and editor for polished demos, walkthroughs, and product videos with auto-zooms, cursor polish, backgrounds, and timeline editing.",
    "website": "https://recordly.dev/",
    "github": "https://github.com/webadderallorg/Recordly",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/webadderallorg.png"
  },
  {
    "title": "Clop",
    "description": "Image, video, PDF, and clipboard optimizer for macOS. Automatically compresses copied media, screen recordings, screenshots, and files so they are smaller and easier to share.",
    "website": "https://lowtechguys.com/clop/",
    "github": "https://github.com/FuzzyIdeas/Clop",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/FuzzyIdeas.png"
  },
  {
    "title": "Parcel - Delivery Tracking",
    "description": "Delivery tracking app for iPhone, iPad, Mac, Apple Vision, and Apple Watch with carrier recognition, barcode scanning, Amazon integration, widgets, maps, and push notifications.",
    "website": "https://apps.apple.com/gb/app/parcel-delivery-tracking/id375589283",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b7/34/5c/b7345cbd-843b-3679-22fc-82fe99898552/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220.png/512x512bb.jpg"
  },
  {
    "title": "Latest",
    "description": "Free, open-source macOS utility that checks whether your apps are up to date, shows what changed, and helps update Mac App Store and Sparkle-based apps.",
    "website": "https://max.codes/latest/",
    "github": "https://github.com/mangerlahn/Latest",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/mangerlahn.png"
  },
  {
    "title": "Caveman",
    "description": "Claude/Codex plugin and agent skill that makes AI assistants answer tersely to cut output tokens while keeping technical detail.",
    "github": "https://github.com/JuliusBrussee/caveman",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/JuliusBrussee.png"
  },
  {
    "title": "Dot Matrix",
    "description": "React component library of expressive dot matrix loaders that you install via the shadcn registry and own as local code.",
    "website": "https://dotmatrix.zzzzshawn.cloud/",
    "github": "https://github.com/zzzzshawn/matrix",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://dotmatrix.zzzzshawn.cloud/og.png"
  },
  {
    "title": "Evil Charts",
    "description": "Open-source chart UI website built with shadcn and Recharts, with handcrafted chart components and docs.",
    "website": "https://evilcharts.com/docs",
    "github": "https://github.com/legions-developer/evilcharts",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://evilcharts.com/og/og-image.png"
  },
  {
    "title": "OmniGet",
    "description": "Open-source desktop app for studying online courses and books, with notes, flashcards, focus tools, and media downloads.",
    "website": "https://discord.gg/jgdxyPy7Vn",
    "github": "https://github.com/tonhowtf/omniget",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/tonhowtf.png"
  },
  {
    "title": "ASCII Magic",
    "description": "Free browser tool that turns images and videos into ASCII art in real time, with PNG and MP4 export.",
    "website": "https://www.ascii-magic.com/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ascii-magic.com/og.jpg"
  },
  {
    "title": "Thide",
    "description": "Lightweight Windows 10/11 app to hide or show the taskbar with system tray and CLI control.",
    "github": "https://github.com/amnweb/thide",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/amnweb.png"
  },
  {
    "title": "mapcn",
    "description": "Beautiful map components with zero config and one-command setup.",
    "website": "https://mapcn.dev",
    "github": "https://github.com/AnmolSaini16/mapcn",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/AnmolSaini16.png"
  },
  {
    "title": "BrewStation",
    "description": "Homebrew GUI browser, searcher, and manager with app snapshot saving and restoring.",
    "github": "https://github.com/hreinssondev/BrewStation",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/hreinssondev.png"
  },
  {
    "title": "unlumen UI",
    "description": "Copy-ready React, TypeScript, Tailwind, Motion, and shadcn components for building polished interfaces fast.",
    "website": "https://ui.unlumen.com/components",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ui.unlumen.com/favicon.ico"
  },
  {
    "title": "Deck.Gallery",
    "description": "Curated gallery of beautifully designed presentation decks, slides, reports, brand guidelines, and pitch decks.",
    "website": "https://deck.gallery/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://deck.gallery/favicon.ico"
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const idCounts = new Map<string, number>();

// Mark the last 5 items in the raw array as "new"
const NEW_ITEM_COUNT = 5;
const newItemTitles = new Set(
  rawItems.slice(-NEW_ITEM_COUNT).map(i => i.title)
);

export const items: Item[] = rawItems.map((item) => {
  const baseId = `${slugify(item.category) || "category"}-${slugify(item.title) || "item"}`;
  const count = idCounts.get(baseId) ?? 0;
  idCounts.set(baseId, count + 1);

  // Auto-populate image from website favicon if missing
  const image = item.image || getFaviconUrl(item.website) || getFaviconUrl(item.github);

  return {
    ...item,
    image,
    isNew: newItemTitles.has(item.title),
    id: count === 0 ? baseId : `${baseId}-${count + 1}`,
  };
});

/** Helper to get category accent color */
export const CATEGORY_COLORS: Record<string, { accent: string; accentBg: string; accentBorder: string }> = {
  Websites: { accent: "#a3e635", accentBg: "rgba(163,230,53,0.08)", accentBorder: "rgba(163,230,53,0.3)" },
  Softwares: { accent: "#38bdf8", accentBg: "rgba(56,189,248,0.08)", accentBorder: "rgba(56,189,248,0.3)" },
  Scripts: { accent: "#fbbf24", accentBg: "rgba(251,191,36,0.08)", accentBorder: "rgba(251,191,36,0.3)" },
};
