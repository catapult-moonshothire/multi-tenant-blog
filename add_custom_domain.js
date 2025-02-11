const sqlite3 = require("sqlite3").verbose();

// Path to your SQLite database
const dbPath = "./db/main.sqlite";

// Subdomain and custom domain to be added
const subdomain = "dhaval";
const customDomain = "anyday.club";

// Open the database
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Connected to the main.sqlite database.");
});

// SQL command to update the custom domain
const sql = `UPDATE blogs SET custom_domain = ? WHERE subdomain = ?`;

// Execute the SQL command
db.run(sql, [customDomain, subdomain], function (err) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(`Row(s) updated: ${this.changes}`);

  // Verify the update
  const verifySql = `SELECT * FROM blogs WHERE subdomain = ?`;
  db.get(verifySql, [subdomain], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(row);
  });
});

// Close the database
db.close((err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Closed the database connection.");
});
