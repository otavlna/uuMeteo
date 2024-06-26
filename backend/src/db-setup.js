const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { promisify } = require("util");

// Connect to a SQLite database.
let dbPath = path.resolve(process.cwd(), "./db/database.sqlite");
let db = new sqlite3.Database(dbPath, async (err) => {
  const dbRun = promisify(db.run.bind(db));

  if (err) {
    return console.error(err);
  }
  console.log("Connected to the SQLite database.");

  // Enable foreign key support
  await dbRun("PRAGMA foreign_keys = ON", handleErrorCallback);

  // Create the `alerts` table if it doesn't exist
  await dbRun(
    `
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      upper_limit REAL,
      lower_limit REAL,
      triggered_at TIMESTAMP
    )
  `,
    handleErrorCallback
  );

  // Create the `devices` table if it doesn't exist
  await dbRun(
    "CREATE TABLE IF NOT EXISTS devices(deviceId TEXT PRIMARY KEY, name TEXT, secretKey TEXT)",
    handleErrorCallback
  );

  // Create the `temperatures` table if it doesn't exist
  await dbRun(
    "CREATE TABLE IF NOT EXISTS temperatures(value NUMBER, deviceId TEXT NOT NULL, time TEXT, FOREIGN KEY(deviceId) REFERENCES devices(deviceId))",
    handleErrorCallback
  );

  // Create the `users` table if it doesn't exist
  await dbRun(
    "CREATE TABLE IF NOT EXISTS users(userId TEXT PRIMARY KEY, username TEXT, password TEXT)",
    handleErrorCallback
  );

  // Create a unique index on the `username` column
  await dbRun(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_username ON users(username)",
    handleErrorCallback
  );
});

function handleErrorCallback(err) {
  if (err) {
    return console.error(err);
  }
}

module.exports = db;
