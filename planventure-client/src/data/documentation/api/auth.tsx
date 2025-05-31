
export const authDocumentation = {
  title: 'Authentication',
  content: [
    {
      type: 'mermaid',
      content: `
sequenceDiagram
    participant C as Client
    participant A as Auth Service
    participant D as Database
    C->>A: Login Request
    A->>D: Validate Credentials
    D-->>A: User Data
    A-->>C: JWT Token
      `
    },
    {
      type: 'table',
      content: {
        headers: ['Endpoint', 'Method', 'Description'],
        rows: [
          ['/auth/login', 'POST', 'User login'],
          ['/auth/register', 'POST', 'New user registration'],
          ['/auth/refresh', 'POST', 'Refresh JWT token']
        ]
      }
    },
    {
      type: 'code',
      content: `
// Example Login Request
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
      `,
      language: 'typescript'
    }
  ]
};
