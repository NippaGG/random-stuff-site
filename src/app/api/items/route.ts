import { NextResponse } from "next/server";
import { getItems } from "@/lib/db";

export async function GET() {
    try {
        const items = getItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
