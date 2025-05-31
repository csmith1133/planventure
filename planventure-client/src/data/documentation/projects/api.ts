export const apiProject = {
  id: 'api',
  name: 'API Documentation',
  sections: [
    {
      id: 'auth',
      title: 'Authentication',
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          content: [
            {
              type: 'text',
              content: '## Authentication\n\nPlanVenture uses JWT tokens for authentication.'
            },
            {
              type: 'mermaid',
              content: `sequenceDiagram
    Client->>Server: Login Request
    Server->>Database: Validate Credentials
    Database-->>Server: User Data
    Server-->>Client: JWT Token`
            },
            {
              type: 'table',
              content: {
                headers: ['Endpoint', 'Method', 'Description'],
                rows: [
                  ['/auth/login', 'POST', 'Authenticate user'],
                  ['/auth/register', 'POST', 'Create new account']
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
