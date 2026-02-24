import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        // Read items from the pre-generated JSON file (works on all platforms including Vercel)
        const jsonPath = path.join(process.cwd(), "data", "items.json");
        const raw = fs.readFileSync(jsonPath, "utf-8");
        const items = JSON.parse(raw);
        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
