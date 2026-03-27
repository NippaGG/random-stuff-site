import { NextResponse } from "next/server";
import { items } from "@/data/items";

export const dynamic = "force-dynamic";

export async function GET() {
    const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return NextResponse.json(sorted);
}
