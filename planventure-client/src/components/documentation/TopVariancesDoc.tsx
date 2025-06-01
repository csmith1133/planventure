import { useEffect } from 'react';
import './styles/Documentation.css';

export default function TopVariancesDoc() {
  useEffect(() => {
    // Any initialization needed
  }, []);

  return (
    <div className="documentation-content">
      <h1>Top Variances Documentation</h1>
      
      <section>
        <h2>Overview</h2>
        <p>Financial variance analysis tool that helps identify and analyze top spending variances across departments.</p>
      </section>

      <section>
        <h2>Setup</h2>
        <p>Access requires proper authentication and role assignment. Contact FinOps for access.</p>
      </section>

      <section>
        <h2>API Reference</h2>
        <div className="api-endpoint">
          <span className="method get">GET</span>
          <code>/api/variances</code>
          <p>Retrieve variance data with optional filters</p>
        </div>
      </section>
    </div>
  );
}
