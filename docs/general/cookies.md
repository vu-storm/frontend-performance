# Cookies & Performance

## Tại sao Cookies ảnh hưởng đến hiệu năng?

Browser **tự động gửi tất cả cookies** phù hợp trong mỗi HTTP request đến domain đó — kể cả request cho ảnh, CSS, JS, font. Cookie quá lớn hoặc quá nhiều làm tăng kích thước header của mọi request.

## Giới hạn khuyến nghị

- **Kích thước mỗi cookie**: < 4096 bytes
- **Số lượng cookies**: < 20 cookies mỗi domain

## Kiểm tra cookies

DevTools > Application > Cookies > chọn domain.

Hoặc trong request headers, xem dòng `Cookie:` — nếu quá dài là vấn đề.

## Best Practices

### 1. Chỉ lưu những gì cần thiết

```js
// Xấu — lưu cả object user vào cookie
document.cookie = `user=${JSON.stringify(largeUserObject)}` // có thể > 4KB

// Tốt — chỉ lưu session token, data chi tiết lưu server-side
document.cookie = 'session_id=abc123; Secure; HttpOnly; SameSite=Strict'
```

### 2. Set đúng Domain và Path

```js
// Xấu — cookie gửi cho mọi subdomain và path
document.cookie = 'pref=dark'

// Tốt — giới hạn scope
document.cookie = 'pref=dark; Domain=app.example.com; Path=/dashboard'
```

Cookie scoped hẹp hơn = ít request bị ảnh hưởng hơn.

### 3. Set thời gian sống hợp lý

```js
// Session cookie (xóa khi đóng browser)
document.cookie = 'temp=value'

// Persistent cookie với thời hạn
document.cookie = 'pref=dark; max-age=2592000' // 30 ngày
```

Xóa cookie không dùng nữa bằng `max-age=0`.

### 4. Dùng localStorage thay cookie cho client-only data

Cookie gửi lên server trong mọi request. Nếu dữ liệu chỉ dùng ở client — dùng `localStorage` hoặc `sessionStorage`:

```js
// Xấu — preferences không cần server biết nhưng gửi lên mỗi request
document.cookie = 'theme=dark; fontSize=16px; sidebarOpen=true'

// Tốt — chỉ lưu ở client, không tốn bandwidth
localStorage.setItem('theme', 'dark')
localStorage.setItem('fontSize', '16')
```

### 5. Cookie-free domain cho static assets

Nếu site dùng nhiều cookies, host static assets (ảnh, CSS, JS) trên subdomain riêng không có cookies:

```
# Cookies set cho example.com — gửi theo mọi request đến example.com
# Nhưng không gửi đến static.example.com
https://static.example.com/hero.webp  ← không bị cookie overhead
```

CDN tự động xử lý việc này vì domain CDN khác domain chính.
