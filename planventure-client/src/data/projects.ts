export interface Project {
  id: string;
  title: string;  // changed from name
  description: string;
  url?: string;    // Make optional since docs-only projects don't need URLs
  isExternal?: boolean;
  imageUrl?: string; // Make optional since docs-only projects don't need images
  documentationId?: string;
  documentationOnly?: boolean; // Add this flag
}

export const projects: Project[] = [
  {
    id: 'web-application',
    title: 'Fin FresHQ',
    description: 'Documentation for the Fin FresHQ web application architecture, components, and development guidelines.',
    documentationOnly: true // Add this flag
  },
  {
    id: 'top-variances',
    title: 'Top Variances',  // changed from name
    description: 'Financial variance analysis tool',
    url: 'https://us-finance-top-variances.dwh-k8s.hellofresh.io/',  // changed from viewPath
    isExternal: true,
    imageUrl: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b',
    documentationId: 'project-1'
  },
  {
    id: 'budget-tracker',
    title: 'Budget Tracker',  // changed from name
    description: 'Track and manage departmental budgets',
    url: '/projects/budget-tracker',  // changed from viewPath
    imageUrl: 'https://images.unsplash.com/photo-1485550409059-9afb054cada4',
    documentationId: 'project-2'
  },
  {
    id: 'expense-analytics',
    title: 'Expense Analytics',  // changed from name
    description: 'Detailed expense analysis dashboard',
    url: '/projects/expense-analytics',  // changed from viewPath
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    documentationId: 'project-3'
  },
  {
    id: 'forecast-model',
    title: 'Forecast Model',  // changed from name
    description: 'Financial forecasting and modeling',
    url: '/projects/forecast',  // changed from viewPath
    imageUrl: 'https://images.unsplash.com/photo-1429087969512-1e85aab2683d',
    documentationId: 'project-4'
  },
  {
    id: 'revenue-insights',
    title: 'Revenue Insights',  // changed from name
    description: 'Revenue analysis and reporting',
    url: 'https://revenue-insights.dwh-k8s.hellofresh.io/',  // changed from viewPath
    isExternal: true,
    imageUrl: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee',
    documentationId: 'project-5'
  },
  {
    id: 'cost-allocation',
    title: 'Cost Allocation',  // changed from name
    description: 'Department cost allocation tool',
    url: '/projects/cost-allocation',  // changed from viewPath
    imageUrl: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9',
    documentationId: 'project-6'
  },
  {
    id: 'p-and-l',
    title: 'P&L Dashboard',  // changed from name
    description: 'Profit and Loss Analysis',
    url: 'https://pl-dashboard.dwh-k8s.hellofresh.io/',  // changed from viewPath
    isExternal: true,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    documentationId: 'project-7'
  },
  {
    id: 'account-reconciliation',
    title: 'Account Reconciliation',  // changed from name
    description: 'Automated account reconciliation system',
    url: '/projects/reconciliation',  // changed from viewPath
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    documentationId: 'project-8'
  }
];

// Helper function to get visible projects
export const getVisibleProjects = () => projects.filter(p => !p.documentationOnly);
