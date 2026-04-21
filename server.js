const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./hadith.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      image LONGBLOB,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// API Routes

// Publish article
app.post('/api/articles', (req, res) => {
  const { title, content, author, image } = req.body;
  const date = new Date().toLocaleDateString();

  db.run(
    `INSERT INTO articles (title, content, author, image, date) VALUES (?, ?, ?, ?, ?)`,
    [title, content, author, image, date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, id: this.lastID });
      }
    }
  );
});

// Get all articles
app.get('/api/articles', (req, res) => {
  db.all(`SELECT * FROM articles ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single article
app.get('/api/articles/:id', (req, res) => {
  db.get(`SELECT * FROM articles WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
