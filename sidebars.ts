import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

export default {
  docusaurusSidebar: [
    {
      label: 'Docusaurus 主题魔改',
      type: 'category',
      link: {
        type: 'doc',
        id: 'docusaurus/docusaurus-guides',
      },
      items: [
        'docusaurus/docusaurus-config',
        'docusaurus/docusaurus-style',
        'docusaurus/docusaurus-component',
        'docusaurus/docusaurus-plugin',
        'docusaurus/docusaurus-search',
        'docusaurus/docusaurus-comment',
        'docusaurus/docusaurus-deploy',
      ],
    },
  ],
  javaSidebar: [
    {
      label: 'Java 基础',
      type: 'category',
      link: {
        type: 'doc',
        id: 'java/java',
      },
      items: [
        'java/jdk-setup',
      ],
    },
  ],
} satisfies SidebarsConfig
