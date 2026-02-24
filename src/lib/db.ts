// This file previously contained the SQLite database access layer.
// The API route now reads from data/items.json directly for Vercel compatibility.
// The Item type is defined in @/data/items.ts.

export type { Item } from "@/data/items";
