# Time To First Byte (TTFB)

## TTFB là gì?

TTFB là thời gian từ khi browser gửi request đến khi nhận được **byte đầu tiên** từ server. Đây là thước đo tốc độ phản hồi của server.

**Mục tiêu**: TTFB < **1.3 giây** (Google khuyến nghị < 800ms)

## Nguyên nhân TTFB cao

1. **Server xử lý chậm** — query DB nặng, logic phức tạp
2. **Không có CDN** — server ở xa user
3. **Không cache server-side** — mỗi request đều xử lý lại từ đầu
4. **Hosting yếu** — shared hosting, server thiếu tài nguyên

## Giải pháp

### 1. Server-side Caching

```js
// Redis cache — cache kết quả query DB
import { createClient } from 'redis'

const redis = createClient()

async function getProducts() {
  const cached = await redis.get('products')
  if (cached) return JSON.parse(cached)

  const products = await db.query('SELECT * FROM products')
  await redis.setEx('products', 3600, JSON.stringify(products)) // cache 1 giờ
  return products
}
```

### 2. CDN với Edge Caching

CDN cache response của server ở nhiều vị trí — user nhận response từ node gần nhất:

```nginx
# Cho phép CDN cache response trong 5 phút
add_header Cache-Control "public, s-maxage=300";
```

### 3. Database Optimization

```sql
-- Thêm index cho cột thường xuyên query
CREATE INDEX idx_products_category ON products(category_id);

-- Tránh SELECT * — chỉ lấy cột cần thiết
SELECT id, name, price FROM products WHERE category_id = 1;
```

### 4. HTTP/2 & HTTP/3

HTTP/2 multiplexing giảm overhead kết nối. Bật ở Nginx:

```nginx
listen 443 ssl http2;
```

### 5. Preconnect đến services

```html
<!-- Kết nối sớm đến API server -->
<link rel="preconnect" href="https://api.example.com" />
```

## Đo TTFB

```bash
# curl
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://example.com
```

Hoặc DevTools > Network > chọn request HTML đầu tiên > tab **Timing** > xem **Waiting (TTFB)**.
