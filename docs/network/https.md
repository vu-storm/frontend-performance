# HTTPS, Protocol & 404 Errors

## Dùng HTTPS

HTTPS không chỉ bảo mật mà còn ảnh hưởng đến hiệu năng:

- **HTTP/2 và HTTP/3** chỉ hoạt động qua HTTPS
- Browser ưu tiên HTTPS khi ranking
- **HSTS** (HTTP Strict Transport Security) — browser tự redirect sang HTTPS, tránh round-trip redirect

```nginx
# Bật HTTPS và redirect HTTP → HTTPS
server {
  listen 80;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;

  # HSTS — cache redirect trong 1 năm
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

## Serve files từ cùng protocol

Tránh **mixed content** — trang HTTPS load resource qua HTTP:

```html
<!-- Xấu — mixed content, browser có thể block -->
<img src="http://example.com/photo.jpg" />
<script src="http://cdn.example.com/lib.js"></script>

<!-- Tốt — dùng HTTPS -->
<img src="https://example.com/photo.jpg" />

<!-- Tốt hơn — protocol-relative (tự động dùng cùng protocol) -->
<img src="//example.com/photo.jpg" />
```

## Tránh file 404

Request đến file không tồn tại vẫn tốn time DNS + TCP + server response — dù nhỏ nhưng cộng lại đáng kể.

### Nguyên nhân phổ biến

- Đổi tên/di chuyển file mà không update link
- Typo trong đường dẫn
- Ảnh/font bị xóa nhưng CSS vẫn reference
- JS/CSS chunk cũ còn trong cache của user sau khi deploy

### Phát hiện

```bash
# Dùng broken-link-checker
npx broken-link-checker https://your-site.com -ro

# Hoặc xem log server — tìm status 404
grep " 404 " /var/log/nginx/access.log
```

### Xử lý khi đổi URL

```nginx
# 301 redirect khi đổi đường dẫn
location /old-page {
  return 301 /new-page;
}
```

### Với React Router — handle 404 route

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  {/* Catch-all 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Với Vite — chunk cũ bị 404 sau deploy

```js
// vite.config.ts — handle chunk load error
// main.tsx
window.addEventListener('vite:preloadError', () => {
  window.location.reload() // reload để lấy chunk mới nhất
})
```
