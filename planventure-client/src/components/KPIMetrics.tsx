import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './KPIMetrics.css';

interface Metric {
  value: string;
  label: string;
  sublabel?: string;
}

const metrics: Metric[] = [
  { value: '2.1s', label: 'Order Processing Time', sublabel: 'Avg. processing time' },
  { value: '99.9%', label: 'Fulfillment Rate', sublabel: 'Orders processed successfully' },
  { value: '396mi', label: 'Supply Chain Range', sublabel: 'Global network coverage' },
  { value: '200k+', label: 'Orders Delivered', sublabel: 'Across 50+ countries' }
];

export default function KPIMetrics() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="metrics-container">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <motion.div 
            className="metric-value"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {metric.value}
          </motion.div>
          <div className="metric-details">
            <div className="metric-label">{metric.label}</div>
            {metric.sublabel && (
              <div className="metric-sublabel">{metric.sublabel}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
