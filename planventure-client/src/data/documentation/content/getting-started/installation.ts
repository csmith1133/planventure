export const installationContent = {
  title: 'Installation',
  content: [
    {
      type: 'text',
      content: '# Installation Guide\n\nFollow these steps to set up PlanVenture locally.'
    },
    {
      type: 'mermaid',
      content: `
graph TD
    A[Clone Repository] -->|git clone| B[Install Dependencies]
    B -->|npm install| C[Configure Environment]
    C -->|.env setup| D[Start Development]
    D -->|npm run dev| E[Ready!]
      `
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Clone the repository
git clone https://github.com/yourusername/planventure.git
cd planventure

# Install dependencies
npm install

# Setup environment
cp .env.example .env`
    }
  ]
};
