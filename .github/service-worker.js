const CACHE_NAME = "sage-portal-v1";

const ASSETS = [
  "/sage-portal/",
  "/sage-portal/index.html",
  "/sage-portal/styles.css",
  "/sage-portal/app.js",
  "/sage-portal/payment.html",
  "/sage-portal/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          if (event.request.method === "GET" && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return resp;
        }).catch(() => caches.match("/sage-portal/index.html"))
      );
    })
  );
});
