import { defineConfig } from 'vitepress'
import nav from  "./nav.mjs"
import sidebar from "./sidebar.mjs";


export default defineConfig({
  title: "MoXiaoXi Notes",
  description: "MoXiaoXi Notes",
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  srcDir: "base",
  ignoreDeadLinks: true,
  lastUpdated: true,
  base: "/moxiaoxi",
  rewrites: {
    // 'notes/operator/:pkg/(.*)': '/operator/:pkg/index.md',
    // 'notes/:pkg/(.*)': '/:pkg/index.md',
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
