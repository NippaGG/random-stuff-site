const DEFAULT_SOFTWARE_PLATFORM_TAGS = ["macos", "windows", "linux"];

type TaggableItem = {
  category: string;
  tags: string[];
  github?: string;
  description?: string;
};

export function getVisiblePlatformTags(item: TaggableItem) {
  const concreteTags = item.tags.filter((tag) => tag !== "all");

  if (concreteTags.length > 0) {
    return concreteTags;
  }

  if (item.category === "Softwares" && item.tags.includes("all")) {
    return DEFAULT_SOFTWARE_PLATFORM_TAGS;
  }

  return [];
}

export function itemMatchesPlatformTag(item: TaggableItem, activeTag: string) {
  if (activeTag === "all") {
    return true;
  }

  const normalized = activeTag.toLowerCase();

  // Utility tag matching
  if (normalized === "open-source" || normalized === "oss") {
    return Boolean(item.github) || item.tags.some((t) => t.includes("open") || t.includes("oss"));
  }

  if (normalized === "cli" || normalized === "terminal") {
    return (
      item.category === "Scripts" ||
      item.tags.some((t) => t === "cli" || t === "terminal") ||
      Boolean(item.description?.toLowerCase().includes("terminal") || item.description?.toLowerCase().includes("command-line") || item.description?.toLowerCase().includes("command line"))
    );
  }

  if (normalized === "self-hosted") {
    return (
      item.tags.some((t) => t.includes("self-host")) ||
      Boolean(item.description?.toLowerCase().includes("self-host") || item.description?.toLowerCase().includes("docker") || item.description?.toLowerCase().includes("server"))
    );
  }

  if (normalized === "free") {
    return Boolean(item.github) || item.category === "Websites" || item.tags.includes("free");
  }

  // OS platform tag matching
  const visibleTags = getVisiblePlatformTags(item);

  if (visibleTags.length > 0) {
    return visibleTags.includes(activeTag);
  }

  return item.tags.includes(activeTag) || item.tags.includes("all");
}
