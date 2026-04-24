import { items as fallbackItems, type Item } from "@/data/items";

type SupabaseItemRow = {
    id: string;
    title: string;
    description: string;
    website: string | null;
    github: string | null;
    category: string;
    tags: string[] | null;
    image: string | null;
    is_new: boolean | null;
};

const SUPABASE_URL =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseItemsUrl() {
    if (!SUPABASE_URL) return null;

    const url = new URL("/rest/v1/items", SUPABASE_URL);
    url.searchParams.set(
        "select",
        "id,title,description,website,github,category,tags,image,is_new"
    );
    url.searchParams.set("order", "sort_order.asc,title.asc");
    return url;
}

function toItem(row: SupabaseItemRow): Item {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        website: row.website ?? undefined,
        github: row.github ?? undefined,
        category: row.category,
        tags: row.tags?.length ? row.tags : ["all"],
        image: row.image ?? undefined,
        isNew: row.is_new ?? false,
    };
}

export async function getItems() {
    const supabaseItemsUrl = getSupabaseItemsUrl();

    if (!supabaseItemsUrl || !SUPABASE_ANON_KEY) {
        return fallbackItems;
    }

    try {
        const response = await fetch(supabaseItemsUrl, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Supabase items request failed: ${response.status}`);
        }

        const rows = (await response.json()) as SupabaseItemRow[];
        return rows.map(toItem);
    } catch (error) {
        console.error("Falling back to bundled items:", error);
        return fallbackItems;
    }
}
