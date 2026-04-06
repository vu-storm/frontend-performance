# Service Workers

## Service Worker là gì?

Service Worker là script chạy ở background, tách biệt khỏi trang — hoạt động như một **proxy** giữa browser và network. Cho phép:

- Cache tài nguyên để dùng offline
- Chạy tác vụ nặng không block UI
- Push notifications
- Background sync

## Vòng đời

```
Install → Activate → Fetch (intercepting requests)
```

## Caching với Service Worker

### Cache First (cho static assets)

```js
// sw.js
const CACHE_NAME = 'v1'
const STATIC_ASSETS = ['/', '/index.html', '/styles.css', '/app.js']

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

// Fetch — trả về cache trước, fallback network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request))
  )
})
```

### Network First (cho API)

```js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache response mới
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request)) // fallback cache khi offline
    )
  }
})
```

### Stale While Revalidate

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)

      const fetchPromise = fetch(event.request).then((response) => {
        cache.put(event.request, response.clone())
        return response
      })

      // Trả cache ngay, fetch mới ở background
      return cached ?? fetchPromise
    })
  )
})
```

## Đăng ký Service Worker

```js
// main.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

## Với Vite — vite-plugin-pwa

Cách đơn giản nhất — plugin tự generate service worker:

```bash
npm install -D vite-plugin-pwa
```

```js
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/,
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
  ],
})
```

## Lưu ý

- Service Worker chỉ hoạt động trên **HTTPS** (hoặc localhost)
- Cần xử lý **cache invalidation** khi deploy version mới
- DevTools > Application > Service Workers để debug
