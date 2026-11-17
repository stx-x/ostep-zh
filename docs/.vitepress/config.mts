import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '操作系统导论 · 并发',
  description: '《Operating Systems: Three Easy Pieces》并发部分中文全译',
  base: '/ostep-zh/',
  cleanUrls: true,
  lastUpdated: false,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/ostep-zh/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#c05621' }],
    ['meta', { property: 'og:title', content: '操作系统导论 · 并发（中文全译）' }],
    ['meta', { property: 'og:description', content: 'OSTEP 并发部分：线程、锁、条件变量、信号量、并发缺陷、事件驱动' }],
  ],

  sitemap: { hostname: 'https://stx-x.github.io/ostep-zh/' },

  markdown: {
    math: true,
    lineNumbers: false,
    image: { lazyLoading: true },
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
  },

  themeConfig: {
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) => {
              const out: string[] = []
              const parts = text.split(/[\s\-_/.,;:!?()[\]{}"'“”‘’、，。；：！？（）《》]+/)
              for (const p of parts) {
                if (!p) continue
                if (/[\u4e00-\u9fa5]/.test(p)) {
                  for (let i = 0; i < p.length - 1; i++) out.push(p.slice(i, i + 2))
                  if (p.length === 1) out.push(p)
                } else {
                  out.push(p.toLowerCase())
                }
              }
              return out
            },
          },
          searchOptions: { prefix: true, fuzzy: 0.15, boost: { title: 4, text: 2 } },
        },
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索本章' },
          modal: {
            displayDetails: '展开详情',
            resetButtonTitle: '清除条件',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择', selectKeyAriaLabel: '回车',
              navigateText: '切换', navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭', closeKeyAriaLabel: 'Esc',
            },
          },
        },
      },
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '目录', link: '/contents' },
      { text: 'OSTEP 官网', link: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
    ],

    sidebar: [
      {
        text: '并发部分',
        items: [
          { text: '关于并发的对话', link: '/ch25' },
          { text: '第 26 章　并发：介绍', link: '/ch26' },
          { text: '第 27 章　线程 API', link: '/ch27' },
          { text: '第 28 章　锁', link: '/ch28' },
          { text: '第 29 章　基于锁的并发数据结构', link: '/ch29' },
          { text: '第 30 章　条件变量', link: '/ch30' },
          { text: '第 31 章　信号量', link: '/ch31' },
          { text: '第 32 章　常见并发缺陷', link: '/ch32' },
          { text: '第 33 章　基于事件的并发', link: '/ch33' },
          { text: '第 34 章　关于并发的总结对话', link: '/ch34' },
        ],
      },
      {
        text: '附录',
        items: [
          { text: '管程（Monitors）', link: '/mon' },
        ],
      },
    ],
  },
})
