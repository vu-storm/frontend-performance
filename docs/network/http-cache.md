# HTTP Cache Headers

## Tại sao quan trọng?

Cache đúng cách giúp browser không cần tải lại file đã có — tiết kiệm bandwidth và giảm load time đáng kể cho lần truy cập tiếp theo.

## Cache-Control

Header quan trọng nhất để kiểm soát caching:

```
Cache-Control: public, max-age=31536000, immutable
```

| Directive | Ý nghĩa |
|---|---|
| `public` | Có thể cache ở CDN và browser |
| `private` | Chỉ cache ở browser, không cache ở CDN |
| `no-cache` | Phải validate với server trước khi dùng cache |
| `no-store` | Không cache gì cả |
| `max-age=N` | Cache trong N giây |
| `immutable` | File không bao giờ thay đổi — bỏ qua revalidation |
| `stale-while-revalidate=N` | Dùng cache cũ trong khi revalidate ngầm |

## Chiến lược theo loại file

```nginx
# Static assets có content hash trong tên file (main.abc123.js)
# → cache vĩnh viễn, an toàn vì hash thay đổi khi nội dung thay đổi
location ~* \.(js|css|woff2|png|jpg|webp|avif|svg)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML — không cache hoặc cache rất ngắn
# → cần load mới nhất để lấy đúng hash của assets
location ~* \.html$ {
  add_header Cache-Control "no-cache";
}

# API responses — thường không cache
location /api/ {
  add_header Cache-Control "no-store";
}
```

## ETag & Last-Modified

Dùng để **revalidate** cache — browser gửi lại điều kiện, server trả 304 (Not Modified) nếu file chưa đổi:

```
# Request lần đầu — server trả về:
ETag: "abc123"
Last-Modified: Sun, 06 Apr 2025 10:00:00 GMT

# Request lần sau — browser gửi:
If-None-Match: "abc123"
If-Modified-Since: Sun, 06 Apr 2025 10:00:00 GMT

# Nếu file chưa đổi → server trả 304, không gửi lại body
HTTP/1.1 304 Not Modified
```

## stale-while-revalidate

Pattern hiện đại — dùng cache ngay, revalidate ngầm:

```
Cache-Control: max-age=60, stale-while-revalidate=3600
```

- Trong 60 giây: dùng cache, không hỏi server
- 60s–3660s: dùng cache cũ ngay, đồng thời fetch mới ở background
- Sau 3660s: bắt buộc fetch mới

## Kiểm tra

DevTools > Network > chọn 1 request > xem tab **Headers**:
- Response headers: `Cache-Control`, `ETag`, `Last-Modified`
- Xem cột **Size**: `(disk cache)` hoặc `(memory cache)` = đang dùng cache
