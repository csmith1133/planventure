import Carousel from '../components/Carousel';
import DashboardMetrics from '../components/DashboardMetrics';
import SmallCarousel from '../components/SmallCarousel';
import WorldClocks from '../components/WorldClocks';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* <KPIMetrics /> */}
      <Carousel />
      <SmallCarousel />
      <DashboardMetrics />
      <WorldClocks />
    </div>
  );
}
