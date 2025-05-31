export const frontendProject = {
  id: 'frontend',
  name: 'Frontend Documentation',
  sections: [
    {
      id: 'setup',
      title: 'Setup',
      subsections: [
        {
          id: 'installation',
          title: 'Installation',
          content: [
            {
              type: 'text',
              content: '## Installation\n\nFollow these steps to set up the frontend application.'
            },
            {
              type: 'code',
              language: 'bash',
              content: 'npm install\nnpm run dev'
            }
          ]
        }
      ]
    },
    {
      id: 'architecture',
      title: 'Architecture',
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          content: [
            {
              type: 'mermaid',
              content: `graph TD
    A[App] --> B[Router]
    B --> C[Components]
    B --> D[Pages]
    C --> E[Shared]
    D --> F[Protected]`
            }
          ]
        }
      ]
    }
  ]
};
