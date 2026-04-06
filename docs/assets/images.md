# Tối ưu hình ảnh

Hình ảnh thường chiếm **60–70% kích thước trang**. Tối ưu ảnh là một trong những việc có tác động lớn nhất đến hiệu năng.

## Chọn đúng định dạng

| Format | Dùng khi | Ưu điểm |
|---|---|---|
| **WebP** | Hầu hết trường hợp | Nhỏ hơn JPEG ~25–34%, hỗ trợ transparency |
| **AVIF** | Muốn nén tối đa | Nhỏ hơn WebP ~20%, nhưng encode chậm |
| **SVG** | Icon, logo, đồ họa vector | Scale không vỡ, kích thước nhỏ |
| **JPEG** | Ảnh chụp khi cần fallback | Phổ biến, hỗ trợ rộng |
| **PNG** | Cần transparency, fallback | Lossless |

### Dùng `<picture>` cho fallback

```html
<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero image" width="1200" height="600" />
</picture>
```

## Lazy Loading

Chỉ tải ảnh khi user scroll đến gần — tránh tải ảnh không cần thiết khi vào trang.

```html
<!-- Native lazy loading -->
<img src="/photo.webp" alt="Photo" loading="lazy" />

<!-- Không lazy load ảnh above the fold -->
<img src="/hero.webp" alt="Hero" loading="eager" fetchpriority="high" />
```

## Responsive Images với `srcset`

Phục vụ ảnh có kích thước phù hợp với màn hình:

```html
<img
  src="/photo-800.webp"
  srcset="
    /photo-400.webp  400w,
    /photo-800.webp  800w,
    /photo-1200.webp 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="Photo"
  width="1200"
  height="800"
/>
```

## Kích thước & Width/Height

Luôn khai báo `width` và `height` để tránh **CLS (Cumulative Layout Shift)**:

```html
<!-- Tốt — browser biết trước tỉ lệ ảnh, không bị layout shift -->
<img src="/photo.webp" alt="Photo" width="800" height="450" />
```

## Nén ảnh

- **Squoosh** (squoosh.app) — nén online, hỗ trợ WebP/AVIF
- **Sharp** — xử lý ảnh phía server/build time với Node.js

```js
// sharp — resize và convert sang WebP
import sharp from 'sharp'

await sharp('input.jpg')
  .resize(800)
  .webp({ quality: 80 })
  .toFile('output.webp')
```

## Với React

```jsx
// Next.js — dùng <Image> component (tự động tối ưu)
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // tương đương loading="eager"
/>

// Vite project — dùng HTML native attributes
<img src="/hero.webp" alt="Hero" width={1200} height={600} loading="eager" />
```
