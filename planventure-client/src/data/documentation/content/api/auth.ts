export const authContent = {
  title: 'Authentication',
  content: [
    {
      type: 'text',
      content: '# Authentication\n\nPlanVenture uses JWT tokens for authentication.'
    },
    {
      type: 'table',
      content: {
        title: 'Authentication Endpoints',
        headers: ['Endpoint', 'Method', 'Description'],
        rows: [
          ['/auth/login', 'POST', 'Login with email/password'],
          ['/auth/register', 'POST', 'Create new account'],
          ['/auth/refresh', 'POST', 'Refresh JWT token']
        ]
      }
    },
    {
      type: 'mermaid',
      content: `
sequenceDiagram
    Client->>Server: Login Request
    Server->>Database: Validate Credentials
    Database-->>Server: User Data
    Server-->>Client: JWT Token`
    },
    {
      type: 'code',
      language: 'typescript',
      content: `// Example login request
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();`
    }
  ]
};
