// server.js (ESM)
import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import jsonServer from 'json-server';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MONGO_URI, MONGO_DB, PORT = 3000 } = process.env;

let Static, Performance;

async function init() {
  // ---- Mongo connect ----
  const client = new MongoClient(MONGO_URI, { ignoreUndefined: true });
  await client.connect();
  const db = client.db(MONGO_DB);
  Static = db.collection('static');
  Performance = db.collection('performance');
  console.log('✅ Connected to MongoDB');

  // ---- Test route ----
  app.get('/ping', async (_req, res) => {
    const count = await Static.countDocuments().catch(() => 0);
    res.json({ msg: 'pong', staticCount: count });
  });

  // ---------- /api/static (Mongo) ----------
  app.post('/api/static', async (req, res) => {
    try {
      const { ts, sessionId, url, path, referrer, static: s } = req.body || {};
      if (!ts || !sessionId || !s) return res.status(400).json({ error: 'Missing ts/sessionId/static' });

      const doc = {
        ts: Number(ts), sessionId: String(sessionId),
        url: url || null, path: path || null, referrer: referrer || null,
        ua: s.ua, lang: s.lang,
        cookiesEnabled: s.cookiesEnabled ?? null, jsEnabled: s.jsEnabled ?? true,
        screen: s.screen || null, viewport: s.viewport || null, network: s.network || null,
        imagesEnabled: s.imagesEnabled ?? null, cssEnabled: s.cssEnabled ?? null,
        createdAt: new Date()
      };
      const r = await Static.insertOne(doc);
      res.status(201).json({ _id: r.insertedId, ...doc });
    } catch (e) { console.error('POST /api/static', e); res.status(500).json({ error: 'Server error' }); }
  });

  app.get('/api/static', async (req, res) => {
    try {
      const filter = req.query.sessionId ? { sessionId: req.query.sessionId } : {};
      const limit = Math.min(Number(req.query.limit) || 200, 1000);
      const docs = await Static.find(filter).sort({ _id: -1 }).limit(limit).toArray();
      res.json(docs);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
  });

  // ---------- /api/performance (Mongo) ----------
  app.post('/api/performance', async (req, res) => {
    try {
      const { ts, sessionId, url, path, referrer, performance: p } = req.body || {};
      if (!ts || !sessionId || !p) return res.status(400).json({ error: 'Missing ts/sessionId/performance' });

      const doc = {
        ts: Number(ts), sessionId: String(sessionId),
        url: url || null, path: path || null, referrer: referrer || null,
        start: Number(p.start ?? 0), end: Number(p.end ?? 0), totalMs: Number(p.totalMs ?? 0),
        raw: p.raw || null, createdAt: new Date()
      };
      const r = await Performance.insertOne(doc);
      res.status(201).json({ _id: r.insertedId, ...doc });
    } catch (e) { console.error('POST /api/performance', e); res.status(500).json({ error: 'Server error' }); }
  });

  app.get('/api/performance', async (req, res) => {
    try {
      const filter = req.query.sessionId ? { sessionId: req.query.sessionId } : {};
      const limit = Math.min(Number(req.query.limit) || 200, 1000);
      const docs = await Performance.find(filter).sort({ _id: -1 }).limit(limit).toArray();
      res.json(docs);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
  });

  // ---------- json-server under /json ONLY ----------
  const dbPath = 'db.json';
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ events: [], posts: [] }, null, 2));

  // keep your /json/events logger for Part 1
  app.post('/json/events', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    db.events.push(req.body);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json({ ok: true });
  });

  const jsMiddlewares = jsonServer.defaults();
  app.use('/json', jsMiddlewares);
  const router = jsonServer.router(dbPath);
  app.use('/json', router);

  // ---- start ONE server ----
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

init().catch(err => { console.error('Mongo init failed:', err); process.exit(1); });
