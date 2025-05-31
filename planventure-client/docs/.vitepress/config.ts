import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PlanVenture Documentation",
  description: "Documentation for PlanVenture API and Client",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API', link: '/api/' },
      { text: 'Client', link: '/client/' }
    ],
    sidebar: {
      '/api/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/api/introduction' },
            { text: 'Authentication', link: '/api/authentication' }
          ]
        }
      ],
      '/client/': [
        {
          text: 'Setup',
          items: [
            { text: 'Installation', link: '/client/installation' },
            { text: 'Configuration', link: '/client/configuration' }
          ]
        }
      ]
    }
  }
})
