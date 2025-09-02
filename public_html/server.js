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


// app.js file
var jsonServer = require('json-server');
var fs = require('fs'); // ⬅ needed to read/write db.json
var server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser); // Needed to read POST/PUT body

// Helper functions to read and write db.json
function readDB() {
  const data = fs.readFileSync('db.json', 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
}

// ✅ GET /api/static → Return all events
server.get('/api/static', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

// ✅ GET /api/static/:id → Return one event by ID
server.get('/api/static/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const event = db.events.find(e => e.id === id);
  if (event) res.json(event);
  else res.status(404).json({ error: 'Event not found' });
});

// ✅ POST /api/static → Add a new event
server.post('/api/static', (req, res) => {
  const db = readDB();
  const newId = db.events.length ? db.events[db.events.length - 1].id + 1 : 1;
  const newEvent = { id: newId, ...req.body };
  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

// ✅ PUT /api/static/:id → Update an event by ID
server.put('/api/static/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.events.findIndex(e => e.id === id);
  if (index !== -1) {
    db.events[index] = { id, ...req.body };
    writeDB(db);
    res.json(db.events[index]);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// ✅ DELETE /api/static/:id → Delete an event by ID
server.delete('/api/static/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const filtered = db.events.filter(e => e.id !== id);
  if (filtered.length !== db.events.length) {
    db.events = filtered;
    writeDB(db);
    res.status(204).end(); // No content
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// Use json-server default routes too (for /posts and /events)
var router = jsonServer.router('db.json');
server.use(router);

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
