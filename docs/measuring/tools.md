# Công cụ đo lường hiệu năng

## Lighthouse

Tool tích hợp sẵn trong Chrome DevTools — đánh giá toàn diện về Performance, Accessibility, SEO, Best Practices.

**Cách dùng:**
1. Mở DevTools (F12) → tab **Lighthouse**
2. Chọn **Performance** → **Analyze page load**
3. Xem điểm và các gợi ý cải thiện

**Chỉ số quan trọng:**
- **FCP** (First Contentful Paint): thời gian đến khi content đầu tiên xuất hiện
- **LCP** (Largest Contentful Paint): thời gian đến khi element lớn nhất xuất hiện
- **TBT** (Total Blocking Time): tổng thời gian main thread bị block
- **CLS** (Cumulative Layout Shift): layout có bị dịch chuyển không
- **Speed Index**: tốc độ hiển thị nội dung tổng thể

**Chạy từ CLI:**
```bash
npm install -g lighthouse
lighthouse https://example.com --output html --output-path report.html
```

## PageSpeed Insights

Lighthouse chạy trên server của Google — đo lường từ thiết bị thực tế của người dùng (field data) và lab data.

- URL: [pagespeed.web.dev](https://pagespeed.web.dev)
- Kết hợp **CrUX data** (Chrome User Experience Report) — dữ liệu thực tế
- Phân tích riêng cho Mobile và Desktop

## WebPageTest

Kiểm tra hiệu năng từ nhiều vị trí địa lý và nhiều loại thiết bị/kết nối khác nhau.

- URL: [webpagetest.org](https://webpagetest.org)
- Chọn test location gần user thực tế
- Xem waterfall chart để thấy thứ tự và thời gian tải từng resource
- Test với 3G/4G để simulate user di động

**Các metric đặc biệt:**
- **TTFB** (Time to First Byte): thời gian server phản hồi
- **Start Render**: khi browser bắt đầu render
- **Filmstrip view**: xem trang load từng frame

## Chrome DevTools

### Network tab
- Xem tất cả requests, kích thước, thời gian
- Filter theo loại (JS, CSS, IMG, Font...)
- Throttle network để simulate 3G/4G
- Xem `Content-Encoding` để kiểm tra nén

### Performance tab
- Record runtime performance
- Xem flame chart để tìm JavaScript chạy lâu
- Identify long tasks (> 50ms)

### Coverage tab
```
DevTools → More tools → Coverage
```
Xem % CSS và JS thực sự được dùng — tìm cơ hội tree shaking và code splitting.

### Memory tab
- Detect memory leaks
- Xem heap snapshots

## React DevTools Profiler

Extension dành riêng cho React app:

```bash
# Cài từ Chrome Web Store: "React Developer Tools"
```

**Cách dùng:**
1. Mở DevTools → tab **Profiler**
2. Click Record → tương tác với app → Stop
3. Xem component nào render lâu nhất (thanh màu vàng/đỏ)
4. Xem **"Ranked chart"** để sort theo thời gian render

## Bundlephobia

Kiểm tra kích thước npm package trước khi install:

- URL: [bundlephobia.com](https://bundlephobia.com)
- Xem minified + gzipped size
- So sánh với alternatives

## Squoosh

Nén và convert ảnh online:

- URL: [squoosh.app](https://squoosh.app)
- Hỗ trợ WebP, AVIF, MozJPEG, OxiPNG
- Preview before/after ngay trên browser

## Tổng hợp workflow

```
1. Đo lường baseline → Lighthouse / PageSpeed Insights
2. Phân tích bundle → rollup-plugin-visualizer
3. Xem waterfall → WebPageTest
4. Debug runtime → Chrome DevTools Performance tab
5. Debug React → React DevTools Profiler
6. Tối ưu → implement fixes
7. Đo lại → so sánh với baseline
```
