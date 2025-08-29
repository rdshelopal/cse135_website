// collector.js
fetch("/json/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "pageview",
    ts: Date.now()
  })
});