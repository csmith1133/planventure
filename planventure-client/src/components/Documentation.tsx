import { Check as CheckIcon } from '@mui/icons-material';
import { MenuItem, Select } from '@mui/material';
import mermaid from 'mermaid';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Documentation.css';

interface Project {
  id: string;
  name: string;
  description: string;
  documentation: {
    overview: string;
    flowchart?: string;
    setup: string;
    usage: string;
    api?: {
      endpoints: Array<{
        method: string;
        path: string;
        description: string;
        parameters?: Record<string, string>;
      }>;
    };
    code_examples?: Array<{
      language: string;
      title: string;
      code: string;
    }>;
    tables?: Array<{
      title: string;
      headers: string[];
      rows: string[][];
    }>;
    content: string;
  };
}

const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Purchase Request System',
    description: 'Digital purchase request and approval workflow',
    documentation: {
      overview: 'A streamlined system for managing purchase requests and approvals.',
      flowchart: `
        graph TD
          A[Employee] --> B[Submit Request]
          B --> C{Manager Review}
          C -->|Approved| D[Finance Review]
          C -->|Rejected| E[Return to Employee]
          D -->|Approved| F[Purchase Order]
          D -->|Rejected| E
      `,
      setup: '## Installation\n```bash\nnpm install @company/purchase-system\n```',
      usage: 'Import and initialize the system:\n```typescript\nimport { PurchaseSystem } from "@company/purchase-system";\n\nconst system = new PurchaseSystem();\n```',
      api: {
        endpoints: [
          {
            method: 'POST',
            path: '/api/forms/purchase-request',
            description: 'Create a new purchase request',
            parameters: {
              'item_name': 'string',
              'amount': 'number',
              'justification': 'string'
            }
          }
        ]
      },
      tables: [
        {
          title: 'Approval Thresholds',
          headers: ['Level', 'Amount', 'Approvers Required'],
          rows: [
            ['1', 'Up to $1,000', '1 Manager'],
            ['2', '$1,001 - $10,000', '1 Manager + 1 Director'],
            ['3', '$10,001+', '1 Manager + 1 Director + CFO']
          ]
        }
      ],
      content: `
        # Purchase Request System Documentation

        ## Overview
        A streamlined system for managing purchase requests and approvals.

        ## Flowchart
        \`\`\`mermaid
        graph TD
          A[Employee] --> B[Submit Request]
          B --> C{Manager Review}
          C -->|Approved| D[Finance Review]
          C -->|Rejected| E[Return to Employee]
          D -->|Approved| F[Purchase Order]
          D -->|Rejected| E
        \`\`\`

        ## Setup
        \`\`\`bash
        npm install @company/purchase-system
        \`\`\`

        ## Usage
        \`\`\`typescript
        import { PurchaseSystem } from "@company/purchase-system";

        const system = new PurchaseSystem();
        \`\`\`

        ## API Reference
        \`\`\`json
        {
          "endpoints": [
            {
              "method": "POST",
              "path": "/api/forms/purchase-request",
              "description": "Create a new purchase request",
              "parameters": {
                "item_name": "string",
                "amount": "number",
                "justification": "string"
              }
            }
          ]
        }
        \`\`\`

        ## Tables

        ### Approval Thresholds

        | Level | Amount         | Approvers Required            |
        |-------|----------------|-------------------------------|
        | 1     | Up to $1,000   | 1 Manager                     |
        | 2     | $1,001 - $10,000 | 1 Manager + 1 Director       |
        | 3     | $10,001+       | 1 Manager + 1 Director + CFO |
      `
    }
  },
  {
    id: 'project-2',
    name: 'Travel Request System',
    description: 'Travel request and approval management',
    documentation: {
      overview: 'Manage travel requests and approvals efficiently.',
      flowchart: `
        graph LR
          A[Submit] --> B[Review]
          B --> C[Approve]
          B --> D[Reject]
      `,
      setup: '## Quick Start\n```bash\nyarn add @company/travel-system\n```',
      usage: 'Basic implementation example',
      api: {
        endpoints: [
          {
            method: 'POST',
            path: '/api/forms/travel-request',
            description: 'Submit travel request'
          }
        ]
      },
      content: `
        # Travel Request System Documentation

        ## Overview
        Manage travel requests and approvals efficiently.

        ## Flowchart
        \`\`\`mermaid
        graph LR
          A[Submit] --> B[Review]
          B --> C[Approve]
          B --> D[Reject]
        \`\`\`

        ## Setup
        \`\`\`bash
        yarn add @company/travel-system
        \`\`\`

        ## Usage
        Basic implementation example

        ## API Reference
        \`\`\`json
        {
          "endpoints": [
            {
              "method": "POST",
              "path": "/api/forms/travel-request",
              "description": "Submit travel request"
            }
          ]
        }
        \`\`\`
      `
    }
  }
];

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose'
});

