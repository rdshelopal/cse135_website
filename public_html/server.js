// MySQL setup
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
