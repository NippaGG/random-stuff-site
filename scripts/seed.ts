import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { seedItems } from "./seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "items.db");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Create the table
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

// Clear existing data for idempotent seeding
db.exec("DELETE FROM items");

// Insert all items in a transaction
const insert = db.prepare(`
  INSERT INTO items (id, title, description, link, category, tags, image)
  VALUES (@id, @title, @description, @link, @category, @tags, @image)
`);

const insertMany = db.transaction((itemsList: typeof seedItems) => {
  for (const item of itemsList) {
    insert.run({
      id: item.id,
      title: item.title,
      description: item.description,
      link: item.link,
      category: item.category,
      tags: JSON.stringify(item.tags),
      image: item.image ?? null,
    });
  }
});

insertMany(seedItems);

console.log(`✅ Seeded ${seedItems.length} items into ${DB_PATH}`);

db.close();
