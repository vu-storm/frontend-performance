# Tối ưu CSS

## Minify CSS

Loại bỏ comments, whitespace, rút ngắn tên màu — giảm kích thước file.

Vite tự động minify CSS khi build production (dùng LightningCSS). Không cần cấu hình thêm:

```bash
vite build  # CSS tự động minified
```

Kết quả:
```css
/* Trước — 500 bytes */
.button {
  background-color: #ffffff;
  padding: 12px 24px;
  /* border radius */
  border-radius: 4px;
}

/* Sau — 60 bytes */
.button{background-color:#fff;padding:12px 24px;border-radius:4px}
```

## CSS Non-blocking

CSS mặc định **block rendering** — browser phải tải và parse xong CSS mới render. Giải pháp:

### Load CSS không quan trọng async

```html
<!-- Load async, không block rendering -->
<link
  rel="preload"
  href="/styles/non-critical.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="/styles/non-critical.css" /></noscript>
```

### Media queries để tách CSS

```html
<!-- CSS này chỉ áp dụng khi print → không block render trên màn hình -->
<link rel="stylesheet" href="/print.css" media="print" />

<!-- Chỉ áp dụng trên màn hình nhỏ -->
<link rel="stylesheet" href="/mobile.css" media="(max-width: 768px)" />
```

## Inline Critical CSS

CSS của phần **above the fold** (phần user nhìn thấy đầu tiên khi vào trang) nên được inline trong `<head>` — tránh thêm 1 round-trip để fetch file CSS.

```html
<head>
  <!-- Inline critical CSS -->
  <style>
    body { margin: 0; font-family: sans-serif; background: #fff; }
    .nav { height: 60px; background: #333; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .hero h1 { font-size: 2.5rem; color: #111; }
  </style>

  <!-- Non-critical CSS load async -->
  <link rel="preload" href="/styles/main.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
</head>
```

**Tool tự động extract critical CSS:**

```bash
npm install -D critical
```

```js
// scripts/critical.js
import critical from 'critical'

await critical.generate({
  base: 'dist/',
  src: 'index.html',
  target: 'index.html',
  inline: true,
  width: 1300,
  height: 900,
})
```

## Tránh inline/embedded CSS

```html
<!-- Xấu — inline style khó maintain, không tái sử dụng, tăng HTML size -->
<div style="color: red; font-size: 16px; margin: 10px;">Text</div>

<!-- Xấu — embedded CSS trong HTML -->
<style>
  .title { color: red; }
</style>

<!-- Tốt — external stylesheet, browser cache được -->
<link rel="stylesheet" href="/styles.css" />
```

**Ngoại lệ**: Critical CSS inline (xem phần trên) là hợp lệ.

## Phân tích độ phức tạp stylesheet

CSS phức tạp ảnh hưởng đến render performance:

```css
/* Xấu — selector quá cụ thể, khó override, chậm parse */
body div.container ul li a:hover span.text { color: red; }

/* Tốt — selector đơn giản */
.nav-link:hover { color: red; }
```

**Tools:**
- DevTools > Coverage — xem % CSS được dùng
- [CSS Stats](https://cssstats.com) — phân tích specificity, selector complexity

## Remove Unused CSS

```bash
npm install -D @fullhuman/postcss-purgecss
```

```js
// postcss.config.js
export default {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
      safelist: ['active', 'open', /^data-/], // giữ lại class động
    },
  },
}
```

Với **Tailwind CSS**, cấu hình `content` trong `tailwind.config.js` đã tự purge unused classes.
