# Memoization trong React

## Tại sao cần Memoization?

React re-render component khi state hoặc props thay đổi. Nhưng đôi khi component bị re-render không cần thiết — memoization giúp bỏ qua các lần re-render đó.

**Nguyên tắc**: Đừng tối ưu sớm. Chỉ dùng khi đã đo lường và xác nhận có vấn đề hiệu năng thực sự.

## `React.memo`

Bỏ qua re-render nếu props không thay đổi (shallow comparison):

```jsx
import { memo } from 'react'

// Không dùng memo — re-render mỗi khi parent re-render
function UserCard({ user }) {
  return <div>{user.name}</div>
}

// Dùng memo — chỉ re-render khi user thay đổi
const UserCard = memo(function UserCard({ user }) {
  return <div>{user.name}</div>
})
```

### Custom comparison

```jsx
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
)
```

## `useMemo`

Cache kết quả tính toán nặng:

```jsx
import { useMemo } from 'react'

function ProductList({ products, filter }) {
  // Xấu — tính lại mỗi lần re-render
  const filtered = products.filter(p => p.category === filter)

  // Tốt — chỉ tính lại khi products hoặc filter thay đổi
  const filtered = useMemo(
    () => products.filter(p => p.category === filter),
    [products, filter]
  )

  return filtered.map(p => <ProductCard key={p.id} product={p} />)
}
```

**Không nên dùng `useMemo` cho**:
- Tính toán đơn giản (< 1ms)
- Giá trị primitive

## `useCallback`

Cache function reference để tránh re-render component con dùng `React.memo`:

```jsx
import { useCallback, memo } from 'react'

const Button = memo(function Button({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)

  // Xấu — tạo function mới mỗi lần render → Button luôn re-render
  const handleClick = () => console.log('clicked')

  // Tốt — giữ nguyên reference → Button không re-render
  const handleClick = useCallback(() => console.log('clicked'), [])

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <Button onClick={handleClick} label="Action" />
    </>
  )
}
```

## Khi nào nên/không nên dùng

| Hook | Nên dùng | Không nên |
|---|---|---|
| `React.memo` | Component render nặng, props ít thay đổi | Component nhỏ, props luôn thay đổi |
| `useMemo` | Tính toán nặng (sort/filter list lớn) | Tính toán đơn giản |
| `useCallback` | Truyền callback vào component đã `memo` | Callback không truyền xuống component con |

## Đo lường trước khi tối ưu

```jsx
// Dùng React DevTools Profiler để xem component nào re-render nhiều
// hoặc dùng why-did-you-render

import whyDidYouRender from '@welldone-software/why-did-you-render'
import React from 'react'

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, { trackAllPureComponents: true })
}
```

## Lỗi phổ biến

```jsx
// Lỗi — object/array literal tạo reference mới mỗi lần render
// memo trên Child không có tác dụng
function Parent() {
  return <Child style={{ color: 'red' }} items={[1, 2, 3]} />
}

// Fix
function Parent() {
  const style = useMemo(() => ({ color: 'red' }), [])
  const items = useMemo(() => [1, 2, 3], [])
  return <Child style={style} items={items} />
}
```
