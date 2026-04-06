# Code Splitting trong React

## Tại sao cần Code Splitting?

Mặc định, Vite/Webpack đóng gói toàn bộ app vào 1 bundle. Khi app lớn, bundle có thể lên đến vài MB — user phải tải hết trước khi thấy gì.

Code splitting tách bundle thành nhiều chunk nhỏ và chỉ tải chunk cần thiết.

## `React.lazy` + `Suspense`

```jsx
import { lazy, Suspense } from 'react'

// Chunk riêng — chỉ tải khi component này được render
const HeavyEditor = lazy(() => import('./HeavyEditor'))

function App() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <HeavyEditor />
    </Suspense>
  )
}
```

## Route-based Splitting (khuyến nghị)

Đây là pattern phổ biến và hiệu quả nhất — mỗi route là 1 chunk riêng:

```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home      = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile   = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile"   element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

## Component-level Splitting

Tách các component nặng không cần thiết ngay từ đầu:

```jsx
import { lazy, Suspense, useState } from 'react'

// Chart library thường rất nặng (~200KB+)
const Chart = lazy(() => import('./Chart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Xem biểu đồ</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <Chart data={data} />
        </Suspense>
      )}
    </div>
  )
}
```

## Named Export với `React.lazy`

`React.lazy` chỉ hỗ trợ default export. Với named export:

```jsx
// Cách 1: re-export trong file riêng
// BarChart.lazy.ts
export { BarChart as default } from './charts'

// Cách 2: wrap trực tiếp
const BarChart = lazy(() =>
  import('./charts').then((m) => ({ default: m.BarChart }))
)
```

## Prefetch Route

Tải trước chunk khi user hover vào link — tránh loading state khi navigate:

```jsx
import { lazy } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))

// Preload ngay khi hover
function NavLink() {
  return (
    <Link
      to="/dashboard"
      onMouseEnter={() => import('./pages/Dashboard')} // trigger preload
    >
      Dashboard
    </Link>
  )
}
```

## Kiểm tra

Sau `vite build`, xem thư mục `dist/assets/` — mỗi route nên có file JS riêng:

```
dist/assets/
  index.Bx3kLm9A.js      ← main bundle (nhỏ)
  Home.Cq7nPwE.js
  Dashboard.Dm8kRtF.js
  Profile.En9sUgG.js
```
