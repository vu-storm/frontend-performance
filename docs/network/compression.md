# Nén dữ liệu (GZIP / Brotli)

## Tại sao quan trọng?

Nén dữ liệu giúp giảm kích thước file truyền qua mạng, từ đó giảm thời gian tải trang. Đây là một trong những cách hiệu quả nhất để cải thiện hiệu năng — thường giảm được **60–80%** kích thước file text.

## GZIP vs Brotli

| | GZIP | Brotli |
|---|---|---|
| Hỗ trợ | Hầu hết mọi browser/server | Chrome, Firefox, Edge, Safari |
| Tỉ lệ nén | Tốt | Tốt hơn ~20–26% |
| Tốc độ nén | Nhanh | Chậm hơn ở level cao |
| Khuyến nghị | Fallback | Ưu tiên dùng |

## Cách bật

### Nginx

```nginx
# Brotli (cần module ngx_brotli)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/javascript application/json image/svg+xml;

# GZIP fallback
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
```

### Express (Node.js)

```js
import compression from 'compression'
import express from 'express'

const app = express()
app.use(compression()) // tự chọn GZIP hoặc Brotli tùy client
```

### Vite

Vite build ra file tĩnh — bật nén ở server hosting (Nginx, Vercel, Netlify) là đủ. Hoặc dùng plugin để pre-compress:

```js
// vite.config.ts
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({ algorithm: 'brotliCompress' }),
    viteCompression({ algorithm: 'gzip' }),
  ],
})
```

## Lưu ý

- Chỉ nén **text-based files**: HTML, CSS, JS, JSON, SVG. Không nén ảnh JPEG/PNG/WebP vì chúng đã được nén sẵn.
- Đặt `Content-Encoding` header đúng để browser biết giải nén.
- Kiểm tra bằng DevTools > Network > xem cột `Content-Encoding`.
