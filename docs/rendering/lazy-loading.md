# Lazy Loading

## Lazy Loading là gì?

Chỉ tải tài nguyên khi cần thiết — thường là khi user scroll đến gần phần tử đó. Giúp giảm dữ liệu tải ban đầu và tăng tốc độ hiển thị trang.

## Hình ảnh

```html
<!-- Native lazy loading — hỗ trợ tất cả browser hiện đại -->
<img src="/photo.webp" alt="Photo" loading="lazy" width="800" height="600" />

<!-- Không lazy load ảnh above the fold -->
<img src="/hero.webp" alt="Hero" loading="eager" fetchpriority="high" />
```

**Lưu ý**: Luôn khai báo `width` và `height` khi dùng `loading="lazy"` để tránh CLS.

## Iframe

```html
<iframe src="https://www.youtube.com/embed/xxx" loading="lazy" title="Video"></iframe>
```

## JavaScript — Dynamic Import

```js
// Module chỉ được tải khi hàm được gọi
async function loadChart() {
  const { Chart } = await import('./Chart.js')
  return new Chart(/* ... */)
}

// Trigger khi user click
button.addEventListener('click', loadChart)
```

## Intersection Observer

Lazy load bất kỳ nội dung nào khi vào viewport:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target
      // Tải nội dung
      el.src = el.dataset.src
      observer.unobserve(el)
    }
  })
}, {
  rootMargin: '200px', // bắt đầu tải trước 200px
})

document.querySelectorAll('img[data-src]').forEach((img) => {
  observer.observe(img)
})
```

## Với React

Xem chi tiết tại [React - Code Splitting](/react/code-splitting). Tóm tắt nhanh:

```jsx
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <HeavyChart />
    </Suspense>
  )
}
```

## Route-based Lazy Loading

Đây là lazy loading phổ biến nhất và hiệu quả nhất — chỉ tải JS của route khi user navigate đến:

```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```
