// --- config ---
const ENABLE_PERFORMANCE_ENDPOINT = false; // flip to true when /api/performance is ready

// --- stable session id (kept in case you add columns later) ---
const SID_KEY = "collector_sid";
let sid = localStorage.getItem(SID_KEY);
if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem(SID_KEY, sid); }

// ===================== feature probes =====================
function detectImagesEnabled() {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    img.onload  = () => { if (!settled) { settled = true; resolve(true); } };
    img.onerror = () => { if (!settled) { settled = true; resolve(false); } };
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    setTimeout(() => { if (!settled) resolve(true); }, 300);
  });
}

function detectCssEnabled() {
  try {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.width = "10px";
    document.body.appendChild(el);
    const w = parseInt(getComputedStyle(el).width, 10);
    el.remove();
    return w === 10;
  } catch { return null; }
}

// ===================== env snapshot =====================
const staticBase = {
  ua: navigator.userAgent,
  lang: navigator.language || null,
  cookiesEnabled: navigator.cookieEnabled ?? null,
  screen: { w: screen.width, h: screen.height },
  viewport: { w: window.innerWidth, h: window.innerHeight },
  network: (navigator.connection && navigator.connection.effectiveType) || null
};

// ===================== tiny utils =====================
function toTinyInt(v) {
  if (v === undefined || v === null) return null;
  return v ? 1 : 0;
}
function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ===================== mappers (match DB schema) =====================
// static_data schema:
// id (AI), user_agent TEXT, language VARCHAR(100), cookies_enabled TINYINT(1),
// javascript_enabled TINYINT(1), images_enabled TINYINT(1), css_enabled TINYINT(1),
// screen_width INT, screen_height INT, window_width INT, window_height INT,
// connection_type VARCHAR(100), timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
function buildStaticRow(env) {
  const scr = env.screen || {};
  const vp  = env.viewport || {};
  return {
    user_agent:         env.ua || null,
    language:           env.lang || null,
    cookies_enabled:    toTinyInt(env.cookiesEnabled),
    javascript_enabled: 1, // this script executed
    images_enabled:     toTinyInt(env.imagesEnabled),
    css_enabled:        toTinyInt(env.cssEnabled),
    screen_width:       numOrNull(scr.w),
    screen_height:      numOrNull(scr.h),
    window_width:       numOrNull(vp.w),
    window_height:      numOrNull(vp.h),
    connection_type:    env.network || null
    // omit timestamp -> DB default
  };
}

// Optional performance mapper (adjust to your table when ready)
function buildPerformanceRow(block) {
  return {
    start_ms: block.start ?? null,
    end_ms:   block.end ?? null,
    total_ms: block.totalMs ?? null
    // add columns (url, session_id, raw_json, etc.) when your table has them
  };
}

// ===================== robust POST (fetch keepalive + beacon fallback) =====================
async function postJSON(url, obj) {
  const body = JSON.stringify(obj);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    });
  } catch {
    try { navigator.sendBeacon(url, body); } catch {}
  }
}

// ===================== main =====================
window.addEventListener("load", async () => {
  // performance timings (best-effort)
  let performanceBlock = {};
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav && nav.toJSON) {
    const j = nav.toJSON();
    const start = j.startTime || 0;
    let end = j.loadEventEnd || j.domComplete || j.responseEnd || j.duration || 0;
    if (!end || end <= start) end = performance.now();
    performanceBlock = { start, end, totalMs: Math.max(0, end - start) };
  } else if (performance.timing) {
    const t = performance.timing;
    const start = t.navigationStart || 0;
    let end = t.loadEventEnd || t.domComplete || t.responseEnd || 0;
    if (!end || end <= start) end = Date.now();
    performanceBlock = { start, end, totalMs: Math.max(0, end - start) };
  }

  // async probes
  const imagesEnabled = await detectImagesEnabled();
  const cssEnabled    = detectCssEnabled();

  // finalize env for DB row
  const env = { ...staticBase, imagesEnabled, cssEnabled };

  // 1) static_data
  const staticRow = buildStaticRow(env);
  console.log("Static row build: ", JSON.stringify(staticRow));
  postJSON("/api/static", staticRow);

  // 2) performance_data (only if you enable it and have the table/route)
  if (ENABLE_PERFORMANCE_ENDPOINT) {
    const perfRow = buildPerformanceRow(performanceBlock);
    postJSON("/api/performance", perfRow);
  }
});
