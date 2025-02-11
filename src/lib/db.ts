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

  await fs.mkdir(DB_DIR, { recursive: true });

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  if (!subdomain) {
    // This is the main database
    await db.exec(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subdomain TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        custom_domain TEXT UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_subdomain ON blogs(subdomain);
      CREATE INDEX IF NOT EXISTS idx_custom_domain ON blogs(custom_domain);

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        subdomain TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_username ON users(username);
    `);
  } else {
    // This is a subdomain-specific database
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
        UNIQUE(slug, subdomain)
      );
    `);
  }

  return db;
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

export async function getSubdomainFromCustomDomain(
  customDomain: string
): Promise<string | null> {
  try {
    const [result] = await query(
      undefined,
      "SELECT subdomain FROM blogs WHERE custom_domain = ?",
      [customDomain]
    );
    return result ? result.subdomain : null;
  } catch (error) {
    console.error("Error getting subdomain from custom domain:", error);
    return null;
  }
}

export async function getCustomDomain(
  subdomain: string
): Promise<string | null> {
  try {
    const [result] = await query(
      undefined,
      "SELECT custom_domain FROM blogs WHERE subdomain = ?",
      [subdomain]
    );
    return result ? result.custom_domain : null;
  } catch (error) {
    console.error("Error fetching custom domain:", error);
    return null;
  }
}

export default { query, run, getSubdomainFromCustomDomain, getCustomDomain };
