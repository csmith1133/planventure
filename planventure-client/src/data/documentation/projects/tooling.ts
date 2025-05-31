export const toolingProject = {
  id: 'tooling',
  name: 'Development Tools',
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      subsections: [
        {
          id: 'tech-stack',
          title: 'Tech Stack',
          content: [
            {
              type: 'text',
              content: '## Technology Stack\n\nCore technologies used in PlanVenture.'
            },
            {
              type: 'table',
              content: {
                headers: ['Technology', 'Purpose', 'Version'],
                rows: [
                  ['React', 'Frontend Framework', '19.1.0'],
                  ['Flask', 'Backend API', '2.3.3'],
                  ['PostgreSQL', 'Database', '14+'],
                  ['TypeScript', 'Type Safety', '5.8.3']
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
