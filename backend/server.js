const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000; // Changed to 10000 to match the last log output and avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// **REMOVED: app.use(express.static(path.join(__dirname, '../frontend/build')));**
// The frontend is deployed separately on Vercel, so the backend only serves APIs.

// Database setup
const db = new sqlite3.Database(process.env.DB_PATH || './feedback.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, studentName TEXT NOT NULL, courseCode TEXT NOT NULL, comments TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');
  }
});

// API Routes
app.get('/api/feedback', (req, res) => {
  const sql = 'SELECT * FROM feedback ORDER BY createdAt DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.post('/api/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;
  
  if (!studentName || !courseCode || !comments || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const sql = 'INSERT INTO feedback (studentName, courseCode, comments, rating) VALUES (?, ?, ?, ?)';
  const params = [studentName, courseCode, comments, rating];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Feedback submitted successfully',
      data: { id: this.lastID }
    });
  });
});

app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM feedback WHERE id = ?', id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json({ message: 'Feedback deleted successfully' });
  });
});

// **REMOVED: app.get('*', ...);**
// This line served index.html for all non-API routes and caused the error.

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});