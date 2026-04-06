# Critical Rendering Path

## CRP là gì?

Critical Rendering Path (CRP) là chuỗi bước browser thực hiện để hiển thị trang:

```
HTML → DOM
CSS  → CSSOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
```

Tối ưu CRP = giảm thời gian từ lúc nhận HTML đến lúc user thấy nội dung.

## Render-blocking Resources

CSS và JS mặc định **block rendering** — browser phải tải và xử lý xong mới render tiếp.

### CSS

CSS luôn render-blocking. Cách tối ưu:

```html
<!-- Inline critical CSS trong <head> -->
<style>
  /* Chỉ CSS cần cho above-the-fold content */
  body { margin: 0; font-family: sans-serif; }
  .hero { height: 100vh; background: #f0f0f0; }
</style>

<!-- Non-critical CSS load async -->
<link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/styles/main.css" /></noscript>
```

### JavaScript

```html
<!-- Xấu — block parsing -->
<script src="/app.js"></script>

<!-- Tốt — defer: tải song song, chạy sau khi HTML parse xong -->
<script src="/app.js" defer></script>

<!-- async: tải song song, chạy ngay khi tải xong (không đảm bảo thứ tự) -->
<script src="/analytics.js" async></script>
```

**Dùng `defer`** cho script phụ thuộc vào DOM. **Dùng `async`** cho script độc lập (analytics, ads).

## Core Web Vitals

Google đo hiệu năng CRP qua Core Web Vitals:

| Metric | Đo lường | Mục tiêu |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Thời gian render element lớn nhất | < 2.5s |
| **FID** / **INP** | Độ trễ tương tác đầu tiên | < 100ms |
| **CLS** (Cumulative Layout Shift) | Mức độ layout bị dịch chuyển | < 0.1 |

## Tối ưu LCP

LCP thường là hero image hoặc heading lớn. Ưu tiên tải sớm:

```html
<!-- Preload LCP image -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- Hoặc trực tiếp trên img -->
<img src="/hero.webp" alt="Hero" loading="eager" fetchpriority="high" width="1200" height="600" />
```

## Critical CSS Tools

- **Critical** (npm) — tự động extract critical CSS
- **PurgeCSS** — loại bỏ unused CSS trước
- **Vite Plugin Critical** — tích hợp vào build pipeline

```bash
npm install -D vite-plugin-critical
```

```js
// vite.config.ts
import { defineConfig } from 'vite'
import { critical } from 'vite-plugin-critical'

export default defineConfig({
  plugins: [critical()],
})
```
