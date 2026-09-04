import type { Item } from "@/data/items";

/**
 * Generates a clean Markdown export of favorite tools.
 */
export function exportFavoritesMarkdown(items: Item[]): string {
  const date = new Date().toISOString().split("T")[0];
  let md = `# My Curated Tools & Bookmarks\n\n`;
  md += `Exported from [Random Stuff](${typeof window !== "undefined" ? window.location.origin : "https://random-stuff-site.vercel.app"}) on ${date}\n\n`;
  md += `Total Items: ${items.length}\n\n---\n\n`;

  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.category || "Uncategorized")));

  for (const cat of categories) {
    md += `## ${cat}\n\n`;
    const catItems = items.filter((i) => (i.category || "Uncategorized") === cat);
    for (const item of catItems) {
      const link = item.website || item.github || "#";
      md += `### [${item.title}](${link})\n`;
      md += `${item.description}\n\n`;
      if (item.tags && item.tags.length > 0) {
        md += `*Tags:* \`${item.tags.join("`, `")}\`\n\n`;
      }
      if (item.github && item.website && item.github !== item.website) {
        md += `[GitHub Source](${item.github})\n\n`;
      }
    }
    md += `\n`;
  }

  return md;
}

/**
 * Generates a JSON export containing item metadata and timestamp.
 */
export function exportFavoritesJson(items: Item[]): string {
  const payload = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    count: items.length,
    itemIds: items.map((i) => i.id),
    items: items.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      category: i.category,
      website: i.website,
      github: i.github,
      tags: i.tags,
    })),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Generates a self-contained HTML page bookmark document.
 */
export function exportFavoritesHtml(items: Item[]): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cardsHtml = items
    .map((item) => {
      const link = item.website || item.github || "#";
      const tagsHtml = (item.tags || [])
        .map(
          (t) =>
            `<span style="display:inline-block;padding:2px 8px;font-size:11px;border-radius:4px;background:#1e293b;color:#94a3b8;margin-right:4px;">#${t}</span>`
        )
        .join("");

      return `
      <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <a href="${link}" target="_blank" rel="noopener noreferrer" style="color:#a3e635;font-weight:700;font-size:18px;text-decoration:none;">
            ${escapeHtml(item.title)} &rarr;
          </a>
          <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(item.category)}</span>
        </div>
        <p style="color:#cbd5e1;font-size:14px;margin:0;line-height:1.5;">${escapeHtml(item.description)}</p>
        <div style="margin-top:8px;">${tagsHtml}</div>
      </div>
    `;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Curated Tools Export</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #020617;
      color: #f8fafc;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      border-bottom: 1px solid #1e293b;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    h1 { margin: 0 0 8px 0; font-size: 28px; color: #a3e635; }
    p.meta { color: #64748b; margin: 0; font-size: 14px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Curated Tools & Bookmarks</h1>
      <p class="meta">Exported on ${date} &bull; ${items.length} saved tools</p>
    </header>
    <div class="grid">
      ${cardsHtml}
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Triggers a browser file download for text content.
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates an imported JSON favorites file.
 */
export function parseFavoritesImport(jsonText: string): { ids: string[]; count: number } {
  try {
    const data = JSON.parse(jsonText);
    if (Array.isArray(data.itemIds)) {
      const validIds = data.itemIds.filter((id: unknown) => typeof id === "string");
      return { ids: validIds, count: validIds.length };
    }
    if (Array.isArray(data.items)) {
      const validIds = data.items
        .map((i: { id?: string }) => i.id)
        .filter((id: unknown): id is string => typeof id === "string");
      return { ids: validIds, count: validIds.length };
    }
    if (Array.isArray(data)) {
      const validIds = data.filter((id: unknown): id is string => typeof id === "string");
      return { ids: validIds, count: validIds.length };
    }
    throw new Error("Invalid format: could not locate array of tool IDs.");
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to parse JSON file.");
  }
}
