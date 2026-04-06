# Virtualization (List ảo)

## Vấn đề

Render 10,000 item trong một list → tạo 10,000 DOM nodes → browser chậm, scroll lag.

**Virtualization** chỉ render các item đang hiển thị trong viewport (thường 20–50 item), các item còn lại được tính toán nhưng không tạo DOM node thực.

## TanStack Virtual (khuyến nghị)

Headless, không opinionated về UI:

```bash
npm install @tanstack/react-virtual
```

```jsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

function VirtualList({ items }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // chiều cao ước tính mỗi item (px)
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {/* Container với tổng chiều cao ảo */}
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Dynamic size

Khi item có chiều cao khác nhau:

```jsx
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
  measureElement: (el) => el.getBoundingClientRect().height, // đo thực tế
})

// Trong item, thêm ref để đo
{virtualizer.getVirtualItems().map((virtualItem) => (
  <div
    key={virtualItem.key}
    ref={virtualizer.measureElement}
    data-index={virtualItem.index}
    // ...
  >
    <VariableHeightContent item={items[virtualItem.index]} />
  </div>
))}
```

## Virtual Grid (2D)

```jsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualGrid({ rows, columns }) {
  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
  })

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: columnVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) =>
          columnVirtualizer.getVirtualItems().map((col) => (
            <div
              key={`${row.index}-${col.index}`}
              style={{
                position: 'absolute',
                top: row.start,
                left: col.start,
                width: col.size,
                height: row.size,
              }}
            >
              Cell ({row.index}, {col.index})
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

## react-window (alternative)

Nhẹ hơn, API đơn giản hơn nhưng ít linh hoạt hơn TanStack Virtual:

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window'

function Row({ index, style }) {
  return <div style={style}>Item {index}</div>
}

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

## Khi nào dùng?

- List > **100 items** hiển thị cùng lúc
- Table nhiều cột và nhiều hàng
- Infinite scroll feed

Với list < 100 items thông thường, không cần virtualization.
