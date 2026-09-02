import { NextResponse } from "next/server";
import { getItems } from "@/lib/items-server";

export async function GET() {
    const items = await getItems();
    const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return NextResponse.json(sorted);
}
