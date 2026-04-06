# Tối ưu HTML

## Minify HTML

Loại bỏ comments, whitespace thừa, xuống dòng không cần thiết trong HTML.

Với Vite, HTML được minify tự động khi build production.

Thủ công với `html-minifier-terser`:

```bash
npm install -D html-minifier-terser
```

```js
// scripts/minify-html.js
import { minify } from 'html-minifier-terser'
import { readFileSync, writeFileSync } from 'fs'

const html = readFileSync('dist/index.html', 'utf-8')
const minified = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
})

writeFileSync('dist/index.html', minified)
```

Kết quả điển hình: giảm **10–20%** kích thước HTML.

## Tối ưu cấu trúc HTML

### Thứ tự trong `<head>`

```html
<head>
  <!-- 1. Meta charset — phải đầu tiên -->
  <meta charset="UTF-8" />

  <!-- 2. Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- 3. Preconnect đến external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />

  <!-- 4. Critical CSS inline -->
  <style>/* above-the-fold CSS */</style>

  <!-- 5. Preload tài nguyên quan trọng -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
  <link rel="preload" href="/hero.webp" as="image" />

  <!-- 6. Title và meta -->
  <title>Page Title</title>
  <meta name="description" content="..." />

  <!-- 7. Non-critical CSS -->
  <link rel="stylesheet" href="/styles.css" />
</head>
```

### Giảm DOM size

DOM lớn ảnh hưởng đến render performance và memory:

- **Mục tiêu**: < 1500 nodes tổng
- < 32 levels deep
- < 60 children mỗi parent

```jsx
// Xấu — wrapper lồng nhau không cần thiết
<div>
  <div>
    <div>
      <div>
        <p>Content</p>
      </div>
    </div>
  </div>
</div>

// Tốt
<p>Content</p>
```

Với React, dùng `Fragment` thay `<div>` wrapper:

```jsx
// Xấu — thêm div thừa vào DOM
return (
  <div>
    <Header />
    <Main />
  </div>
)

// Tốt — không thêm node vào DOM
return (
  <>
    <Header />
    <Main />
  </>
)
```

## Minimize iframes

Mỗi iframe là 1 browsing context riêng — tốn memory và ảnh hưởng performance:

```html
<!-- Lazy load iframe -->
<iframe src="https://www.youtube.com/embed/xxx" loading="lazy" title="Video"></iframe>

<!-- Thay thế: dùng facade (ảnh thumbnail) cho đến khi user click -->
```

### YouTube Facade Pattern

```jsx
function YouTubeEmbed({ videoId }) {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return (
      <div
        style={{ cursor: 'pointer', position: 'relative' }}
        onClick={() => setLoaded(true)}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          loading="lazy"
        />
        <button>▶ Play</button>
      </div>
    )
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title="YouTube video"
      allow="autoplay"
    />
  )
}
```

Cách này tránh load YouTube iframe scripts (~500KB) cho đến khi user thực sự muốn xem.
