// Item type definition — shared between server and client.
// The actual data now lives in the SQLite database (data/items.db).
// To seed the database, run: npx tsx scripts/seed.ts

export interface Item {
  id: number;
  title: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
  image?: string;
}
