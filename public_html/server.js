// MySQL setup
// Top of your file
/*const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
app.use(express.json()); // for JSON body parsing


const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'cse135user',
  password: '*Pizzaballs56!',
  database: 'cse135'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

//for static
app.post('/api/static', (req, res) => {
  const {
    user_agent,
    language,
    cookies_enabled,
    javascript_enabled,
    images_enabled,
    css_enabled,
    screen_width,
    screen_height,
    window_width,
    window_height,
    connection_type,
  } = req.body;

  const sql = `
    INSERT INTO static_data (
      user_agent, language, cookies_enabled, javascript_enabled,
      images_enabled, css_enabled, screen_width, screen_height,
      window_width, window_height, connection_type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_agent,
    language,
    cookies_enabled,
    javascript_enabled,
    images_enabled,
    css_enabled,
    screen_width,
    screen_height,
    window_width,
    window_height,
    connection_type
  ], (err) => {
    if (err) {
      console.error('Error inserting static_data:', err);
      return res.status(500).send('Error storing static data');
    }
    res.status(200).send('Static data stored successfully');
  });
});

//For performance sql table
app.post('/api/performance', (req, res) => {
  const {
    navigation_start,
    load_event_end,
    total_load_time,
    full_timing_json
  } = req.body;

  const sql = `
    INSERT INTO performance_data (
      navigation_start, load_event_end, total_load_time, full_timing_json
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [
    navigation_start,
    load_event_end,
    total_load_time,
    JSON.stringify(full_timing_json)
  ], (err) => {
    if (err) {
      console.error('Error inserting performance_data:', err);
      return res.status(500).send('Error storing performance data');
    }
    res.status(200).send('Performance data stored successfully');
  });
});
*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

// GET all
app.get('/api/static', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM static_data');
    res.json(rows);
  } catch (err) {
    console.error("Error on api/static", err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET by id
app.get('/api/static/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM static_data WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new
app.post('/api/static', async (req, res) => {
  try {
    const [result] = await pool.query('INSERT INTO static_data SET ?', req.body);
    const [rows] = await pool.query('SELECT * FROM static_data WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Write error on api static", err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update
app.put('/api/static/:id', async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE static_data SET ? WHERE id = ?', [req.body, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM static_data WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE
app.delete('/api/static/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM static_data WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// health check
app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
