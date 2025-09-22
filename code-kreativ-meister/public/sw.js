// Service Worker for Code-Kreativ-Meister
// Provides offline functionality, push notifications, and caching

const CACHE_NAME = 'code-kreativ-meister-v1.0.0';
const STATIC_CACHE_NAME = 'static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/videos/,
  /\/api\/users/,
  /\/api\/venues/,
  /\/api\/events/,
];

// Files that should always be fetched from network
const NETWORK_FIRST_PATTERNS = [
  /\/api\/auth/,
  /\/api\/payments/,
  /\/api\/live/,
  /\/api\/chat/,
];

// Maximum cache size limits
const MAX_CACHE_SIZE = 50; // Maximum number of items in dynamic cache
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticFile(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    if (isNetworkFirstAPI(request)) {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received');

  let notificationData = {
    title: 'Code-Kreativ-Meister',
    body: 'Sie haben eine neue Benachrichtigung',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Failed to parse push data:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions || [],
      vibrate: notificationData.vibrate || [200, 100, 200],
      requireInteraction: notificationData.requireInteraction || false,
      silent: notificationData.silent || false
    })
  );
});

// Notification click event - handle notification interactions
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Handle different notification actions
        let targetUrl = '/';

        switch (data.type) {
          case 'message':
            targetUrl = `/chat/${data.sender}`;
            break;
          case 'like':
          case 'comment':
            targetUrl = `/video/${data.videoId}`;
            break;
          case 'follower':
            targetUrl = `/profile/${data.username}`;
            break;
          case 'live-stream':
            targetUrl = `/live/${data.streamId}`;
            break;
          case 'gift':
            targetUrl = `/gifts`;
            break;
          default:
            targetUrl = '/';
        }

        // Handle specific actions
        if (action === 'reply') {
          targetUrl += '?action=reply';
        } else if (action === 'follow-back') {
          targetUrl += '?action=follow';
        }

        // Try to focus existing window or open new one
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              data: { action, targetUrl, notificationData: data }
            });
            return client.focus();
          }
        }

        // Open new window if no existing window found
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Background sync event - handle offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);

  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'background-sync-likes') {
    event.waitUntil(syncLikes());
  } else if (event.tag === 'background-sync-comments') {
    event.waitUntil(syncComments());
  }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_VIDEO':
      event.waitUntil(cacheVideo(data.videoUrl));
      break;
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(data.cacheName));
      break;
    case 'GET_CACHE_SIZE':
      event.waitUntil(getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      }));
      break;
  }
});

// Caching strategies

// Cache First - for static files and images
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline - Content not available', { status: 503 });
  }
}

// Network First - for critical API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && isAPIRequest(request)) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    console.error('Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - Service unavailable', { 
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Service unavailable offline' })
    });
  }
}

// Stale While Revalidate - for API data that can be stale
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions

function isStaticFile(request) {
  const url = new URL(request.url);
  return STATIC_FILES.some(file => url.pathname === file) ||
         url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isNetworkFirstAPI(request) {
  const url = new URL(request.url);
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         request.url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);
}

// Limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Clear old cache entries
async function clearOldCacheEntries() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const keys = await cache.keys();
  const now = Date.now();

  for (const key of keys) {
    const response = await cache.match(key);
    const dateHeader = response.headers.get('date');
    if (dateHeader) {
      const responseDate = new Date(dateHeader).getTime();
      if (now - responseDate > MAX_CACHE_AGE) {
        await cache.delete(key);
      }
    }
  }
}

// Background sync functions

async function syncMessages() {
  try {
    // Get pending messages from IndexedDB
    const pendingMessages = await getPendingMessages();
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
        
        if (response.ok) {
          await removePendingMessage(message.id);
        }
      } catch (error) {
        console.error('Failed to sync message:', error);
      }
    }
  } catch (error) {
    console.error('Message sync failed:', error);
  }
}

async function syncLikes() {
  try {
    const pendingLikes = await getPendingLikes();
    
    for (const like of pendingLikes) {
      try {
        const response = await fetch(`/api/videos/${like.videoId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(like)
        });
        
        if (response.ok) {
          await removePendingLike(like.id);
        }
      } catch (error) {
        console.error('Failed to sync like:', error);
      }
    }
  } catch (error) {
    console.error('Like sync failed:', error);
  }
}

async function syncComments() {
  try {
    const pendingComments = await getPendingComments();
    
    for (const comment of pendingComments) {
      try {
        const response = await fetch(`/api/videos/${comment.videoId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comment)
        });
        
        if (response.ok) {
          await removePendingComment(comment.id);
        }
      } catch (error) {
        console.error('Failed to sync comment:', error);
      }
    }
  } catch (error) {
    console.error('Comment sync failed:', error);
  }
}

// Cache management functions

async function cacheVideo(videoUrl) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const response = await fetch(videoUrl);
    if (response.ok) {
      await cache.put(videoUrl, response);
      console.log('Video cached:', videoUrl);
    }
  } catch (error) {
    console.error('Failed to cache video:', error);
  }
}

async function clearCache(cacheName) {
  try {
    const deleted = await caches.delete(cacheName || DYNAMIC_CACHE_NAME);
    console.log('Cache cleared:', cacheName, deleted);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalSize += keys.length;
    }
    
    return totalSize;
  } catch (error) {
    console.error('Failed to get cache size:', error);
    return 0;
  }
}

// IndexedDB helper functions (mock implementations)
async function getPendingMessages() {
  // In a real implementation, this would use IndexedDB
  return JSON.parse(localStorage.getItem('pendingMessages') || '[]');
}

async function removePendingMessage(id) {
  const messages = await getPendingMessages();
  const filtered = messages.filter(msg => msg.id !== id);
  localStorage.setItem('pendingMessages', JSON.stringify(filtered));
}

async function getPendingLikes() {
  return JSON.parse(localStorage.getItem('pendingLikes') || '[]');
}

async function removePendingLike(id) {
  const likes = await getPendingLikes();
  const filtered = likes.filter(like => like.id !== id);
  localStorage.setItem('pendingLikes', JSON.stringify(filtered));
}

async function getPendingComments() {
  return JSON.parse(localStorage.getItem('pendingComments') || '[]');
}

async function removePendingComment(id) {
  const comments = await getPendingComments();
  const filtered = comments.filter(comment => comment.id !== id);
  localStorage.setItem('pendingComments', JSON.stringify(filtered));
}

// Periodic cleanup
setInterval(() => {
  clearOldCacheEntries();
}, 60 * 60 * 1000); // Run every hour

console.log('Service Worker loaded successfully');
