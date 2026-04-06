# Phân tích Bundle trong React

## Tại sao cần phân tích bundle?

Thư viện bên thứ 3 thường là nguyên nhân chính làm bundle phình to. Phân tích bundle giúp biết được:

- Dependency nào chiếm nhiều KB nhất
- Có đang import thừa không
- Có thể thay thế bằng thư viện nhỏ hơn không

## rollup-plugin-visualizer (Vite)

```bash
npm install -D rollup-plugin-visualizer
```

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,        // tự mở sau khi build
      gzipSize: true,    // hiển thị kích thước sau gzip
      brotliSize: true,
      filename: 'stats.html',
    }),
  ],
})
```

Chạy `npm run build` → `stats.html` mở tự động với treemap tương tác.

## webpack-bundle-analyzer (Create React App / Webpack)

```bash
npm install -D webpack-bundle-analyzer
```

```js
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

## Bundlephobia — kiểm tra trước khi install

Trước khi thêm thư viện mới, kiểm tra kích thước tại [bundlephobia.com](https://bundlephobia.com):

- Xem kích thước minified + gzipped
- Xem có hỗ trợ tree shaking không
- So sánh với alternative

## Các thư viện nặng và alternative

| Thư viện nặng | Kích thước | Alternative nhẹ hơn |
|---|---|---|
| `moment.js` | ~232KB | `date-fns` (~13KB), `dayjs` (~2KB) |
| `lodash` | ~70KB | `lodash-es` + tree shaking, hoặc code tự viết |
| `axios` | ~14KB | `fetch` (built-in) |
| `react-icons` (full) | Rất lớn | Import riêng từng icon |
| `@mui/material` | ~300KB+ | Tree shaking hoặc `@mui/material/Button` |

## Import đúng cách để tree shaking hoạt động

```js
// Xấu — import cả package
import { Button, TextField, Dialog } from '@mui/material'
// Mặc dù MUI hỗ trợ tree shaking, nhưng build tools đôi khi không optimize tốt

// Tốt hơn — import trực tiếp từ module path
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
```

```js
// react-icons — import đúng cách
// Xấu
import { FaHome } from 'react-icons/fa' // vẫn ổn vì đã theo package
// Tốt — đảm bảo chỉ lấy icon cần
import { FaHome } from 'react-icons/fa'
```

## Ví dụ workflow phân tích

```bash
# 1. Build và xem stats
npm run build
# Mở stats.html

# 2. Thấy moment.js chiếm 200KB → thay bằng dayjs
npm uninstall moment
npm install dayjs

# 3. Build lại và so sánh
npm run build
```

## Source Maps cho production (chỉ dev)

Để debug bundle chính xác hơn trong DevTools:

```js
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // chỉ bật khi debug, không deploy public
  },
})
```
