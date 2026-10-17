// Blacklock XI offline support.
// Keeps a copy of the app on the phone so it opens with no signal, and serves hole map photos that were
// downloaded for offline use. Scores themselves are kept offline by Firestore, not by this file.
const APP = "bx-app-v1", TILES = "bx-tiles", LIBS = "bx-libs-v2";
const CORE = ["./", "config.js", "logo.png", "favicon.png", "apple-touch-icon.png", "icon-192.png", "manifest.webmanifest"];
const EXTRA = [
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
];
const FONTS_CSS = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap";

async function put(cacheName, url){
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (res.ok) { await (await caches.open(cacheName)).put(url, res.clone()); return res; }
  } catch {}
  return null;
}
self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const app = await caches.open(APP);
    await app.addAll(CORE);
    // The pin sheet pictures, so the Pin popup works with no signal.
    await Promise.all(["tour2", "stadium2"].flatMap(c => [`pins/${c}-sheet.jpg`, ...Array.from({ length: 18 }, (_, i) => `pins/${c}-${i + 1}.jpg`)]).map(u => app.add(u).catch(() => {})));
    // Nice to have offline; a failure here mustn't stop the app installing.
    await Promise.all(EXTRA.map(u => put(LIBS, u)));
    const css = await put(LIBS, FONTS_CSS);
    if (css) { const urls = [...(await css.text()).matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]); await Promise.all(urls.map(u => put(LIBS, u))); }
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (![APP, TILES, LIBS].includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

const isTile = url => url.hostname === "server.arcgisonline.com" && url.pathname.includes("/World_Imagery/MapServer/tile/");
const isLib = url => ["www.gstatic.com", "cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"].includes(url.hostname)
  && !url.pathname.includes("/firestore/");

self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (isTile(url)) return e.respondWith(tile(req, url));
  if (url.origin === self.location.origin) {
    if (url.searchParams.has("build")) return; // the app's own update check must always reach the network
    if (req.mode === "navigate") return e.respondWith(page(req));
    return e.respondWith(fresh(req, APP));
  }
  if (isLib(url)) return e.respondWith(cacheFirst(req, LIBS));
});

// The page: the network if it answers within a few seconds (so updates arrive), else the saved copy.
async function page(req){
  const cache = await caches.open(APP);
  const net = fetch(req).then(res => { if (res.ok) cache.put("./", res.clone()); return res; });
  const timeout = new Promise(r => setTimeout(r, 3500));
  try {
    const res = await Promise.race([net, timeout]);
    if (res) return res;
  } catch {}
  return (await cache.match("./")) || net;
}
// Other app files: the saved copy straight away, refreshed in the background.
async function fresh(req, name){
  const cache = await caches.open(name), hit = await cache.match(req, { ignoreSearch: true });
  const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
}
async function cacheFirst(req, name){
  const cache = await caches.open(name), hit = await cache.match(req.url);
  if (hit) return hit;
  try {
    const res = await fetch(req.url, { mode: "cors", credentials: "omit" });
    if (res.ok) cache.put(req.url, res.clone());
    return res;
  } catch { return fetch(req); }
}
// Hole map photos: from the phone when saved, otherwise the network, saving what's seen along the way.
async function tile(req, url){
  const cache = await caches.open(TILES), hit = await cache.match(url.href);
  if (hit) return hit;
  try {
    const res = await fetch(url.href, { mode: "cors", credentials: "omit" });
    if (res.ok) cache.put(url.href, res.clone());
    return res;
  } catch {
    // No signal, or the photo service didn't allow a saveable copy: fall back to a plain request.
    try { return await fetch(req); } catch { return new Response("", { status: 504 }); }
  }
}
