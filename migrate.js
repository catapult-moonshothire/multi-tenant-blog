import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function migrate() {
  const db = await open({
    filename: "./db/main.sqlite", // Path to your SQLite database
    driver: sqlite3.Database,
  });

  try {
    await db.exec(`
      ALTER TABLE blogs ADD COLUMN blogId TEXT NOT NULL;
      ALTER TABLE users ADD COLUMN blogId TEXT NOT NULL;
      ALTER TABLE users ADD COLUMN first_name TEXT;
      ALTER TABLE users ADD COLUMN last_name TEXT;
      ALTER TABLE users ADD COLUMN nickname TEXT;
      ALTER TABLE users ADD COLUMN bio TEXT;
      ALTER TABLE users ADD COLUMN social_links TEXT;
      ALTER TABLE users ADD COLUMN phone_number TEXT;
    `);
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await db.close();
  }
}

migrate();
