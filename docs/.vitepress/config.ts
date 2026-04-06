import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Frontend Performance',
  description: 'Tổng hợp kiến thức tối ưu hiệu năng frontend',
  lang: 'vi-VN',
  base: '/frontend-performance/',

  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'React', link: '/react/code-splitting' },
    ],

    sidebar: [
      {
        text: 'Mạng & Tải trang',
        items: [
          { text: 'Nén dữ liệu (GZIP / Brotli)', link: '/network/compression' },
          { text: 'Giảm HTTP Requests', link: '/network/http-requests' },
          { text: 'CDN', link: '/network/cdn' },
        ],
      },
      {
        text: 'Tối ưu Assets',
        items: [
          { text: 'Hình ảnh', link: '/assets/images' },
          { text: 'Fonts', link: '/assets/fonts' },
          { text: 'Bundle JS/CSS', link: '/assets/bundle' },
        ],
      },
      {
        text: 'Rendering',
        items: [
          { text: 'Critical Rendering Path', link: '/rendering/critical-path' },
          { text: 'Lazy Loading', link: '/rendering/lazy-loading' },
          { text: 'Preload & Prefetch', link: '/rendering/preload-prefetch' },
        ],
      },
      {
        text: 'React',
        items: [
          { text: 'Code Splitting', link: '/react/code-splitting' },
          { text: 'Memoization', link: '/react/memoization' },
          { text: 'Virtualization', link: '/react/virtualization' },
          { text: 'Bundle Analysis', link: '/react/bundle-analysis' },
        ],
      },
      {
        text: 'Đo lường',
        items: [
          { text: 'Công cụ', link: '/measuring/tools' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vu-storm/frontend-performance' },
    ],

    footer: {
      message: 'Dựa trên roadmap.sh/frontend-performance-best-practices',
    },
  },
})
