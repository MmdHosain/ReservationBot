// src/db/index.ts
import { AppDataSource } from "./orm.config.ts";

export async function initDB() {
  try {
    // Initialize TypeORM Data Source
    // By explicitly passing synchronize: true here, we can generate tables if they don't exist,
    // while avoiding destructive updates on subsequent runs depending on production configs.
    await AppDataSource.initialize();
    console.log("🔥 TypeORM AppDataSource initialized.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}
