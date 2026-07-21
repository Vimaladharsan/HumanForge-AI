const initSqlJs = require('sql.js');
const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/humanforge.db');

let SQL = null;
let db = null;

// Persist the in-memory DB to disk. sql.js keeps everything in memory,
// so every write must be followed by a flush to survive a restart.
const persist = () => {
  const data = db.export();
  fs.ensureDirSync(path.dirname(DB_PATH));
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

const init = async () => {
  if (db) return db;

  SQL = await initSqlJs();

  if (await fs.pathExists(DB_PATH)) {
    const fileBuffer = await fs.readFile(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      feature TEXT NOT NULL,
      provider TEXT,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);
  `);

  persist();
  return db;
};

// Run an INSERT/UPDATE/DELETE, returning the new row id (for inserts) and persisting to disk
const run = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  const lastId = db.exec('SELECT last_insert_rowid() AS id')[0].values[0][0];
  persist();
  return lastId;
};

// Run a SELECT, returning an array of plain objects
const all = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
};

// Run a SELECT expected to return one row (or undefined)
const get = (sql, params = []) => {
  const rows = all(sql, params);
  return rows[0];
};

module.exports = { init, run, all, get };
