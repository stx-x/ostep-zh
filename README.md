# 操作系统导论 · 并发（中文全译）

《Operating Systems: Three Easy Pieces》(Arpaci-Dusseau & Arpaci-Dusseau, v1.10) 并发部分中文译本。

**在线阅读：https://stx-x.github.io/ostep-zh/**

## 内容

| 章节 | 标题 |
|---|---|
| 25 | 关于并发的对话 |
| 26 | 并发：介绍 |
| 27 | 线程 API |
| 28 | 锁 |
| 29 | 基于锁的并发数据结构 |
| 30 | 条件变量 |
| 31 | 信号量 |
| 32 | 常见并发缺陷 |
| 33 | 基于事件的并发 |
| 34 | 关于并发的总结对话 |
| 附录 | 管程（Monitors） |

约 5.6 万汉字，46 幅插图（由图裁剪）。

## 目录结构

```
docs/                  VitePress 站点
  chapters/*.md        译文
  public/figures/      插图
  .vitepress/          配置与主题
src/                   英文原文（由 PDF 提取，未入库）
tools/assemble.py      装配章节、生成目录页
```

## 本地构建

```bash
npm install
npm run dev      # 本地预览
npm run build    # 产物在 docs/.vitepress/dist
```

推送到 `main` 后由 GitHub Actions 自动部署。

## 说明

- 原书由作者免费公开于 https://pages.cs.wisc.edu/~remzi/OSTEP/ ，版权归原作者所有。
- 本译本仅供学习交流，图表编号沿用原书；如原作者有异议将立即下线。
- 代码块保留 C 原文（含注释），正文术语统一。
