import type { Item } from "@/data/items";

const DEFAULT_SOFTWARE_PLATFORM_TAGS = ["macos", "windows", "linux"];

type TaggableItem = Pick<Item, "category" | "tags">;

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

  const visibleTags = getVisiblePlatformTags(item);

  if (visibleTags.length > 0) {
    return visibleTags.includes(activeTag);
  }

  return item.tags.includes(activeTag) || item.tags.includes("all");
}
