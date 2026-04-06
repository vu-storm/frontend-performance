# Page Weight & Load Time

## Mục tiêu

| Metric | Mục tiêu | Lý tưởng |
|---|---|---|
| Page weight | < 1500 KB | < 500 KB |
| Load time | < 3 giây | < 1 giây |
| TTFB | < 1.3 giây | < 800ms |

## Page weight là gì?

Tổng kích thước của tất cả tài nguyên được tải: HTML + CSS + JS + ảnh + fonts + ...

**Thực tế**: Trung bình trang web năm 2024 nặng ~2.5 MB (desktop), ~2.2 MB (mobile). Mục tiêu < 1500 KB là hoàn toàn khả thi với tối ưu đúng cách.

## Phân tích page weight

### DevTools

Network tab > chọn tất cả > xem dòng tổng kết ở bottom:
```
47 requests | 1.2 MB transferred | 3.8 MB resources
```

- **transferred**: kích thước sau nén (qua network)
- **resources**: kích thước sau khi decompress

### WebPageTest

Xem waterfall chart chi tiết — biết resource nào nặng nhất.

## Giảm page weight

### 1. Ảnh — thường chiếm 60-70% page weight

```bash
# Dùng Squoosh để nén ảnh
# Chuyển sang WebP/AVIF
# Dùng srcset để serve đúng kích thước
```

Xem chi tiết: [Tối ưu hình ảnh](/assets/images)

### 2. JavaScript — kiểm tra bundle size

```bash
vite build && npx vite-bundle-visualizer
```

Mục tiêu: JS < 300KB (gzipped)

### 3. Fonts — giới hạn < 300KB

```css
/* Chỉ load font weight cần thiết */
/* Dùng WOFF2 — nhỏ hơn TTF ~30% */
/* Subset font nếu chỉ dùng Latin */
```

Xem chi tiết: [Tối ưu Fonts](/assets/fonts)

### 4. CSS — thường nhỏ nhưng dễ tối ưu

```bash
# PurgeCSS loại bỏ unused CSS
# Minify CSS
```

## Budget Performance

Đặt giới hạn cứng cho bundle size — fail build nếu vượt quá:

```js
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Cảnh báo nếu chunk > 500KB
      },
    },
    chunkSizeWarningLimit: 500, // KB
  },
})
```

Hoặc dùng [bundlesize](https://github.com/siddharthkp/bundlesize) trong CI:

```json
// package.json
{
  "bundlesize": [
    { "path": "./dist/assets/*.js", "maxSize": "300 kB" },
    { "path": "./dist/assets/*.css", "maxSize": "50 kB" }
  ]
}
```

## Load Time

Load time phụ thuộc vào:

1. **Page weight** — kích thước tài nguyên
2. **TTFB** — tốc độ server
3. **Số lượng requests** — số round-trips
4. **Render blocking** — CSS/JS block rendering
5. **Kết nối người dùng** — 4G, wifi, 3G...

Test trên **mobile 4G** thực tế — không chỉ desktop với wifi nhanh. WebPageTest cho phép chọn connection type.
