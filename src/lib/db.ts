import Database from "better-sqlite3";
import path from "path";

// Item type - shared between server and client
export interface Item {
  id: number;
  title: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
  image?: string;
}

// Row type as stored in SQLite (tags is a JSON string)
interface ItemRow {
  id: number;
  title: string;
  description: string;
  link: string;
  category: string;
  tags: string;
  image: string | null;
}

const DB_PATH = path.join(process.cwd(), "data", "items.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");

    // Create table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '["all"]',
        image TEXT
      )
    `);
  }
  return db;
}

export function getItems(): Item[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM items ORDER BY id").all() as ItemRow[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link,
    category: row.category,
    tags: JSON.parse(row.tags) as string[],
    image: row.image ?? undefined,
  }));
}
