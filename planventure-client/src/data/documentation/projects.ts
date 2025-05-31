export interface DocSection {
  id: string;
  title: string;
  content: DocContent[];
}

export interface DocContent {
  type: 'text' | 'code' | 'mermaid' | 'table' | 'api';
  content: string | ApiContent | TableContent;
  language?: string;
  title?: string;
}

export interface ApiContent {
  endpoint: string;
  method: string;
  description: string;
  request?: object;
  response?: object;
}

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  sections: DocSection[];
}

export const projects: Project[] = [
  {
    id: 'api',
    name: 'API Documentation',
    description: 'Complete API reference and documentation',
    sections: [
      {
        id: 'auth',
        title: 'Authentication',
        content: [
          {
            type: 'mermaid',
            content: `sequenceDiagram
    Client->>Server: Login Request
    Server->>Database: Validate
    Database-->>Server: User Data
    Server-->>Client: JWT Token`
          },
          {
            type: 'api',
            content: {
              endpoint: '/auth/login',
              method: 'POST',
              description: 'Authenticate user',
              request: {
                email: 'string',
                password: 'string'
              },
              response: {
                token: 'string',
                user: { id: 'number', email: 'string' }
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Guide',
    description: 'Frontend development documentation',
    sections: [
      {
        id: 'components',
        title: 'Components',
        content: [
          {
            type: 'text',
            content: '# Component Guidelines'
          },
          {
            type: 'code',
            language: 'typescript',
            content: `interface Props {
  title: string;
  onAction: () => void;
}`
          }
        ]
      }
    ]
  }
];
