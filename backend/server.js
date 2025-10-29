const express = require('express');
const { Pool } = require('pg'); // Changed from sqlite3 to pg for PostgreSQL
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup (PostgreSQL)
// Uses DATABASE_URL from Render environment variables (which you just set)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is required for Render Postgres connection
  ssl: {
    rejectUnauthorized: false 
  }
});

// Test connection and create table
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database.');
    // SQL to create the table (using PostgreSQL syntax)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        studentName VARCHAR(255) NOT NULL,
        courseCode VARCHAR(255) NOT NULL,
        comments TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return client.query(createTableQuery).finally(() => client.release());
  })
  .catch(err => {
    console.error('Error connecting or creating table:', err.message);
  });

// API Routes
// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const sql = 'SELECT * FROM feedback ORDER BY createdAt DESC';
    const result = await pool.query(sql); // Use pool.query for PostgreSQL
    res.json({
      message: 'success',
      data: result.rows // PostgreSQL returns results in rows property
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Error fetching feedback.' });
  }
});

// POST new feedback
app.post('/api/feedback', async (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;

  if (!studentName || !courseCode || !comments || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'All fields are required and rating must be 1-5' });
  }

  try {
    // PostgreSQL uses $1, $2, etc., for placeholders
    const sql = 'INSERT INTO feedback (studentName, courseCode, comments, rating) VALUES ($1, $2, $3, $4) RETURNING id';
    const params = [studentName, courseCode, comments, rating];
    const result = await pool.query(sql, params);

    res.json({
      message: 'Feedback submitted successfully',
      data: { id: result.rows[0].id }
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Error submitting feedback.' });
  }
});

// DELETE feedback by ID
app.delete('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM feedback WHERE id = $1 RETURNING id';
    const result = await pool.query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Error deleting feedback.' });
  }
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});