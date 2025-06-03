import { DollarSign, Package } from 'react-feather';
import './DashboardMetrics.css';

export default function DashboardMetrics() {
  return (
    <div className="dashboard-metrics">
      <div className="metrics-content">
        <h2>Global Business Performance</h2>
        <p>Monitor year-to-date order volume and revenue across our global operations.</p>
      </div>
      <div className="metrics-values">
        <div className="dashboard-metric">
          <div className="metric-row">
            <div className="value">5,263,795</div>
            <div className="icon-circle">
              <Package size="clamp(24px, 2.5vw + 15px, 30px)" strokeWidth={2} />
            </div>
          </div>
          <div className="label">Boxes YTD</div>
        </div>
        <div className="dashboard-metric">
          <div className="metric-row">
            <div className="value">$127,654,232</div>
            <div className="icon-circle">
              <DollarSign size="clamp(24px, 2.5vw + 15px, 30px)" strokeWidth={2} />
            </div>
          </div>
          <div className="label">Revenue YTD</div>
        </div>
      </div>
    </div>
  );
}
