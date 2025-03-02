import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '标签', link: '/blog/tags/' },
  { text: '归档', link: '/blog/archives/' },
  {
    text: 'LeetCode',
    items: [
        { text: '面试经典 150 题', link: '/notes/leetcode/top-interview-150/' },
        { text: 'Hot 100', link: '/notes/leetcode/top-100-liked/' },
    ]
  },
  { text: '资源分享', link: '/notes/resource-share/' },
  {
    text: '笔记',
    items: [
        { text: '面试', link: '/notes/interview/' },
        { text: '算法', link: '/notes/algorithm/' },
        { text: '开发', link: '/notes/develop/' },
    ]
  },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  {
    text: 'Notes',
    items: [{ text: 'Demo', link: '/en/notes/demo/README.md' }]
  },
])

