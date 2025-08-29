// --- session (stable across pageviews) ---
const SID_KEY = "collector_sid";
let sid = localStorage.getItem(SID_KEY);
if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem(SID_KEY, sid); }

// --- static data helpers ---
function detectImagesEnabled() {
  return new Promise((resolve) => {
    // 1x1 data URL avoids network; if images are blocked, onerror should fire
    const img = new Image();
    let settled = false;
    img.onload = () => { if (!settled) { settled = true; resolve(true); } };
    img.onerror = () => { if (!settled) { settled = true; resolve(false); } };
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    // fallback resolve after 300ms in case neither fires (treat as true)
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
    return w === 10; // if CSS applied, width will be 10
  } catch { return null; }
}

// Build the static block (sync pieces first)
const staticBase = {
  ua: navigator.userAgent,
  lang: navigator.language || null,
  cookiesEnabled: navigator.cookieEnabled ?? null,
  jsEnabled: true,
  screen: { w: screen.width, h: screen.height },
  viewport: { w: window.innerWidth, h: window.innerHeight },
  network: (navigator.connection && navigator.connection.effectiveType) || null
};

window.addEventListener("load", async () => {
  // --- performance block (defensive across browsers) ---
    let performanceBlock = {};
    const nav = performance.getEntriesByType("navigation")[0];

    if (nav && nav.toJSON) {
    const j = nav.toJSON();
    const start = j.startTime || 0;
    // prefer loadEventEnd; fall back to domComplete → responseEnd → duration → now()
    let end = j.loadEventEnd || j.domComplete || j.responseEnd || j.duration || 0;
    if (!end || end <= start) end = performance.now();

    performanceBlock = {
        raw: j,
        start,
        end,
        totalMs: Math.max(0, end - start)
    };
    } else if (performance.timing) {
    const t = performance.timing;
    const start = t.navigationStart || 0;
    // legacy fallbacks
    let end = t.loadEventEnd || t.domComplete || t.responseEnd || 0;
    if (!end || end <= start) end = Date.now();
    performanceBlock = {
        raw: t,
        start,
        end,
        totalMs: Math.max(0, end - start)
    };
    }

  // --- async static bits ---
  const imagesEnabled = await detectImagesEnabled();
  const cssEnabled = detectCssEnabled();

  // --- final payload ---
  const payload = {
    type: "pageview",
    ts: Date.now(),
    sessionId: sid,
    url: location.href,
    path: location.pathname,
    referrer: document.referrer || null,
    static: { ...staticBase, imagesEnabled, cssEnabled },
    performance: performanceBlock    // <--- new
  };

  fetch("/json/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
});

