<h2 align="center">深度先生的个人博客</h2>

<p align="center">基于 Docusaurus 构建的个人技术知识库，专注于 Java 生态技术分享</p>

<p align="center">
  <a href="https://github.com/a605204746/deepin_sir_blog"><img src="https://img.shields.io/github/stars/a605204746/deepin_sir_blog?style=flat-square" alt="stars"></a>
  <a href="https://github.com/a605204746/deepin_sir_blog/blob/main/LICENSE"><img src="https://img.shields.io/github/license/a605204746/deepin_sir_blog?style=flat-square" alt="license"></a>
</p>

## 👋 介绍

这里是深度先生的个人技术博客，主要分享 Java 后端开发相关的知识与实践经验，涵盖 Java 基础、Spring 生态、AI 技术、中间件等核心内容，希望对你有所帮助和启发。

## ✨ 特性

- 🦖 **Docusaurus** - 基于 Docusaurus v3 构建，支持强大的文档管理能力
- ✍️ **Markdown** - 全站 Markdown/MDX 写作，排版优雅
- 🎨 **美观易读** - 整洁的 UI 设计，深色/浅色模式自由切换
- 🖥️ **PWA** - 支持 PWA，可安装到桌面，离线可用
- 💯 **SEO 友好** - 搜索引擎优化，易于收录
- 🔎 **全文搜索** - 集成 [Algolia DocSearch](https://github.com/algolia/docsearch)，快速检索
- 🚀 **自动部署** - 支持 CI/CD，推送即更新
- 📦 **项目展示** - 展示个人实战项目

## 🛠️ 技术栈

- [Docusaurus v3](https://docusaurus.io/) - 静态站点生成框架
- [React](https://react.dev/) - 前端 UI 框架
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Framer Motion](https://www.framer.com/motion/) & [MagicUI](https://magicui.design/) - 动效组件

## 📊 目录结构

```bash
├── blog                           # 博客文章目录
│   └── authors.yml                # 作者信息配置
├── docs                           # 技术文档/知识库
│   ├── java                       # Java 基础
│   │   ├── introduction.md        # 分类首页
│   │   └── jdk-setup.md           # JDK 安装与配置
│   └── docusaurus                 # Docusaurus 主题魔改
├── data                           # 站点数据配置
│   ├── friends.tsx                # 友情链接
│   ├── projects.tsx               # 项目展示
│   └── social.ts                  # 社交媒体链接
├── i18n                           # 国际化文案
├── src
│   ├── components                 # 公共组件
│   │   ├── landing                # 首页区块组件
│   │   └── magicui                # 动效 UI 组件
│   ├── css                        # 全局样式
│   ├── pages                      # 自定义页面（关于、友链、项目等）
│   ├── plugin                     # 自定义 Docusaurus 插件
│   └── theme                      # 主题组件覆写
├── static                         # 静态资源
│   └── img                        # 图片资源
├── docusaurus.config.ts           # 站点核心配置（导航、页脚、插件等）
├── sidebars.ts                    # 文档侧边栏配置
├── tailwind.config.js             # TailwindCSS 配置
├── package.json
├── tsconfig.json
└── pnpm-lock.yaml
```

## 📚 内容分类

| 分类 | 说明 |
|------|------|
| Java 基础 | JDK 配置、Java 核心语法、JVM 原理 |
| Spring | Spring 框架、SpringBoot、SpringCloud、Spring Alibaba |
| AI 技术 | AI 应用开发、大模型调用实践 |
| 中间件 | Kafka、Redis、Nginx、RocketMQ |
| 主题魔改 | Docusaurus 二次开发与定制 |

## 📥 本地运行

```bash
# 克隆仓库
git clone https://github.com/a605204746/deepin_sir_blog.git
cd deepin_sir_blog

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

构建生产版本：

```bash
pnpm build
```

## 📝 许可证

[MIT](./LICENSE)
