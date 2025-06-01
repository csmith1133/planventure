interface DocContent {
    [key: string]: {
      overview: string;
      setup: string;
      usage: string;
      api: {
        endpoints: Array<{
          method: string;
          path: string;
          description: string;
        }>;
      };
    }
  }
  
  export const documentation: DocContent = {
    'top-variances': {
      overview: 'Financial variance analysis tool that helps identify and analyze top spending variances across departments.',
      setup: 'Access requires proper authentication and role assignment. Contact FinOps for access.',
      usage: 'Navigate through the dashboard using filters for department, date range, and variance thresholds.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/variances',
            description: 'Retrieve variance data with optional filters'
          },
          {
            method: 'POST',
            path: '/api/variances/export',
            description: 'Export filtered variance data'
          }
        ]
      }
    },
    'budget-tracker': {
      overview: 'Internal tool for tracking and managing departmental budgets throughout the fiscal year.',
      setup: 'Access requires internal network and valid user credentials.',
      usage: 'Navigate to the budget dashboard, select your department, and view/edit budget allocations.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/budgets',
            description: 'Retrieve budget data for the logged-in user\'s department'
          },
          {
            method: 'POST',
            path: '/api/budgets',
            description: 'Create or update budget allocations'
          }
        ]
      }
    },
    'expense-analytics': {
      overview: 'Comprehensive expense analysis dashboard for detailed spending insights.',
      setup: 'No setup required, accessible via the internal portal.',
      usage: 'Access through internal portal, filter by category, date, and department.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/expenses',
            description: 'Retrieve expense data with optional filters'
          },
          {
            method: 'POST',
            path: '/api/expenses/report',
            description: 'Generate detailed expense reports'
          }
        ]
      }
    },
    'forecast-model': {
      overview: 'Financial forecasting and modeling tool for future planning.',
      setup: 'Requires access to the financial modeling environment. Contact FinOps for access.',
      usage: 'Use the modeling interface to create and adjust forecasts.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/forecasts',
            description: 'Retrieve existing forecasts'
          },
          {
            method: 'POST',
            path: '/api/forecasts',
            description: 'Create or update financial forecasts'
          }
        ]
      }
    },
    'revenue-insights': {
      overview: 'Revenue analysis and reporting dashboard with real-time updates.',
      setup: 'Access requires proper authentication. Ensure you have the necessary permissions.',
      usage: 'Access through external link, view revenue metrics and trends.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/revenue',
            description: 'Retrieve revenue data and insights'
          },
          {
            method: 'POST',
            path: '/api/revenue/report',
            description: 'Generate revenue reports'
          }
        ]
      }
    },
    'cost-allocation': {
      overview: 'Tool for managing and tracking departmental cost allocations.',
      setup: 'Access requires integration with departmental accounting systems.',
      usage: 'Select department and period to view/adjust allocations.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/costs',
            description: 'Retrieve cost allocation data'
          },
          {
            method: 'POST',
            path: '/api/costs',
            description: 'Update cost allocations'
          }
        ]
      }
    },
    'p-and-l': {
      overview: 'Profit and Loss dashboard with detailed financial reporting.',
      setup: 'Ensure you have access to the financial reporting systems.',
      usage: 'Access through external link, view P&L statements and metrics.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/pl',
            description: 'Retrieve Profit and Loss data'
          },
          {
            method: 'POST',
            path: '/api/pl/report',
            description: 'Generate P&L reports'
          }
        ]
      }
    },
    'account-reconciliation': {
      overview: 'Automated system for account reconciliation processes.',
      setup: 'Contact Accounting Systems to ensure your accounts are set up for reconciliation.',
      usage: 'Select accounts to reconcile, view discrepancies and status.',
      api: {
        endpoints: [
          {
            method: 'GET',
            path: '/api/reconciliation',
            description: 'Retrieve reconciliation status and discrepancies'
          },
          {
            method: 'POST',
            path: '/api/reconciliation/adjust',
            description: 'Adjust reconciliation discrepancies'
          }
        ]
      }
    },
    'web-application': {
      overview: `The PlanVenture web application is built using React, TypeScript, and Material-UI. 
      It provides a modern interface for managing planning and venture processes.`,
      
      setup: `# Development Setup
      1. Install dependencies: npm install
      2. Configure environment variables
      3. Start development server: npm start`,
      
      usage: `The application is organized into several key areas:
      - Authentication & Authorization
      - Form Management
      - Documentation System
      - API Integration`,
      
      api: {
        endpoints: [
          {
            method: 'Component Structure',
            path: '/src/components',
            description: 'Core React components organized by feature'
          },
          {
            method: 'API Services',
            path: '/src/services',
            description: 'API integration and data fetching layer'
          },
          {
            method: 'Utilities',
            path: '/src/utils',
            description: 'Common utilities and helper functions'
          }
        ]
      },
  
      sections: {
        architecture: {
          title: 'Architecture',
          content: 'Frontend architecture details and design patterns'
        },
        stateManagement: {
          title: 'State Management',
          content: 'How application state is managed and updated'
        },
        routing: {
          title: 'Routing',
          content: 'Navigation and route configuration'
        },
        styling: {
          title: 'Styling',
          content: 'CSS organization and Material-UI theme customization'
        }
      }
    },
    'planventure-api': {
      overview: `PlanVenture API is a Flask-based REST API that handles authentication, form management, and email services.`,
      sections: {
        authentication: {
          title: 'Authentication',
          content: `
  ## Authentication Endpoints
  - POST /auth/login
  - POST /auth/register
  - POST /auth/forgot-password
  - POST /auth/reset-password`
        },
        emailService: {
          title: 'Email Service',
          content: `
  ## Email Service Components
  - Password Reset Emails
  - Token Generation & Validation
  - Email Templates`
        },
        database: {
          title: 'Database',
          content: `
  ## Database Structure
  - User Management
  - Form Data Storage
  - Token Management`
        }
      },
      api: {
        endpoints: [
          {
            method: 'POST',
            path: '/auth/login',
            description: 'Authenticate user and return JWT tokens'
          },
          {
            method: 'POST',
            path: '/auth/reset-password',
            description: 'Reset user password with valid token'
          }
        ]
      }
    },
    'planventure-client': {
      overview: `React-based frontend application with TypeScript and Material-UI`,
      sections: {
        components: {
          title: 'Components',
          content: `
  ## Core Components
  - Authentication Forms
  - Documentation System
  - Navigation
  - Form Management`
        },
        routing: {
          title: 'Routing',
          content: `
  ## Route Structure
  - Protected Routes
  - Public Routes
  - Navigation Guards`
        },
        state: {
          title: 'State Management',
          content: `
  ## Application State
  - Authentication State
  - Form State
  - User Preferences`
        }
      }
    }
  };
