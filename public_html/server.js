// Mongo setup
// at very top (ESM style)
import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MONGO_URI, MONGO_DB, PORT = 3000 } = process.env;

// Make these available to your routes later
let db;
export let Static, Performance;

async function init() {
  const client = new MongoClient(MONGO_URI, { ignoreUndefined: true });
  await client.connect();
  db = client.db(MONGO_DB);
  Static = db.collection('static');
  Performance = db.collection('performance');
  console.log('✅ Connected to MongoDB');

  // quick test route
  app.get('/ping', async (_req, res) => {
    const count = await Static.countDocuments().catch(() => 0);
    res.json({ msg: 'pong', staticCount: count });
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

init().catch(err => {
  console.error('Mongo init failed:', err);
  process.exit(1);
});

// ---- STATIC: create & read ----
app.post('/api/static', async (req, res) => {
  try {
    const { ts, sessionId, url, path, referrer, static: s } = req.body || {};
    if (!ts || !sessionId || !s) return res.status(400).json({ error: 'Missing ts/sessionId/static' });

    const doc = {
      ts: Number(ts),
      sessionId: String(sessionId),
      url: url || null,
      path: path || null,
      referrer: referrer || null,
      ua: s.ua,
      lang: s.lang,
      cookiesEnabled: s.cookiesEnabled ?? null,
      jsEnabled: s.jsEnabled ?? true,
      screen: s.screen || null,
      viewport: s.viewport || null,
      network: s.network || null,
      imagesEnabled: s.imagesEnabled ?? null,
      cssEnabled: s.cssEnabled ?? null,
      createdAt: new Date()
    };

    const r = await Static.insertOne(doc);
    res.status(201).json({ _id: r.insertedId, ...doc });
  } catch (e) {
    console.error('POST /api/static', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/static', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const docs = await Static.find(filter).sort({ _id: -1 }).limit(limit).toArray();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- PERFORMANCE: create & read ----
app.post('/api/performance', async (req, res) => {
  try {
    const { ts, sessionId, url, path, referrer, performance: p } = req.body || {};
    if (!ts || !sessionId || !p) return res.status(400).json({ error: 'Missing ts/sessionId/performance' });

    const doc = {
      ts: Number(ts),
      sessionId: String(sessionId),
      url: url || null,
      path: path || null,
      referrer: referrer || null,
      start: Number(p.start ?? 0),
      end: Number(p.end ?? 0),
      totalMs: Number(p.totalMs ?? 0),
      raw: p.raw || null,
      createdAt: new Date()
    };

    const r = await Performance.insertOne(doc);
    res.status(201).json({ _id: r.insertedId, ...doc });
  } catch (e) {
    console.error('POST /api/performance', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/performance', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const docs = await Performance.find(filter).sort({ _id: -1 }).limit(limit).toArray();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
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
