# CDN (Content Delivery Network)

## CDN là gì?

CDN là mạng lưới các server phân tán trên toàn cầu. Khi user request file, CDN phục vụ file từ server **gần nhất** với user thay vì server gốc — giúp giảm độ trễ đáng kể.

## Lợi ích

- **Giảm latency**: file được phục vụ từ server gần user
- **Giảm tải server gốc**: CDN cache và xử lý phần lớn requests
- **Tăng tính sẵn sàng**: nếu 1 node CDN lỗi, request được chuyển sang node khác
- **HTTP/2 & HTTP/3**: CDN lớn hỗ trợ các protocol mới nhất

## Nên đưa gì lên CDN?

- Static assets: JS, CSS, ảnh, fonts, video
- Không phù hợp: API responses cần real-time, nội dung cá nhân hóa

## Các CDN phổ biến

| CDN | Phù hợp |
|---|---|
| Cloudflare | Miễn phí, dễ setup, tích hợp DNS |
| AWS CloudFront | Tích hợp tốt với AWS ecosystem |
| Vercel / Netlify | Tự động CDN khi deploy frontend |
| Bunny.net | Rẻ, hiệu năng tốt |

## Cache Control

Cấu hình đúng cache headers để CDN và browser cache hiệu quả:

```nginx
# Static assets có hash trong tên file — cache lâu dài
location ~* \.(js|css|png|jpg|webp|woff2)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML — không cache hoặc cache ngắn
location ~* \.html$ {
  add_header Cache-Control "no-cache";
}
```

## Với Vite

Vite tự động thêm hash vào tên file khi build (`main.abc123.js`), nên bro có thể set `max-age=31536000` an toàn — khi code thay đổi thì tên file thay đổi.

```
dist/
  assets/
    index.Bx3kLm9A.js    ← hash tự động
    index.CqR7nPwE.css
```

## Kiểm tra

- [PageSpeed Insights](https://pagespeed.web.dev/) — gợi ý dùng CDN
- DevTools > Network > xem `x-cache: HIT` trong response headers
