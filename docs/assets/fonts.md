# Tối ưu Fonts

Web fonts có thể làm chậm trang đáng kể nếu không được tối ưu đúng cách — gây ra **FOIT** (Flash of Invisible Text) hoặc **FOUT** (Flash of Unstyled Text).

## Chọn đúng định dạng

| Format | Hỗ trợ | Khuyến nghị |
|---|---|---|
| **WOFF2** | Chrome, Firefox, Safari, Edge | Ưu tiên — nén tốt nhất |
| **WOFF** | Gần như tất cả | Fallback cho WOFF2 |
| TTF/OTF | Cũ | Không cần thiết |

## Font Display

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2'),
       url('/fonts/inter.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* hiển thị font fallback ngay, swap khi font tải xong */
}
```

### Các giá trị `font-display`

| Giá trị | Hành vi |
|---|---|
| `auto` | Mặc định của browser |
| `block` | Ẩn text cho đến khi font tải xong (FOIT) |
| `swap` | Dùng fallback ngay, swap khi font sẵn sàng (FOUT) |
| `fallback` | Block ngắn (~100ms), rồi dùng fallback nếu chưa tải xong |
| `optional` | Block ngắn, dùng fallback nếu chưa tải — không swap |

**Khuyến nghị**: Dùng `swap` cho body text, `optional` cho font ít quan trọng.

## Preload font quan trọng

```html
<head>
  <link
    rel="preload"
    href="/fonts/inter-400.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

> `crossorigin` bắt buộc phải có kể cả khi font cùng origin.

## Chỉ load font weight cần thiết

```css
/* Chỉ load 400 và 700, không load cả 100-900 */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-700.woff2') format('woff2');
  font-weight: 700;
}
```

## Subset font

Giảm kích thước font bằng cách chỉ giữ lại ký tự cần dùng:

```css
/* Google Fonts tự động subset dựa trên unicode-range */
@font-face {
  unicode-range: U+0000-00FF; /* Chỉ Latin cơ bản */
}
```

Dùng [glyphhanger](https://github.com/zachleat/glyphhanger) hoặc [fonttools](https://github.com/fonttools/fonttools) để subset thủ công.

## Google Fonts — cách tối ưu

```html
<!-- Tốt hơn: preconnect để giảm DNS/TCP overhead -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
```

**Tốt nhất**: Self-host font thay vì dùng Google Fonts để tránh DNS lookup thêm và kiểm soát cache.
