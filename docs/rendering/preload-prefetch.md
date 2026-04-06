# Preload & Prefetch

## Tổng quan

Trình duyệt cho phép "gợi ý" tài nguyên nào nên được tải sớm thông qua các resource hints:

| Hint | Thời điểm tải | Dùng khi |
|---|---|---|
| `preload` | Ngay lập tức, high priority | Tài nguyên cần cho trang hiện tại |
| `prefetch` | Khi browser rảnh, low priority | Tài nguyên cần cho trang tiếp theo |
| `preconnect` | Kết nối sớm đến domain | Biết trước sẽ dùng domain đó |
| `dns-prefetch` | DNS lookup sớm | Tương tự preconnect nhưng nhẹ hơn |

## Preload

Tải ngay với priority cao — dùng cho tài nguyên **quan trọng của trang hiện tại**.

```html
<!-- Preload font -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload LCP image -->
<link rel="preload" href="/hero.webp" as="image" />

<!-- Preload critical CSS -->
<link rel="preload" href="/critical.css" as="style" />

<!-- Preload JS module -->
<link rel="preload" href="/app.js" as="script" />
```

**Cảnh báo**: Đừng preload quá nhiều — gây tranh chấp bandwidth và có thể làm chậm trang.

## Prefetch

Tải trước với priority thấp khi browser rảnh — dùng cho tài nguyên của **trang tiếp theo**.

```html
<!-- Prefetch trang About khi user đang ở trang Home -->
<link rel="prefetch" href="/about" />

<!-- Prefetch JS chunk của route tiếp theo -->
<link rel="prefetch" href="/assets/about.Bx3kLm9A.js" as="script" />
```

## Preconnect

Thiết lập kết nối sớm (DNS + TCP + TLS) đến domain bên ngoài:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- API domain -->
<link rel="preconnect" href="https://api.example.com" />
```

Tiết kiệm ~100–500ms cho mỗi request đến domain đó.

## DNS Prefetch

Nhẹ hơn preconnect — chỉ thực hiện DNS lookup:

```html
<link rel="dns-prefetch" href="https://analytics.google.com" />
```

Dùng khi không chắc sẽ dùng domain đó hay không (giảm risk so với preconnect).

## Với React Router

Prefetch route khi user hover vào link:

```jsx
import { Link } from 'react-router-dom'

// Dùng thư viện như @tanstack/router có built-in prefetch
// Hoặc manual với dynamic import

function NavLink({ to, children }) {
  const prefetch = () => {
    if (to === '/dashboard') import('./pages/Dashboard')
    if (to === '/settings') import('./pages/Settings')
  }

  return (
    <Link to={to} onMouseEnter={prefetch}>
      {children}
    </Link>
  )
}
```

## Kiểm tra

DevTools > Network > lọc theo "Initiator: preload" hoặc xem tab "Priority" để kiểm tra resource hints có hoạt động không.
