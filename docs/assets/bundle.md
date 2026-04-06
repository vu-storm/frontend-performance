# Tối ưu Bundle JS/CSS

## Minification

Loại bỏ whitespace, comments, rút ngắn tên biến — giảm kích thước file mà không thay đổi behavior.

Vite và Webpack tự động minify khi build production:

```bash
vite build  # tự động minify JS (esbuild) và CSS
```

## Tree Shaking

Loại bỏ code không được dùng trong final bundle. Chỉ hoạt động với **ES Modules** (`import/export`).

```js
// Xấu — import cả thư viện
import _ from 'lodash'           // ~70KB
import * as R from 'ramda'       // ~50KB

// Tốt — named import, bundler chỉ giữ lại phần cần dùng
import { debounce } from 'lodash-es'
import { map, filter } from 'ramda'
```

> Dùng `lodash-es` thay `lodash` vì `lodash-es` dùng ES Modules, hỗ trợ tree shaking.

## Code Splitting

Tách bundle thành nhiều chunk nhỏ, chỉ tải chunk cần thiết. Xem chi tiết ở [phần React](/react/code-splitting).

```js
// Dynamic import — tạo chunk riêng
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
```

## Phân tích Bundle

```bash
# Vite
npm install -D rollup-plugin-visualizer
```

```js
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true }), // mở treemap sau khi build
  ],
})
```

Sau đó chạy `vite build` và file `stats.html` sẽ tự mở — thấy được dependency nào chiếm nhiều kBs nhất.

## Tách vendor chunk

```js
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

Lợi ích: vendor chunk thay đổi ít hơn code của mình → browser cache được lâu hơn.

## Unused CSS

```bash
# PurgeCSS — loại bỏ CSS không dùng
npm install -D @fullhuman/postcss-purgecss
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    },
  },
}
```

> Với Tailwind CSS, cấu hình `content` trong `tailwind.config.js` đã tự động purge unused classes.

## Compression

Xem thêm tại [Nén dữ liệu](/network/compression). Vite có thể pre-compress file khi build:

```js
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [viteCompression({ algorithm: 'brotliCompress' })],
})
```

## Checklist

- [ ] Build production (`vite build` / `npm run build`)
- [ ] Minification bật (mặc định)
- [ ] Tree shaking hoạt động (dùng ES Modules)
- [ ] Phân tích bundle với visualizer
- [ ] Vendor chunk tách riêng
- [ ] Bật nén GZIP/Brotli ở server
