import mongoose from "mongoose";
import { items } from "../src/data/items";

const MONGODB_URI =
  "mongodb+srv://shockagg:randomstuff@random-stuff-collection.9nwzck1.mongodb.net/random-stuff-site?retryWrites=true&w=majority";

// Define the schema inline to avoid import path issues with tsx
const ItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!\n");

    // Clear existing items
    const deleteResult = await Item.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing items.`);

    // Insert all items from items.ts
    const result = await Item.insertMany(items);
    console.log(`✅ Seeded ${result.length} items into MongoDB!\n`);

    // Show a summary
    const categories = items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("📊 Breakdown by category:");
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    console.log(`\n   Total: ${items.length} items`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB.");
  }
}

seed();
