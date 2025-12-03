const CACHE_NAME = "fitsync-cache-v1";
const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Don't cache NextAuth routes
const AUTH_IGNORE = [
  '/api/auth/',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/providers'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Don't cache NextAuth routes
  if (AUTH_IGNORE.some(path => url.includes(path))) {
    // bypass service worker — let the browser handle it
    return;
  }

  // Also exclude auth and onboarding pages to prevent caching issues
  if (event.request.url.includes('/auth') || event.request.url.includes('/onboarding')) return;

  // Check if the request is for navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If the response is successful, return it
          if (response.status === 200) {
            return response;
          }

          // Otherwise, try to get from cache or return offline page
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match("/offline");
            });
        })
        .catch(() => {
          // If fetch fails, return offline page from cache
          return caches.match("/offline")
            .then((offlineResponse) => {
              return offlineResponse || new Response("You are offline. Some features may be unavailable.", {
                status: 200,
                headers: { "Content-Type": "text/html" }
              });
            });
        })
    );
  } else {
    // For other requests (images, scripts, etc.), use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return cached response if found, otherwise fetch from network
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache network response if it's valid
              if (networkResponse.status === 200 &&
                  networkResponse.type === 'basic' &&
                  event.request.destination !== 'document') {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // If network request fails, return cached response if available
              return cachedResponse;
            });
        })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});