export const deploymentProject = {
  id: 'deployment',
  name: 'Deployment Guide',
  sections: [
    {
      id: 'setup',
      title: 'Setup',
      subsections: [
        {
          id: 'prerequisites',
          title: 'Prerequisites',
          content: [
            {
              type: 'text',
              content: '## Prerequisites\nEnsure you have the following installed:'
            },
            {
              type: 'table',
              content: {
                headers: ['Tool', 'Version', 'Required'],
                rows: [
                  ['Node.js', '>=18.0.0', 'Yes'],
                  ['Docker', '>=20.0.0', 'Yes'],
                  ['PostgreSQL', '>=14.0.0', 'Yes']
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      subsections: [
        {
          id: 'process',
          title: 'Deployment Process',
          content: [
            {
              type: 'text',
              content: '## Deployment Process\n\nFollow these steps to deploy PlanVenture.'
            },
            {
              type: 'mermaid',
              content: `graph TD
    A[Build] -->|npm run build| B[Test]
    B -->|pytest| C[Deploy]
    C -->|Docker| D[Production]`
            }
          ]
        }
      ]
    }
  ]
};
