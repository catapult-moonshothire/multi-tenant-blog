import { open } from "sqlite";
import sqlite3 from "sqlite3";

let db: any = null;

async function openDb() {
  if (!db) {
    try {
      db = await open({
        filename: "./multi_tenant_blog.sqlite",
        driver: sqlite3.Database,
      });

      await db.exec(`
        CREATE TABLE IF NOT EXISTS blogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subdomain TEXT UNIQUE NOT NULL,
          custom_domain TEXT UNIQUE,
          name TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          blog_id INTEGER NOT NULL,
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
          UNIQUE(blog_id, slug),
          FOREIGN KEY (blog_id) REFERENCES blogs(id)
        );
      `);
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    }
  }
  return db;
}

export async function query(sql: string, params: any[] = []) {
  try {
    const db = await openDb();
    return await db.all(sql, params);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function run(sql: string, params: any[] = []) {
  try {
    const db = await openDb();
    return await db.run(sql, params);
  } catch (error) {
    console.error("Database run error:", error);
    throw error;
  }
}

export default { query, run };
