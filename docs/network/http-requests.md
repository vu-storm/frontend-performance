# Giảm HTTP Requests

## Tại sao quan trọng?

Mỗi HTTP request tốn thêm thời gian do DNS lookup, TCP handshake, và độ trễ mạng. Giảm số lượng request là cách đơn giản nhất để tăng tốc tải trang.

## Các kỹ thuật

### 1. Bundle JS/CSS

Gộp nhiều file JS/CSS thành ít file hơn. Vite, Webpack đã làm việc này tự động khi build.

```js
// vite.config.ts — tách vendor riêng để tận dụng cache
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### 2. CSS Sprites (cho icon nhỏ)

Gộp nhiều icon nhỏ thành 1 ảnh, dùng `background-position` để hiển thị từng icon.

```css
.icon-home {
  background-image: url('/sprites.png');
  background-position: 0 0;
  width: 24px;
  height: 24px;
}

.icon-search {
  background-image: url('/sprites.png');
  background-position: -24px 0;
  width: 24px;
  height: 24px;
}
```

> Ngày nay nên dùng **SVG sprite** hoặc **icon font** thay cho PNG sprites.

### 3. Inline SVG nhỏ

Với SVG nhỏ (< 1KB), inline trực tiếp vào HTML để tránh request:

```html
<!-- Thay vì: <img src="/icon.svg"> -->
<svg viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>
```

### 4. Font Icons thay nhiều ảnh

Dùng 1 font file thay vì nhiều file ảnh icon riêng lẻ.

### 5. Tránh import không cần thiết

```js
// Xấu — import cả lodash (~70KB)
import _ from 'lodash'

// Tốt — chỉ import hàm cần dùng
import debounce from 'lodash/debounce'
```

## HTTP/2 & HTTP/3

Với **HTTP/2**, browser có thể gửi nhiều request song song trên 1 kết nối, nên việc gộp file không còn quan trọng như thời HTTP/1.1. Tuy nhiên vẫn nên giảm số request vì:

- Giảm overhead headers
- Giảm parsing time ở browser
- HTTP/1.1 vẫn còn phổ biến

## Kiểm tra

DevTools > Network > xem tổng số requests ở bottom bar. Mục tiêu: **< 50 requests** cho trang thông thường.
