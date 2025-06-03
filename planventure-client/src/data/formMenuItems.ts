export interface FormMenuItem {
    id: string;
    name: string;
    description: string;
    viewPath: string;
  }
  
  export const formMenuItems: FormMenuItem[] = [
    {
      id: 'purchase-request',
      name: 'Purchase Request',
      description: 'Request new purchases',
      viewPath: '/forms/purchase-request/view',
    },
    {
      id: 'travel-request',
      name: 'Travel Request',
      description: 'Request travel approval',
      viewPath: '/forms/travel-request/view',
    },
    {
      id: 'time-off',
      name: 'Time Off Request',
      description: 'Submit time off requests',
      viewPath: '/forms/time-off/view',
    },
    {
      id: 'expense-report',
      name: 'Expense Report',
      description: 'Submit expense reports',
      viewPath: '/forms/expense-report/view',
    }
  ];
  