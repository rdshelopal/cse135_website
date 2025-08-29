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

// Gather async image detection, then send one event
(async () => {
  const imagesEnabled = await detectImagesEnabled();
  const cssEnabled = detectCssEnabled();

  const payload = {
    type: "pageview",
    ts: Date.now(),
    sessionId: sid,
    url: location.href,
    path: location.pathname,
    referrer: document.referrer || null,
    static: {
      ...staticBase,
      imagesEnabled,
      cssEnabled
    }
  };

  fetch("/json/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => { /* ignore for now; retries later */ });
})();