export default function Documentation() {
  const [selectedProject, setSelectedProject] = useState<string>(projects[0].id);
  const currentProject = projects.find(p => p.id === selectedProject);

  useEffect(() => {
    // Initialize mermaid diagrams after render
    mermaid.contentLoaded();
  }, [selectedProject]);

  const handleProjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProject(event.target.value as string);
  };

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (inline) {
        return <code className={className} {...props}>{children}</code>;
      }
      
      if (className === 'language-mermaid') {
        return <div className="mermaid">{children}</div>;
      }
      
      return (
        <SyntaxHighlighter
          style={tomorrow}
          language={match ? match[1] : 'text'}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
  };

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>{currentProject?.name} Documentation</h1>
        <div className="documentation-selector">
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            variant="outlined"
            sx={{
              minWidth: 200,
              backgroundColor: 'white',
              boxShadow: 'none',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", sans-serif',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '& .MuiSelect-select': {
                padding: '8px 14px'
              }
            }}
            renderValue={(selected) => {
              const project = projects.find(p => p.id === selected);
              return project?.name;
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  marginTop: '8px',
                  '& .MuiMenuItem-root': {
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", sans-serif',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }
                  }
                }
              }
            }}
          >
            {projects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
                {project.id === selectedProject && (
                  <CheckIcon sx={{ ml: 1, fontSize: 16, color: '#666' }} />
                )}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="documentation-layout">
        <nav className="documentation-sidebar">
          <div className="sidebar-section">
            <h3>Overview</h3>
            <a href="#overview" className="sidebar-link">Overview</a>
            <a href="#setup" className="sidebar-link">Setup</a>
            <a href="#usage" className="sidebar-link">Usage</a>
            <a href="#api" className="sidebar-link">API Reference</a>
          </div>

          <div className="sidebar-section">
            <h3>API Endpoints</h3>
            <a href="#create-request" className="sidebar-link">Create Request</a>
            <a href="#view-requests" className="sidebar-link">View Requests</a>
            <a href="#update-request" className="sidebar-link">Update Request</a>
            <div className="sidebar-subsection">
              <a href="#status-codes" className="sidebar-sublink">Status Codes</a>
              <a href="#error-handling" className="sidebar-sublink">Error Handling</a>
            </div>
          </div>
        </nav>

        <main className="documentation-main">
          <h1>{currentProject?.name}</h1>
          <p>{currentProject?.description}</p>
          
          <section>
            <h2>Overview</h2>
            <p>{currentProject?.documentation.overview}</p>
          </section>

          <section>
            <h2>Setup</h2>
            <p>{currentProject?.documentation.setup}</p>
          </section>

          <section>
            <h2>Usage</h2>
            <p>{currentProject?.documentation.usage}</p>
          </section>

          {currentProject?.documentation.api && (
            <section>
              <h2>API Reference</h2>
              {currentProject.documentation.api.endpoints.map((endpoint, index) => (
                <div key={index}>
                  <h3>{endpoint.method} {endpoint.path}</h3>
                  <p>{endpoint.description}</p>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
