import React, { useEffect, useState } from 'react';
import '../styles/VisitorGlobe.scss';

interface Visitor {
  id: number;
  lat: number;
  lng: number;
  city: string;
}

// Simulated visitor data from around the world
const sampleVisitors: Visitor[] = [
  { id: 1, lat: 40.7, lng: -74.0, city: "New York" },
  { id: 2, lat: 42.3, lng: -83.7, city: "Ann Arbor" },
  { id: 3, lat: 39.9, lng: 116.4, city: "Beijing" },
  { id: 4, lat: 31.2, lng: 121.5, city: "Shanghai" },
  { id: 5, lat: 37.8, lng: -122.4, city: "San Francisco" },
  { id: 6, lat: 51.5, lng: -0.1, city: "London" },
  { id: 7, lat: 35.7, lng: 139.7, city: "Tokyo" },
  { id: 8, lat: 30.3, lng: 120.2, city: "Hangzhou" },
  { id: 9, lat: 48.9, lng: 2.3, city: "Paris" },
  { id: 10, lat: -33.9, lng: 151.2, city: "Sydney" },
];

const VisitorGlobe: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitor, setActiveVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    // Simulate visitors appearing over time
    const shuffled = [...sampleVisitors].sort(() => Math.random() - 0.5);
    const count = 5 + Math.floor(Math.random() * 5);
    setVisitors(shuffled.slice(0, count));
  }, []);

  // Convert lat/lng to position on a flat map projection
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="visitor-globe">
      <div className="globe-header">
        <h3>Visitors Around the World</h3>
        <span className="visitor-count">{visitors.length} recent visitors</span>
      </div>
      <div className="globe-map">
        <div className="world-map">
          {visitors.map((v) => {
            const pos = getPosition(v.lat, v.lng);
            return (
              <div
                key={v.id}
                className={`visitor-dot ${activeVisitor?.id === v.id ? 'active' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setActiveVisitor(v)}
                onMouseLeave={() => setActiveVisitor(null)}
              >
                <div className="pulse" />
                {activeVisitor?.id === v.id && (
                  <div className="tooltip">{v.city}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisitorGlobe;