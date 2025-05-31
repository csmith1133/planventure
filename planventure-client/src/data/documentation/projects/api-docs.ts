export const apiDocs = {
  id: 'api',
  name: 'API Documentation',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          content: [
            {
              type: 'text',
              content: '# PlanVenture API\n\nThe PlanVenture API provides a comprehensive set of endpoints for managing trip planning, user authentication, and data management. This documentation will guide you through using the API effectively.\n\n## Base URL\n\nAll API requests should be made to:\n`https://api.planventure.com/v1`'
            },
            {
              type: 'table',
              content: {
                headers: ['Environment', 'Base URL', 'Description'],
                rows: [
                  ['Production', 'https://api.planventure.com/v1', 'Live production environment'],
                  ['Staging', 'https://staging.api.planventure.com/v1', 'Testing and integration'],
                  ['Development', 'http://localhost:5000', 'Local development']
                ]
              }
            }
          ]
        },
        {
          id: 'getting-started',
          title: 'Getting Started',
          content: [
            {
              type: 'text',
              content: '## Quick Start Guide\n\n1. Register for an API key\n2. Make your first API call\n3. Implement authentication\n4. Start building!'
            },
            {
              type: 'code',
              language: 'bash',
              content: `# Example API call
curl -X GET \\
  https://api.planventure.com/v1/health \\
  -H 'Authorization: Bearer YOUR_TOKEN'`
            }
          ]
        }
      ]
    },
    {
      id: 'authentication',
      title: 'Authentication',
      subsections: [
        {
          id: 'jwt',
          title: 'JWT Authentication',
          content: [
            {
              type: 'text',
              content: '## JWT Token Authentication\n\nPlanVenture uses JWT (JSON Web Tokens) for authentication. Each request to protected endpoints must include a valid JWT token in the Authorization header.'
            },
            {
              type: 'mermaid',
              content: `sequenceDiagram
    Client->>Server: Login Request (email/password)
    Server->>Database: Validate Credentials
    Database-->>Server: User Data
    Server->>Server: Generate JWT
    Server-->>Client: Return JWT Token
    Client->>Server: Request with JWT
    Server->>Server: Validate JWT
    Server-->>Client: Protected Resource`
            }
          ]
        },
        {
          id: 'oauth',
          title: 'OAuth Integration',
          content: [
            {
              type: 'text',
              content: '## OAuth 2.0 Authentication\n\nIn addition to JWT, PlanVenture supports OAuth 2.0 authentication with various providers.'
            },
            {
              type: 'table',
              content: {
                headers: ['Provider', 'Status', 'Documentation'],
                rows: [
                  ['Google', 'Available', '/auth/google'],
                  ['GitHub', 'Coming Soon', '-'],
                  ['Facebook', 'Coming Soon', '-']
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'endpoints',
      title: 'API Endpoints',
      subsections: [
        {
          id: 'user-management',
          title: 'User Management',
          content: [
            {
              type: 'text',
              content: '## User Management API\n\nEndpoints for managing user accounts, profiles, and preferences.'
            },
            {
              type: 'table',
              content: {
                headers: ['Endpoint', 'Method', 'Description', 'Auth Required'],
                rows: [
                  ['/users', 'GET', 'List all users', 'Yes'],
                  ['/users/{id}', 'GET', 'Get user details', 'Yes'],
                  ['/users/{id}', 'PUT', 'Update user', 'Yes'],
                  ['/users/{id}', 'DELETE', 'Delete user', 'Yes']
                ]
              }
            }
          ]
        },
        {
          id: 'trip-planning',
          title: 'Trip Planning',
          content: [
            {
              type: 'text',
              content: '## Trip Planning API\n\nEndpoints for creating and managing travel plans.'
            },
            {
              type: 'mermaid',
              content: `graph TD
    A[Create Trip] -->|POST /trips| B[Add Locations]
    B -->|POST /trips/{id}/locations| C[Set Schedule]
    C -->|POST /trips/{id}/schedule| D[Share Trip]
    D -->|POST /trips/{id}/share| E[Finalize]`
            }
          ]
        }
      ]
    },
    {
      id: 'data-models',
      title: 'Data Models',
      subsections: [
        {
          id: 'user-model',
          title: 'User Model',
          content: [
            {
              type: 'text',
              content: '## User Model\n\nCore user data structure and relationships.'
            },
            {
              type: 'code',
              language: 'typescript',
              content: `interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}`
            }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      subsections: [
        {
          id: 'best-practices',
          title: 'Best Practices',
          content: [
            {
              type: 'text',
              content: '## Security Best Practices\n\n1. Always use HTTPS\n2. Implement proper token storage\n3. Handle errors securely\n4. Validate all inputs'
            }
          ]
        }
      ]
    }
  ]
};
