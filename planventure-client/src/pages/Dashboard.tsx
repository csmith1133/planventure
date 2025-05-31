import Carousel from '../components/Carousel';
import SmallCarousel from '../components/SmallCarousel';
import WorldClocks from '../components/WorldClocks';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Carousel />
      <SmallCarousel />
      <WorldClocks />
    </div>
  );
}
