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
        text: 'Tổng quan',
        items: [
          { text: 'Page Weight & Load Time', link: '/general/page-weight' },
          { text: 'Service Workers', link: '/general/service-workers' },
          { text: 'Cookies', link: '/general/cookies' },
        ],
      },
      {
        text: 'Mạng',
        items: [
          { text: 'Nén dữ liệu (GZIP / Brotli)', link: '/network/compression' },
          { text: 'Giảm HTTP Requests', link: '/network/http-requests' },
          { text: 'HTTP Cache Headers', link: '/network/http-cache' },
          { text: 'CDN', link: '/network/cdn' },
          { text: 'TTFB', link: '/network/ttfb' },
          { text: 'HTTPS, Protocol & 404', link: '/network/https' },
        ],
      },
      {
        text: 'Tối ưu Assets',
        items: [
          { text: 'Hình ảnh', link: '/assets/images' },
          { text: 'CSS', link: '/assets/css' },
          { text: 'JavaScript', link: '/assets/javascript' },
          { text: 'HTML', link: '/assets/html' },
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
