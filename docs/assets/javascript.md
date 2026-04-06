# Tối ưu JavaScript

## Minify JavaScript

Vite tự động minify JS khi build (dùng esbuild/Terser):

```bash
vite build  # JS tự động minified + mangled
```

Để kiểm soát hơn:

```js
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // xóa console.log trong production
        drop_debugger: true,
      },
    },
  },
})
```

## Non-blocking JavaScript

```html
<!-- Xấu — block HTML parsing -->
<script src="/app.js"></script>

<!-- defer — tải song song, chạy sau khi HTML parse xong, giữ thứ tự -->
<script src="/app.js" defer></script>

<!-- async — tải song song, chạy ngay khi tải xong (không đảm bảo thứ tự) -->
<script src="/analytics.js" async></script>

<!-- Module script — mặc định defer -->
<script type="module" src="/app.js"></script>
```

**Khi nào dùng gì:**
- `defer` — script phụ thuộc DOM hoặc cần thứ tự
- `async` — script độc lập (analytics, ads, chat widget)
- Đặt `<script>` cuối `<body>` nếu không dùng defer/async

## Tránh nhiều inline script

```html
<!-- Xấu — nhiều inline script rải rác trong HTML -->
<script>var x = 1</script>
<div>...</div>
<script>var y = 2</script>
<div>...</div>
<script>console.log(x + y)</script>

<!-- Tốt — gộp vào 1 file external -->
<script src="/app.js" defer></script>
```

**Vấn đề với nhiều inline script:**
- Không cache được
- Parser phải dừng lại mỗi lần gặp `<script>`
- Khó maintain

## Kiểm tra vấn đề hiệu năng trong JS

### Long Tasks

Task chạy > 50ms trên main thread sẽ block UI — user thấy trang bị lag/freeze.

```js
// Tách task nặng thành chunks nhỏ
async function processLargeArray(items) {
  const CHUNK_SIZE = 100

  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE)
    processChunk(chunk)

    // Nhường main thread sau mỗi chunk
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}
```

### Web Workers

Chuyển tác vụ nặng sang worker thread — không block UI:

```js
// worker.js
self.onmessage = ({ data }) => {
  const result = heavyComputation(data)
  self.postMessage(result)
}

// main.js
const worker = new Worker('/worker.js')
worker.postMessage(largeData)
worker.onmessage = ({ data }) => console.log('Result:', data)
```

### requestIdleCallback

Chạy task khi browser rảnh:

```js
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    tasks.shift()() // chạy 1 task
  }
})
```

## Giữ dependencies cập nhật

Dependencies cũ có thể chứa bug hiệu năng đã được fix ở phiên bản mới:

```bash
# Kiểm tra dependencies lỗi thời
npm outdated

# Update
npm update

# Xem security vulnerabilities
npm audit
```

## Kiểm tra

DevTools > Performance tab > Record > xem **Long Tasks** (màu đỏ trên timeline). Mục tiêu: không có task nào > 50ms.
