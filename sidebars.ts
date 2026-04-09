import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

export default {
  javaSidebar: [
    {
      label: 'Java 基础',
      type: 'category',
      collapsed: false,
      items: ['java/jdk-setup'],
    },
  ],
  springSidebar: [
    {
      label: 'Spring 框架',
      type: 'category',
      collapsed: false,
      items: ['spring/spring'],
    },
  ],
  springbootSidebar: [
    {
      label: 'SpringBoot',
      type: 'category',
      collapsed: false,
      items: ['springboot/springboot'],
    },
  ],
  springcloudSidebar: [
    {
      label: 'SpringCloud',
      type: 'category',
      collapsed: false,
      items: ['springcloud/springcloud'],
    },
  ],
  springalibabaSidebar: [
    {
      label: 'Spring Alibaba',
      type: 'category',
      collapsed: false,
      items: ['spring-alibaba/spring-alibaba'],
    },
  ],
} satisfies SidebarsConfig
