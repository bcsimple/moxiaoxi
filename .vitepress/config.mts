import { defineConfig } from 'vitepress'
import nav from  "./nav.mjs"
import sidebar from "./sidebar.mjs";


export default defineConfig({
  base: "moxiaoxi",
  title: "MoXiaoXi Notes",
  description: "MoXiaoXi Notes",
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  srcDir: "base",
  lastUpdated: true,
  rewrites: {
    'notes/:pkg/(.*)': ':pkg/(.*)',
    'notes/operator/:pkg/(.*)': 'operator/:pkg/(.*)',
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    siteTitle: false,
    nav: nav,
    sidebar: sidebar,
    socialLinks: [
      {icon: 'github', link: 'https://github.com/bcsimple?tab=repositories'}
    ],
    search: {
      provider: 'local'
    },
    footer: {
      copyright: '©陕ICP备2024051781号'
    },
  }
})
