const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function initializeDatabase() {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create/open database
  const dbPath = path.join(dataDir, 'rifas.db');
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create raffles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS raffles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      images TEXT,
      price_per_number REAL NOT NULL,
      total_numbers INTEGER NOT NULL,
      draw_date DATETIME NOT NULL,
      status TEXT DEFAULT 'active',
      winner_number INTEGER,
      winner_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create purchases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raffle_id INTEGER NOT NULL,
      buyer_name TEXT NOT NULL,
      buyer_phone TEXT NOT NULL,
      buyer_email TEXT,
      number INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(raffle_id, number),
      FOREIGN KEY (raffle_id) REFERENCES raffles(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
  return db;
}

module.exports = initializeDatabase;
