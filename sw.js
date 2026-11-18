// オフラインで使うためのサービスワーカー
// まず保存してある版を表示し、つながっていれば裏で最新版を取りに行く（次に開いたときに新しい版になる）
const CACHE = "stat2-v3";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./css/style.css", "./js/tables.js", "./js/topics.js", "./js/questions.js", "./js/drills.js", "./js/app.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request)
      .then(res => { if (res.ok) c.put(e.request, res.clone()); return res; })
      .catch(() => hit);
    return hit || net;
  })));
});
