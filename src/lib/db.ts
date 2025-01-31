import fs from "fs/promises";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const DB_DIR =
  process.env.NODE_ENV === "production"
    ? "/db"
    : path.join(process.cwd(), "db");
const MAIN_DB_PATH = path.join(DB_DIR, "main.sqlite");

async function openDb(subdomain?: string) {
  const dbPath = subdomain
    ? path.join(DB_DIR, `${subdomain}.sqlite`)
    : MAIN_DB_PATH;

  try {
    // Ensure the database directory exists
    await fs.mkdir(DB_DIR, { recursive: true });

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Initialize the database schema if it doesn't exist
    if (!subdomain) {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          subdomain TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subdomain TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT NOT NULL,
          content TEXT NOT NULL,
          content_preview TEXT,
          is_draft INTEGER,
          author TEXT NOT NULL,
          category TEXT,
          meta_title TEXT,
          meta_description TEXT,
          label TEXT,
          author_bio TEXT,
          reading_time INTEGER,
          featured_image_url TEXT,
          status TEXT,
          images TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT,
          subdomain TEXT NOT NULL,
          UNIQUE(slug)
        );
      `);
    }

    return db;
  } catch (error) {
    console.error(`Error opening database at ${dbPath}:`, error);
    throw error;
  }
}

export async function query(
  subdomain: string | undefined,
  sql: string,
  params: any[] = []
) {
  try {
    const db = await openDb(subdomain);
    return await db.all(sql, params);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function run(
  subdomain: string | undefined,
  sql: string,
  params: any[] = []
) {
  try {
    const db = await openDb(subdomain);
    return await db.run(sql, params);
  } catch (error) {
    console.error("Database run error:", error);
    throw error;
  }
}

export default { query, run };
